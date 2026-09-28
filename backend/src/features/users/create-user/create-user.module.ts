import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateUserHandler } from './create-user.handler';
import { User } from 'src/domain/entities/users.entity';
import { Tag } from 'src/domain/entities/tags.entity';
import { ApplicantProfile } from 'src/domain/entities/applicant-profiles.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, ApplicantProfile, Tag])],
  providers: [CreateUserHandler],
  exports: [CreateUserHandler],
})
export class CreateUserModule {}
