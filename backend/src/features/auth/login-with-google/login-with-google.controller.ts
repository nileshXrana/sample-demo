import { Controller, Post, Body, Res } from '@nestjs/common';
import { LoginWithGoogleHandler } from './login-with-google.handler';
import { LoginWithGoogleValidator } from './login-with-google.validator';
import type { Response } from 'express';

@Controller('auth')
export class LoginWithGoogleController {
  constructor(
    private readonly loginWithGoogleHandler: LoginWithGoogleHandler,
  ) {}

  @Post('google')
  async loginWithGoogle(
    @Body() loginWithGoogle: LoginWithGoogleValidator,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { token, id, email } = await this.loginWithGoogleHandler.execute(
      loginWithGoogle.idToken,
    );

    response.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return {
      id: id,
      email: email,
    };
  }
}
