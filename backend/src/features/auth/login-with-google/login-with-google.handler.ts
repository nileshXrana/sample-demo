import { Injectable } from '@nestjs/common';
import { FirebaseAdminService } from '../../../infrastructure/firebase/firebase-admin.service';
import { FindUserHandler } from '../../users/find-user/find-user.handler';
import { CreateGoogleUserHandler } from 'src/features/users/create-google-user/create-google-user.handler';
import { JwtService } from 'node_modules/@nestjs/jwt/dist/jwt.service';

@Injectable()
export class LoginWithGoogleHandler {
  constructor(
    private readonly firebaseAdminService: FirebaseAdminService,
    private readonly findUserHandler: FindUserHandler,
    private readonly createGoogleUserHandler: CreateGoogleUserHandler,
    private readonly jwtService: JwtService,
  ) {}

  async execute(idToken: string) {
    const firebaseUser = await this.firebaseAdminService.verifyIdToken(idToken);
    // const { uid, email, name, picture } = firebaseUser;
    const { email } = firebaseUser;

    // Find existing user
    const user = await this.findUserHandler.execute(email);

    if (!user) {
      const user = await this.createGoogleUserHandler.execute({
        email: email,
      });
      const payload = { id: user.id };
      const token = await this.jwtService.signAsync(payload);
      return {
        token: token,
        id: user.id,
        email: user.email,
      };
    }
    
    const payload = { id: user.id };
    const token = await this.jwtService.signAsync(payload);
    return {
      token: token,
      id: user.id,
      email: user.email,
    };
  }
}
