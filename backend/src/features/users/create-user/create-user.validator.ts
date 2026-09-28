import {
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUserValidator {
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
  @IsNotEmpty({ message: 'About is required' })
  about: string;

  @IsOptional()
  @IsNumber()
  @IsNotEmpty({ message: 'Experience is required' })
  yearsOfExperience: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @ArrayMinSize(1)
  skills: string[];

  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Resume is required' })
  resume: string;
}
