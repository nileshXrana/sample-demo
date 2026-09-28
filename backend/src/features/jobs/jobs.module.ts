import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from 'src/domain/entities/jobs.entity';
import { Tag } from 'src/domain/entities/tags.entity';
import { Application } from 'src/domain/entities/applications.entity';
import { ApplicationStatusHistory } from 'src/domain/entities/application-history.entity';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';

@Module({
  imports: [TypeOrmModule.forFeature([Job, Tag, Application, ApplicationStatusHistory])],
  controllers: [JobsController],
  providers: [JobsService],
})
export class JobsModule {}
