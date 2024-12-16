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

