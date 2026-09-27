import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { FindUserHandler } from '../../users/find-user/find-user.handler';
import { LoginUserValidator } from './login-user.validator';
import * as bcrypt from 'bcrypt';

@Injectable()
export class LoginUserHandler {
  constructor(
    private jwtService: JwtService,
    private readonly findUserHandler: FindUserHandler,
  ) {}

  async execute(loginUser: LoginUserValidator) {
    const { email, password } = loginUser;

    const user = await this.findUserHandler.execute(email);

    if (user) {
      if (!user.password) {
        throw new UnauthorizedException('This account uses Google login');
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new UnauthorizedException('Invalid Password');
      }

      const payload = { id: user.id };
      const token = await this.jwtService.signAsync(payload);
      return {
        token: token,
        id: user.id,
        email: user.email,
      };
    } else {
      throw new UnauthorizedException('Invalid Email');
    }
  }
}
