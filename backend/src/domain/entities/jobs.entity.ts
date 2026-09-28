// import {
//   Entity,
//   PrimaryGeneratedColumn,
//   Column,
//   CreateDateColumn,
//   UpdateDateColumn,
// } from 'typeorm';

// @Entity('jobs')
// export class Job {
//   @PrimaryGeneratedColumn('uuid')
//   id: string;

//   @Column({ type: 'uuid' })
//   admin_id: string;

//   @Column({ type: 'varchar' })
//   title: string;

//   @Column({ type: 'text' })
//   department: string;

//   @Column({ type: 'varchar' })
//   location: string;

//   @Column({ type: 'varchar' })
//   employement_type: string;

//   @Column({ type: 'date' })
//   application_deadline: Date;

//   @Column({ type: 'text' })
//   status: string;

//   @Column({ type: 'integer' })
//   minimun_experience: number;

//   @CreateDateColumn()
//   created_at: Date;

//   @UpdateDateColumn()
//   updated_at: Date;
// }
