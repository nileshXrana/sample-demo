import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToMany,
} from 'typeorm';
import { ApplicantProfile } from './applicant-profiles.entity';

@Entity('tags')
export class Tag {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @CreateDateColumn()
  created_at: Date;

  // relationships:
  @ManyToMany(
    () => ApplicantProfile,
    (applicantProfile) => applicantProfile.tags,
  )
  applicant_profiles: ApplicantProfile[];
}
