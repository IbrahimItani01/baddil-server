import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { faker } from '@faker-js/faker';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UserTypeEnum } from '../../../utils/enums.utils';
import { User, UserDocument } from '../../../database/schemas/users.schema';

@Injectable()
export class UsersSeeder {
  private readonly registerUrl = 'http://localhost:8800/api/auth/register';

  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  getModel(): Model<UserDocument> {
    return this.userModel;
  }

  async seed(count: number): Promise<void> {
    const userTypes = [
      UserTypeEnum.Admin,
      UserTypeEnum.Barterer,
      UserTypeEnum.Broker,
    ];

    const promises: Promise<any>[] = [];

    for (const userType of userTypes) {
      const fakeUser = {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        user_type: userType,
        profile_picture: faker.image.avatar(),
        password: 'HelloBaddil12345&%',
      };
      promises.push(this.createUser(fakeUser));
    }

    const remainingCount = count - userTypes.length;
    for (let i = 0; i < remainingCount; i++) {
      const randomUserType = faker.helpers.arrayElement(userTypes);
      const fakeUser = {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        user_type: randomUserType,
        profile_picture: faker.image.avatar(),
        password: 'HelloBaddil12345&%',
      };
      promises.push(this.createUser(fakeUser));
    }

    await Promise.all(promises);
    console.log(`✅ ${count} users have been seeded!`);
  }

  private async createUser(user: any) {
    try {
      await axios.post(this.registerUrl, user);
    } catch (error) {
      console.error('⚠️ Error creating user', error);
    }
  }
}
