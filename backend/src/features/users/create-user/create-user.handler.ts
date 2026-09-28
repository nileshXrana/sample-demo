import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { CreateUserValidator } from './create-user.validator';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/domain/entities/users.entity';
import { In, Repository } from 'typeorm';
import { ApplicantProfile } from 'src/domain/entities/applicant-profiles.entity';
import { Tag } from 'src/domain/entities/tags.entity';

@Injectable()
export class CreateUserHandler {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(ApplicantProfile)
    private readonly applicantProfileRepository: Repository<ApplicantProfile>,
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  // bcrypt
  private readonly saltRounds = 10;
  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, this.saltRounds);
  }

  async execute(createUser: CreateUserValidator) {
    const { name, email, password, about, yearsOfExperience, skills, resume } =
      createUser;

    const hashedPassword = await this.hashPassword(password);
    const existingUser = await this.userRepository.findOne({
      where: [{ email: email }],
    });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }
    const newUser = this.userRepository.create({
      name: name,
      email: email,
      password: hashedPassword,
    });

    const user = await this.userRepository.save(newUser);

    // save user profile details in applicant_profile table:
    const applicantProfile = this.applicantProfileRepository.create({
      applicant_id: user.id,
      years_of_experience: yearsOfExperience,
      about: about,
      resume: resume,
    });
    await this.applicantProfileRepository.save(applicantProfile);

    // save skills in tags table:
    if (skills && skills.length > 0) {
      const existingTags = await this.tagRepository.find({
        where: { name: In(skills) },
      });

      const existingTagNames = existingTags.map((tag) => tag.name);
      const newTagNames = skills.filter(
        (skill) => !existingTagNames.includes(skill),
      );

      const newTags = this.tagRepository.create(
        newTagNames.map((name) => ({ name })),
      );
      await this.tagRepository.save(newTags);

      // now save all tags (existing + new) in applicant_tags join table:
      const allTags = [...existingTags, ...newTags];
      applicantProfile.tags = allTags;
      await this.applicantProfileRepository.save(applicantProfile);
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }
}
