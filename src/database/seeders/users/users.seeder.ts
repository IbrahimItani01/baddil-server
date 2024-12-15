import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { faker } from '@faker-js/faker';
import { UserTypeEnum } from 'src/utils/enums.utils';
import { generateValidPassword } from 'src/utils/seeders/users.functions';

@Injectable()
export class UserSeeder {
  private readonly registerUrl = 'http://localhost:8800/api/auth/register';

  async seedUsers(count: number): Promise<void> {
    const promises = Array.from({ length: count }).map(async () => {
      const fakeUser = {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        user_type: faker.helpers.arrayElement(Object.values(UserTypeEnum)),
        profile_picture: faker.image.avatar(),
        password: generateValidPassword(),
      };

      try {
        const response = await axios.post(this.registerUrl, fakeUser);
        console.log(`User registered:`, response.data.data);
      } catch (error) {
        console.error(
          `Failed to register user:`,
          error.response?.data || error.message,
        );
      }
    });

    await Promise.all(promises);
    console.log(`${count} users have been seeded!`);
  }
}
