import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './users.entity';
import { Tag } from './tags.entity';
import { EmploymentType, JobStatus } from '../enums/job.enum';

@Entity('jobs')
export class Job {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  admin_id: string;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'varchar', nullable: true })
  department: string | null;

  @Column({ type: 'varchar', nullable: true })
  location: string | null;

  @Column({ type: 'enum', enum: EmploymentType })
  employment_type: EmploymentType;

  @Column({ type: 'integer', default: 0 })
  minimum_experience: number;

  @Column({ type: 'date', nullable: true })
  application_deadline: Date | null;

  @Column({ type: 'enum', enum: JobStatus, default: JobStatus.Open })
  status: JobStatus;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'admin_id' })
  admin: User;

  @ManyToMany(() => Tag, (tag) => tag.jobs)
  @JoinTable({
    name: 'job_tags',
    joinColumn: { name: 'job_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tag_id', referencedColumnName: 'id' },
  })
  tags: Tag[];
}
