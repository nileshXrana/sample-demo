import { Module } from '@nestjs/common';
import { LoginUserModule } from './login-user/login-user.module';
import { RegisterUserModule } from './register-user/register-user.module';
import { LogoutUserModule } from './logout-user/logout-user.module';
import { LoginWithGoogleModule } from './login-with-google/login-with-google.module';

@Module({
  imports: [LoginUserModule, RegisterUserModule, LogoutUserModule, LoginWithGoogleModule],
})
export class AuthModule {}
