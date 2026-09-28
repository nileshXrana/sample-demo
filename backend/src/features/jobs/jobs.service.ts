import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, ILike, Repository } from 'typeorm';
import { Job } from 'src/domain/entities/jobs.entity';
import { Tag } from 'src/domain/entities/tags.entity';
import { Application } from 'src/domain/entities/applications.entity';
import { ApplicationStatusHistory } from 'src/domain/entities/application-history.entity';
import { ApplicationStatus, JobStatus } from 'src/domain/enums/job.enum';
import { CreateJobDto, JobQueryDto, UpdateJobDto } from './jobs.dto';

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job) private readonly jobs: Repository<Job>,
    @InjectRepository(Tag) private readonly tags: Repository<Tag>,
    @InjectRepository(Application)
    private readonly applications: Repository<Application>,
    @InjectRepository(ApplicationStatusHistory)
    private readonly history: Repository<ApplicationStatusHistory>,
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}

  private async resolveTags(names: string[] = []) {
    const cleanNames = [
      ...new Set(
        names.map((name) => name.trim().toLowerCase()).filter(Boolean),
      ),
    ];
    if (!cleanNames.length) return [];
    const existing = await this.tags.find({
      where: cleanNames.map((name) => ({ name })),
    });
    const existingNames = new Set(existing.map((tag) => tag.name));
    const created = await this.tags.save(
      cleanNames
        .filter((name) => !existingNames.has(name))
        .map((name) => this.tags.create({ name })),
    );
    return [...existing, ...created];
  }

  async create(adminId: string, dto: CreateJobDto) {
    const job = this.jobs.create({
      ...dto,
      admin_id: adminId,
      minimum_experience: dto.minimum_experience ?? 0,
      application_deadline: dto.application_deadline
        ? new Date(dto.application_deadline)
        : null,
      tags: await this.resolveTags(dto.skills),
    });
    return this.jobs.save(job);
  }

  async update(adminId: string, id: string, dto: UpdateJobDto) {
    const job = await this.jobs.findOne({ where: { id }, relations: { tags: true } });
    if (!job) throw new NotFoundException('Job not found');
    Object.assign(job, dto);
    if (dto.application_deadline !== undefined)
      job.application_deadline = dto.application_deadline
        ? new Date(dto.application_deadline)
        : null;
    if (dto.skills !== undefined) job.tags = await this.resolveTags(dto.skills);
    return this.jobs.save(job);
  }

  async close(adminId: string, id: string) {
    const job = await this.jobs.findOneBy({ id, admin_id: adminId });
    if (!job) throw new NotFoundException('Job not found');
    job.status = JobStatus.Closed;
    return this.jobs.save(job);
  }

  async list(query: JobQueryDto, applicantOnly = false) {
    const builder = this.jobs
      .createQueryBuilder('job')
      .leftJoinAndSelect('job.tags', 'tag');
    if (applicantOnly)
      builder
        .andWhere('job.status = :open', { open: JobStatus.Open })
        .andWhere(
          '(job.application_deadline IS NULL OR job.application_deadline >= CURRENT_DATE)',
        );
    if (query.search)
      builder.andWhere('LOWER(job.title) LIKE LOWER(:search)', {
        search: `%${query.search}%`,
      });
    if (query.department)
      builder.andWhere('LOWER(job.department) = LOWER(:department)', {
        department: query.department,
      });
    if (query.location)
      builder.andWhere('LOWER(job.location) = LOWER(:location)', {
        location: query.location,
      });
    if (query.employment_type)
      builder.andWhere('job.employment_type = :employmentType', {
        employmentType: query.employment_type,
      });
    if (query.minimum_experience !== undefined)
      builder.andWhere('job.minimum_experience >= :minimumExperience', {
        minimumExperience: query.minimum_experience,
      });
    if (query.status && !applicantOnly)
      builder.andWhere('job.status = :status', { status: query.status });
    if (query.tag)
      builder.andWhere('LOWER(tag.name) = LOWER(:tag)', { tag: query.tag });
    const sort =
      query.sort === 'application_deadline'
        ? 'job.application_deadline'
        : 'job.created_at';
    const [items, total] = await builder
      .orderBy(sort, 'DESC')
      .skip((query.page - 1) * query.limit)
      .take(query.limit)
      .getManyAndCount();
    return {
      items,
      total,
      page: query.page,
      limit: query.limit,
      pages: Math.ceil(total / query.limit),
    };
  }

  async findOne(id: string) {
    const job = await this.jobs.findOne({ where: { id }, relations: { tags: true } });
    if (!job) throw new NotFoundException('Job not found');
    return job;
  }

  async apply(applicantId: string, jobId: string) {
    const job = await this.jobs.findOneBy({ id: jobId });
    if (
      !job ||
      job.status !== JobStatus.Open ||
      (job.application_deadline && job.application_deadline < new Date())
    )
      throw new BadRequestException('This job is not accepting applications');
    const duplicate = await this.applications.findOneBy({
      job_id: jobId,
      applicant_id: applicantId,
    });
    if (duplicate)
      throw new ConflictException('You have already applied to this job');
    return this.dataSource.transaction(async (manager) => {
      const application = await manager.save(
        manager.create(Application, {
          job_id: jobId,
          applicant_id: applicantId,
        }),
      );
      await manager.save(
        manager.create(ApplicationStatusHistory, {
          application_id: application.id,
          from_status: null,
          to_status: ApplicationStatus.Applied,
          performed_by: applicantId,
          performed_by_role: 'applicant',
        }),
      );
      return application;
    });
  }

  async applicationsFor(
    userId: string,
    isAdmin: boolean,
    page = 1,
    limit = 10,
    status?: ApplicationStatus,
  ) {
    const where = isAdmin
      ? status
        ? { status }
        : {}
      : { applicant_id: userId, ...(status ? { status } : {}) };
    const [items, total] = await this.applications.findAndCount({
      where,
      relations: { job: true, applicant: true, profile: true },
      skip: (page - 1) * limit,
      take: limit,
      order: { applied_at: 'DESC' },
    });
    return { items, total, page, limit, pages: Math.ceil(total / limit) };
  }

  async changeStatus(
    actor: { id: string; role: string },
    applicationId: string,
    next: ApplicationStatus,
  ) {
    const application = await this.applications.findOneBy({
      id: applicationId,
    });
    if (!application) throw new NotFoundException('Application not found');
    const previousStatus = application.status;
    const adminTransitions: Record<string, ApplicationStatus[]> = {
      applied: [ApplicationStatus.Shortlisted, ApplicationStatus.Rejected],
      shortlisted: [ApplicationStatus.Interview, ApplicationStatus.Rejected],
      interview: [ApplicationStatus.Offer, ApplicationStatus.Rejected],
      offer: [ApplicationStatus.Hired, ApplicationStatus.Rejected],
    };
    const applicantTransitions: Record<string, ApplicationStatus[]> = {
      applied: [ApplicationStatus.Withdrawn],
      shortlisted: [ApplicationStatus.Withdrawn],
      interview: [ApplicationStatus.Withdrawn],
      offer: [ApplicationStatus.Withdrawn],
    };
    const allowed =
      actor.role === 'admin'
        ? adminTransitions[application.status]
        : application.applicant_id === actor.id
          ? applicantTransitions[application.status]
          : [];
    if (!allowed?.includes(next))
      throw new ForbiddenException('This status transition is not allowed');
    await this.dataSource.transaction(async (manager) => {
      application.status = next;
      await manager.save(application);
      await manager.save(
        manager.create(ApplicationStatusHistory, {
          application_id: application.id,
          from_status: previousStatus,
          to_status: next,
          performed_by: actor.id,
          performed_by_role: actor.role,
        }),
      );
    });
    return application;
  }
}
