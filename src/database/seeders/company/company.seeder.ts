import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { faker } from '@faker-js/faker';
import { Company, CompanyDocument } from '../../schemas/company.schema';
import { User, UserDocument } from '../../schemas/users.schema';
import { Flag, FlagDocument } from '../../../database/schemas/flags.schema';
import {
  Dispute,
  DisputeDocument,
} from '../../../database/schemas/disputes.schema';
import {
  Notification,
  NotificationDocument,
} from '../../../database/schemas/notifications.schema';

@Injectable()
export class CompanySeeder {
  constructor(
    @InjectModel(Company.name) private companyModel: Model<CompanyDocument>,
    @InjectModel(Notification.name)
    private notificationModel: Model<NotificationDocument>, // Replace 'any' with actual type
    @InjectModel(Flag.name) private flagModel: Model<FlagDocument>, // Replace 'any' with actual type
    @InjectModel(Dispute.name) private disputeModel: Model<DisputeDocument>, // Replace 'any' with actual type
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  getModel(): Model<CompanyDocument> {
    return this.companyModel;
  }

  async seed(): Promise<void> {
    const existingCompany = await this.companyModel.findOne();
    if (existingCompany) {
      console.warn('⚠️ Company document already exists');
      return;
    }

    const notificationCount = await this.notificationModel.countDocuments();
    const flagsCount = await this.flagModel.countDocuments();
    const disputesCount = await this.disputeModel.countDocuments();

    const adminsCount = await this.userModel.countDocuments({
      user_type: 'admin',
    });
    const brokersCount = await this.userModel.countDocuments({
      user_type: 'broker',
    });
    const barterersCount = await this.userModel.countDocuments({
      user_type: 'barterer',
    });

    }

    const companyData = {
      name: 'Baddĭl',
      notification_count: faker.number.int({ min: 0, max: 100 }),
      flags_count: faker.number.int({ min: 0, max: 50 }),
      disputes_count: faker.number.int({ min: 0, max: 20 }),
      users: {
        admins_count: faker.number.int({ min: 1, max: 10 }),
        brokers_count: faker.number.int({ min: 5, max: 50 }),
        barterers_count: faker.number.int({ min: 100, max: 1000 }),
      },
      vip_criteria: {
        min_success_rate: faker.number.float({ min: 80, max: 100 }),
        min_average_rating: faker.number.float({ min: 4, max: 5 }),
        min_total_trades: faker.number.int({ min: 50, max: 500 }),
      },
      finances: {
        incomes: {
          total_revenue: faker.number.float({ min: 10000, max: 100000 }),
          sources: {
            subscriptions: {
              brokers: [],
              barterers: [],
            },
            broker_commissions: {
              platform_percentage: 5,
              broker_earnings: [],
              total_commissions: faker.number.float({ min: 500, max: 5000 }),
            },
            partnerships: [],
          },
        },
        expenses: {
          total_expenses: faker.number.float({ min: 5000, max: 50000 }),
          details: {
            broker_payouts: [],
            maintenance: faker.number.float({ min: 1000, max: 10000 }),
            operational_costs: {
              salaries: faker.number.float({ min: 2000, max: 20000 }),
              office_expenses: faker.number.float({ min: 500, max: 5000 }),
            },
          },
        },
      },
      subscription_plans: [
        {
          name: 'Pro Plan',
          target_user_type: 'barterer',
          monthly_price: faker.number.float({ min: 5, max: 10 }),
          features: ['Feature A', 'Feature B'],
        },
        {
          name: 'VIP Plan',
          target_user_type: 'broker',
          monthly_price: faker.number.float({ min: 15, max: 35}),
          features: ['Feature C', 'Feature D'],
        },
      ],
      tiers: [
        {
          name: 'Bronze',
          order: 1,
          min_trades_to_reach: 10,
          icon_url: faker.image.avatar(),
        },
        {
          name: 'Silver',
          order: 2,
          min_trades_to_reach: 50,
          icon_url: faker.image.avatar(),
        },
      ],
      updated_last_by: new Types.ObjectId(),
    };

    await this.companyModel.create(companyData);
    console.log('✅ Company document seeded successfully!');
  }
}
