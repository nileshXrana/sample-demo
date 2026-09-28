import { Transform, Type } from 'class-transformer';
import { IsDateString, IsEnum, IsInt, IsOptional, IsString, Min, MinLength } from 'class-validator';
import { ApplicationStatus, EmploymentType, JobStatus } from 'src/domain/enums/job.enum';

export class CreateJobDto {
  @IsString() @MinLength(1)
  title: string;
  @IsOptional() @IsString()
  department?: string;
  @IsOptional() @IsString()
  location?: string;
  @IsEnum(EmploymentType)
  employment_type: EmploymentType;
  @IsOptional() @Type(() => Number) @IsInt() @Min(0)
  minimum_experience?: number;
  @IsOptional() @IsDateString()
  @Transform(({ value }) => (value === '' ? undefined : value))
  application_deadline?: string;
  @IsOptional() @IsEnum(JobStatus)
  status?: JobStatus;
  @IsOptional() @IsString({ each: true })
  skills?: string[];
}

export class UpdateJobDto extends CreateJobDto {}

export class JobQueryDto {
  @IsOptional() @IsString() search?: string;
  @IsOptional() @IsString() department?: string;
  @IsOptional() @IsString() location?: string;
  @IsOptional() @IsEnum(EmploymentType) employment_type?: EmploymentType;
  @IsOptional() @Type(() => Number) @IsInt() @Min(0) minimum_experience?: number;
  @IsOptional() @IsEnum(JobStatus) status?: JobStatus;
  @IsOptional() @IsString() tag?: string;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) page = 1;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) limit = 10;
  @IsOptional() @IsString() sort: 'created_at' | 'application_deadline' = 'created_at';
}

export class ChangeApplicationStatusDto {
  @IsEnum(ApplicationStatus)
  status: ApplicationStatus;
}
