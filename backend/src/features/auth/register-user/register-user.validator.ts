import {
  IsArray,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class RegisterUserValidator {
  @IsString()
  @MinLength(2, { message: 'Name must be at least 2 characters long' })
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  // profile
  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value === '' ? undefined : value))
  about: string;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (value === '' || value === null ? undefined : Number(value)))
  yearsOfExperience: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) =>
    Array.isArray(value) ? value.filter((skill) => skill?.trim()) : value,
  )
  skills: string[];

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value === '' || value === null ? undefined : value))
  resume: string;
}
