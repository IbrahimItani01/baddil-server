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

  async seed(count: number = 20) {
    const existingNotifications = await this.notificationModel.countDocuments();
    if (existingNotifications > 0) {
      console.log('⚠️ Notifications already exist. Skipping seeding.');
      return;
    }

    const admins = await this.userModel.find({ user_type: 'admin' }, '_id');
    const barterers = await this.userModel.find(
      { user_type: 'barterer' },
      '_id',
    );
    const brokers = await this.userModel.find({ user_type: 'broker' }, '_id');

    if (
      admins.length === 0 ||
      (barterers.length === 0 && brokers.length === 0)
    ) {
      console.error(
        '⚠️ Error seeding notifications: Missing required user types.',
      );
      return;
    }

    const notifications = Array.from({ length: count }, () => {
      const sentBy = faker.helpers.arrayElement([admins[0]._id, 'company']);
      const sentTo = faker.helpers.arrayElement([
        faker.helpers.arrayElement(barterers)._id,
        faker.helpers.arrayElement(brokers)._id,
      ]);

      return {
        message: faker.lorem.sentence(),
        sent_by: sentBy,
        sent_to: [sentTo],
        sent: faker.datatype.boolean(),
      };
    });

    try {
      await this.notificationModel.insertMany(notifications);
      console.log(`✅ ${count} notifications seeded successfully!`);
    } catch (error) {
      console.error('❌ Error seeding notifications:', error);
    }
  }
}
