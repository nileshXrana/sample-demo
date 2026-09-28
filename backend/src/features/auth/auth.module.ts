import { Module } from '@nestjs/common';
import { LoginUserModule } from './login-user/login-user.module';
import { RegisterUserModule } from './register-user/register-user.module';
import { LogoutUserModule } from './logout-user/logout-user.module';

@Module({
  imports: [LoginUserModule, RegisterUserModule, LogoutUserModule],
})
export class AuthModule {}
