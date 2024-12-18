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

      const fakeUser = {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        user_type: faker.helpers.arrayElement(Object.values(UserTypeEnum)),
        profile_picture: faker.image.avatar(),
        password: generateValidPassword(),
      };

      try {
        await axios.post(this.registerUrl, fakeUser);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        console.error("⚠️ Error creating user")
      }
    });

    await Promise.all(promises);
    console.log(`✅ ${count} users have been seeded!`);
  }
}
