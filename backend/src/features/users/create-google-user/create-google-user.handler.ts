import { ConflictException, Injectable } from '@nestjs/common';
import { CreateGoogleUserValidator } from './create-google-user.validator';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/domain/entities/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CreateGoogleUserHandler {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async execute(createGoogleUser: CreateGoogleUserValidator) {
    const { email } = createGoogleUser;
    const newUser = this.userRepository.create({
      email: email,
    });
    const user = await this.userRepository.save(newUser);
    return {
      id: user.id,
      email: user.email,
    };
  }
}
