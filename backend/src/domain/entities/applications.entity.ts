import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { ApplicantProfile } from './applicant-profiles.entity';
import { Job } from './jobs.entity';
import { User } from './users.entity';
import { ApplicationStatus } from '../enums/job.enum';

@Entity('applications')
@Unique(['job_id', 'applicant_id'])
export class Application {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  job_id: string;

  @Column({ type: 'uuid' })
  applicant_id: string;

  @Column({ type: 'enum', enum: ApplicationStatus, default: ApplicationStatus.Applied })
  status: ApplicationStatus;

  @CreateDateColumn()
  applied_at: Date;

  @ManyToOne(() => Job)
  @JoinColumn({ name: 'job_id' })
  job: Job;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'applicant_id' })
  applicant: User;

  @ManyToOne(() => ApplicantProfile, { nullable: true })
  @JoinColumn({ name: 'applicant_id', referencedColumnName: 'applicant_id' })
  profile: ApplicantProfile;
}
