import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import {
  Finances,
  FinancesSchema,
  SubscriptionPlan,
  SubscriptionPlanSchema,
  Tier,
  TierSchema,
  Users,
  UsersSchema,
  VipCriteria,
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
  users: Users;

  @Prop({ type: VipCriteriaSchema, _id: false })
  vip_criteria: VipCriteria;

  @Prop({ type: FinancesSchema, _id: false })
  finances: Finances;

  @Prop({ type: [SubscriptionPlanSchema], _id: false })
  subscription_plans: SubscriptionPlan[];

  @Prop({ type: [TierSchema], _id: false })
  tiers: Tier[];

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  updated_last_by: Types.ObjectId;
}

export const CompanySchema = SchemaFactory.createForClass(Company);
