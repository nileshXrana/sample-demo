import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateGoogleUserValidator {
  @IsEmail()
  email: string;
}
