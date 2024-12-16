import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { faker } from '@faker-js/faker';
import { User, UserDocument } from '../../schemas/users.schema';
import {
  Notification,
  NotificationDocument,
} from '../../schemas/notifications.schema';

@Injectable()
export class NotificationsSeeder {
  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<NotificationDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  getModel(): Model<NotificationDocument> {
    return this.notificationModel;
  }

  async seed() {
    const existingNotifications = await this.notificationModel.countDocuments();
    if (existingNotifications > 0) {
      return;
    }

    const admins = await this.userModel.find({ user_type: 'admin' }, '_id');
    const barterers = await this.userModel.find(
      { user_type: 'barterer' },
      '_id',
    );
    const brokers = await this.userModel.find({ user_type: 'broker' }, '_id');

    if (admins.length === 0 || barterers.length === 0 || brokers.length === 0) {
      console.error("⚠️ Error seeding notifications: a user type is empty in db")
      return;
    }

    const notifications = Array.from({ length: 20 }, () => {
      const sentBy = faker.helpers.arrayElement([admins[0]._id, 'company']);
      const sentTo = faker.helpers.arrayElement([
        faker.helpers.arrayElement(barterers),
        faker.helpers.arrayElement(brokers),
      ])._id;

      return {
        message: faker.lorem.sentence(),
        sent_by: sentBy,
        sent_to: [sentTo],
        sent: faker.datatype.boolean(),
      };
    });

    await this.notificationModel.insertMany(notifications);
    console.log('✅ Notifications seeded successfully!');
  }
}
