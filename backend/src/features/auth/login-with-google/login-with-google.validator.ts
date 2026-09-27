import { IsNotEmpty, IsString } from 'class-validator';

export class LoginWithGoogleValidator {
  @IsString()
  @IsNotEmpty()
  idToken: string;
}