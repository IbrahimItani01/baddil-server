import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { TargetUserType } from 'src/utils/enums.utils';
import {
  FinancesSchema,
  SubscriptionPlanSchema,
  TierSchema,
  UsersSchema,
  VipCriteriaSchema,
} from '../subSchemas/company.subSchema';

export type CompanyDocument = Company & Document;

@Schema({ timestamps: true })
export class Company {
  @Prop({ required: false, default: 'Baddĭl' })
  name: string;

  @Prop({ default: 0 })
  notification_count: number;

  @Prop({ default: 0 })
  flags_count: number;

  @Prop({ default: 0 })
  disputes_count: number;

  @Prop({ type: UsersSchema, _id: false })
  users: {
    admins_count: number;
    brokers_count: number;
    barterers_count: number;
  };

  @Prop({ type: VipCriteriaSchema, _id: false })
  vip_criteria: {
    min_success_rate: number;
    min_average_rating: number;
    min_total_trades: number;
  };

  @Prop({ type: FinancesSchema, _id: false })
  finances: {
    incomes: {
      total_revenue: number;
      sources: {
        subscriptions: {
          brokers: number;
          barterers: number;
        };
        broker_commissions: {
          platform_percentage: number;
          broker_earnings: {
            broker_id: Types.ObjectId;
            earnings_by_month: number;
          }[];
          total_commissions: number;
        };
        partnerships: {
          partner_name: string;
          contract_period: string;
          value: number;
        }[];
      };
    };
    expenses: {
      total_expenses: number;
      details: {
        broker_payouts: {
          broker_id: Types.ObjectId;
          monthly_payout_percentage: number;
        }[];
        maintenance: number;
        operational_costs: {
          salaries: number;
          office_expenses: number;
        };
      };
    };
  };

  @Prop({ type: [SubscriptionPlanSchema], _id: false })
  subscription_plans: {
    name: string;
    target_user_type: TargetUserType;
    monthly_price: number;
    features: string[];
  }[];

  @Prop({ type: [TierSchema], _id: false })
  tiers: {
    name: string;
    order: number;
    min_trades_to_reach: number;
    icon_url: string;
  }[];

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  updated_last_by: Types.ObjectId;
}

export const CompanySchema = SchemaFactory.createForClass(Company);
