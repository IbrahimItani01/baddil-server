import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { faker } from '@faker-js/faker';
import { DisputeStatusEnum } from '../../../utils/enums.utils';
import { Dispute, DisputeDocument } from '../../schemas/disputes.schema';
import { User, UserDocument } from '../../schemas/users.schema';

@Injectable()
export class DisputesSeeder {
  constructor(
    @InjectModel(Dispute.name) private disputeModel: Model<DisputeDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  getModel(): Model<DisputeDocument> {
    return this.disputeModel;
  }

  async seed(count: number = 10) {
    const existingDisputes = await this.disputeModel.find();
    if (existingDisputes.length > 0) {
      return;
    }

    const barterers = await this.userModel
      .find({ user_type: 'barterer' })
      .select('_id');
    const admins = await this.userModel
      .find({ user_type: 'admin' })
      .select('_id');

    if (barterers.length === 0 || admins.length === 0) {
      console.error('⚠️ Error seeding disputes: No barterers or admins found');
      return;
    }

    const disputes = [];
    for (let i = 0; i < count; i++) {
      const usersInvolved = faker.helpers
        .arrayElements(barterers, faker.number.int({ min: 2, max: 5 }))
        .map((user) => user._id);

      const monitoredBy = faker.helpers.arrayElement(admins)._id;

      const resolvedBy = faker.datatype.boolean()
        ? faker.helpers.arrayElement(admins)._id
        : undefined;

      const resolvedAt = resolvedBy ? faker.date.past() : null;

      disputes.push({
        users_involved: usersInvolved,
        status: resolvedBy
          ? DisputeStatusEnum.Resolved
          : DisputeStatusEnum.Active,
        resolved_at: resolvedAt,
        resolved_by: resolvedBy,
        resolution_details: resolvedBy ? faker.lorem.sentence() : undefined,
        reason: faker.lorem.sentence(),
        monitored_by: monitoredBy,
      });
    }

    try {
      await this.disputeModel.insertMany(disputes);
      console.log(`✅ ${count} Disputes seeded successfully!`);
    } catch (error) {
      console.error('❌ Error seeding disputes:', error);
    }
  }
}
