import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateGoogleUserHandler } from './create-google-user.handler';
import { User } from 'src/domain/entities/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [CreateGoogleUserHandler],
  exports: [CreateGoogleUserHandler],
})
export class CreateGoogleUserModule {}
