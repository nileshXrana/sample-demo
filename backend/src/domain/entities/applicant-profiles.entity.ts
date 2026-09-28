import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { User } from './users.entity';
import { Tag } from './tags.entity';

@Entity('applicant_profiles')
export class ApplicantProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  applicant_id: string;

  @Column({ type: 'integer', nullable: true })
  years_of_experience: number;

  @Column({ type: 'text', nullable: true })
  about: string;

  @Column({ type: 'text', nullable: true })
  resume: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // relationships:
  @OneToOne(() => User, (user) => user.applicant_profile)
  @JoinColumn({ name: 'applicant_id' })
  user: User;

  @ManyToMany(() => Tag, (tag) => tag.applicant_profiles)
  @JoinTable({ 
    name: 'applicant_tags',
    joinColumn: { name: 'applicant_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tag_id', referencedColumnName: 'id' }, 
  })
  tags: Tag[];
}
