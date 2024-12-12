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
}

export const CompanySchema = SchemaFactory.createForClass(Company);
