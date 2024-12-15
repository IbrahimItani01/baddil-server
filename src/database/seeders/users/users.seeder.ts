import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { faker } from '@faker-js/faker';
import { UserTypeEnum } from 'src/utils/enums.utils';

@Injectable()
export class UserSeeder {
  private readonly registerUrl = 'http://localhost:8800/api/auth/register'; // API URL

  async seedUsers(count: number): Promise<void> {
    const promises = Array.from({ length: count }).map(async () => {
      const fakeUser = {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        user_type: faker.helpers.arrayElement(Object.values(UserTypeEnum)),
        profile_picture: faker.image.avatar(),
        password: faker.internet.password(),
      };

