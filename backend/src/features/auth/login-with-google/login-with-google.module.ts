import { Module } from '@nestjs/common';
import { LoginWithGoogleController } from './login-with-google.controller';
import { LoginWithGoogleHandler } from './login-with-google.handler';
import { CreateGoogleUserModule } from 'src/features/users/create-google-user/create-google-user.module';
import { FindUserModule } from 'src/features/users/find-user/find-user.module';
import { FirebaseAdminService } from 'src/infrastructure/firebase/firebase-admin.service';

@Module({
  imports: [CreateGoogleUserModule, FindUserModule],
  controllers: [LoginWithGoogleController],
  providers: [LoginWithGoogleHandler, FirebaseAdminService]
})
export class LoginWithGoogleModule {}
