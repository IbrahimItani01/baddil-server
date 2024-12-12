import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

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

  @Prop({
    type: {
      admins_count: { type: Number, default: 0 },
      brokers_count: { type: Number, default: 0 },
      barterers_count: { type: Number, default: 0 },
    },
    _id: false,
  })
  users: {
    admins_count: number;
    brokers_count: number;
    barterers_count: number;
  };

  @Prop({
    type: {
      min_success_rate: { type: Number, required: true },
      min_average_rating: { type: Number, required: true },
      min_total_trades: { type: Number, required: true },
    },
    _id: false,
  })
  vip_criteria: {
    min_success_rate: number;
    min_average_rating: number;
    min_total_trades: number;
  };

  @Prop({
    type: {
      incomes: {
        total_revenue: { type: Number, default: 0 },
        sources: {
          subscriptions: {
            brokers: { type: Number, default: 0 },
            barterers: { type: Number, default: 0 },
          },
          broker_commissions: {
            platform_percentage: { type: Number, required: true },
            broker_earnings: [
              {
                broker_id: {
                  type: Types.ObjectId,
                  ref: 'User',
                  required: true,
                },
                earnings_by_month: { type: Number, default: 0 },
              },
            ],
            total_commissions: { type: Number, default: 0 },
          },
          partnerships: [
            {
              partner_name: { type: String, required: true },
              contract_period: { type: String, required: true },
              value: { type: Number, required: true },
            },
          ],
        },
      },
      expenses: {
        total_expenses: { type: Number, default: 0 },
        details: {
          broker_payouts: [
            {
              broker_id: { type: Types.ObjectId, ref: 'User', required: true },
              monthly_payout_percentage: { type: Number, required: true },
            },
          ],
          maintenance: { type: Number, default: 0 },
          operational_costs: {
            salaries: { type: Number, default: 0 },
            office_expenses: { type: Number, default: 0 },
          },
        },
      },
    },
    _id: false,
  })
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

  @Prop({
    type: [
      {
        name: { type: String, required: true },
        target_user_type: {
          type: String,
          enum: ['broker', 'barterer'],
          required: true,
        },
        monthly_price: { type: Number, required: true },
        features: { type: [String], default: [] },
      },
    ],
    _id: false,
  })
  subscription_plans: {
    name: string;
    target_user_type: 'broker' | 'barterer';
    monthly_price: number;
    features: string[];
  }[];

  @Prop({
    type: [
      {
        name: { type: String, required: true },
        order: { type: Number, required: true },
        min_trades_to_reach: { type: Number, required: true },
        icon_url: { type: String, required: true },
      },
    ],
    _id: false,
  })
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
