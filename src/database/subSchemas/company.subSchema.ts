import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { TargetUserTypeEnum } from '../../utils/enums.utils';

@Schema()
export class Users {
  @Prop({ type: Number, default: 0 })
  admins_count: number;

  @Prop({ type: Number, default: 0 })
  brokers_count: number;

  @Prop({ type: Number, default: 0 })
  barterers_count: number;
}

export const UsersSchema = SchemaFactory.createForClass(Users);

@Schema()
export class VipCriteria {
  @Prop({ type: Number, required: true })
  min_success_rate: number;

  @Prop({ type: Number, required: true })
  min_average_rating: number;

  @Prop({ type: Number, required: true })
  min_total_trades: number;
}

export const VipCriteriaSchema = SchemaFactory.createForClass(VipCriteria);

@Schema()
export class Finances {
  @Prop({
    type: {
      total_revenue: { type: Number, default: 0 },
      sources: {
        subscriptions: {
          brokers: [
            {
              broker_id: { type: Types.ObjectId, ref: 'User', required: true },
              plan_id: { type: Types.ObjectId, ref: 'Company', required: true },
              created_at: { type: Date, default: Date.now },
              value: { type: Number, required: true },
            },
          ],
          barterers: [
            {
              barterer_id: { type: Types.ObjectId, ref: 'User', required: true },
              plan_id: { type: Types.ObjectId, ref: 'Company', required: true },
              created_at: { type: Date, default: Date.now },
              value: { type: Number, required: true },
            },
          ],
        },
        broker_commissions: {
          platform_percentage: { type: Number, required: true, default: 5 },
          broker_earnings: [
            {
              broker_id: { type: Types.ObjectId, ref: 'User', required: true },
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
  })
  incomes: any;

  @Prop({
    type: {
      total_expenses: { type: Number, default: 0 },
      details: {
        broker_payouts: [
          {
            broker_id: { type: Types.ObjectId, ref: 'User', required: true },
            monthly_payout_amount: { type: Number, required: true },
          },
        ],
        maintenance: { type: Number, default: 0 },
        operational_costs: {
          salaries: { type: Number, default: 0 },
          office_expenses: { type: Number, default: 0 },
        },
      },
    },
  })
  expenses: any;
}

export const FinancesSchema = SchemaFactory.createForClass(Finances);


@Schema()
export class SubscriptionPlan {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({
    type: String,
    enum: Object.values(TargetUserTypeEnum),
    required: true,
  })
  target_user_type: TargetUserTypeEnum;

  @Prop({ type: Number, required: true })
  monthly_price: number;

  @Prop({ type: [String], default: [] })
  features: string[];
}

export const SubscriptionPlanSchema = SchemaFactory.createForClass(SubscriptionPlan);

@Schema()
export class Tier {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: Number, required: true })
  order: number;

  @Prop({ type: Number, required: true })
  min_trades_to_reach: number;

  @Prop({ type: String, required: true })
  icon_url: string;
}

export const TierSchema = SchemaFactory.createForClass(Tier);
