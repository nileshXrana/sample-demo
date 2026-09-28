import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Application } from './applications.entity';
import { ApplicationStatus } from '../enums/job.enum';
import { User } from './users.entity';

@Entity('application_status_history')
export class ApplicationStatusHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  application_id: string;

  @Column({ type: 'enum', enum: ApplicationStatus })
  from_status: ApplicationStatus | null;

  @Column({ type: 'enum', enum: ApplicationStatus })
  to_status: ApplicationStatus;

  @Column({ type: 'uuid' })
  performed_by: string;

  @Column({ type: 'varchar' })
  performed_by_role: string;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => Application)
  @JoinColumn({ name: 'application_id' })
  application: Application;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'performed_by' })
  actor: User;
}
