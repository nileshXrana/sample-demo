import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { User } from '../../../domain/entities/users.entity';
import { Role } from 'src/infrastructure/enums/role.enum';

export class AdminSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const repository = dataSource.getRepository(User);

    const admins = [
      {
        name: 'admin1',
        email: 'admin1@gmail.com',
        password: 'password',
        role: Role.Admin,
      },
      {
        name: 'admin2',
        email: 'admin2@gmail.com',
        password: 'password',
        role: Role.Admin,
      },
    ];

    for (const admin of admins) {
      const existingUser = await repository.findOne({
        where: { email: admin.email },
      });
      if (!existingUser) {
        const newUser = repository.create(admin);
        await repository.save(newUser);
      }
    }
  }
}
