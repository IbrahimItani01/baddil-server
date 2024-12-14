import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { ClientStatusEnum, RatingEnum } from 'src/utils/enums.utils';

@Schema()
export class ClientGoal {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  condition: string;

  @Prop({ type: String, required: true })
  category: string;

  @Prop({ type: String, required: false })
  details?: string;
}

export const ClientGoalSchema = SchemaFactory.createForClass(ClientGoal);

@Schema()
export class ClientItem {
  @Prop({ type: Types.ObjectId, ref: 'Barter', required: true })
  barter_id: Types.ObjectId;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  condition: string;

  @Prop({ type: String, required: true })
  category: string;
}

export const ClientItemSchema = SchemaFactory.createForClass(ClientItem);

@Schema()
export class Process {
  @Prop({ type: String, required: true })
  process_id: string;

  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: Types.ObjectId, ref: 'Barter', required: true })
  from_barter_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Barter', required: true })
  to_barter_id: Types.ObjectId;

  @Prop({ type: String, required: false })
  details?: string;
}

export const ProcessSchema = SchemaFactory.createForClass(Process);
@Schema()
export class VipStatus {
  @Prop({ type: Boolean, required: true, default: false })
  is_vip: boolean;

  @Prop({ type: Date, required: false, default: null })
  validated_at?: Date | null;
}

export const VipStatusSchema = SchemaFactory.createForClass(VipStatus);
@Schema()
export class Earnings {
  @Prop({ type: Number, required: true, default: 0 })
  total: number;

  @Prop({ type: Number, required: true, default: 0 })
  from_clients: number;

  @Prop({ type: Number, required: true, default: 0 })
  from_baddil: number;
}

export const EarningsSchema = SchemaFactory.createForClass(Earnings);
@Schema()
export class Performance {
  @Prop({ type: Number, required: true, default: 0 })
  success_rate: number;

  @Prop({ type: Number, required: true, default: 0 })
  completed_barters: number;

  @Prop({ type: EarningsSchema, required: true,default:{} })
  earnings: Earnings;
}

export const PerformanceSchema = SchemaFactory.createForClass(Performance);
@Schema()
export class Client {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  client_id: Types.ObjectId;

  @Prop({ type: Number, required: true })
  budget: number;

  @Prop({ type: ClientGoalSchema, required: true })
  client_goal: ClientGoal;

  @Prop({ type: ClientItemSchema, required: true })
  client_item: ClientItem;

  @Prop({ type: [ProcessSchema], required: false })
  process?: Process[];

  @Prop({ type: Number, required: true, default: 0 })
  progress: number;

  @Prop({
    type: String,
    enum: Object.values(ClientStatusEnum),
    required: true,
  })
  status: ClientStatusEnum;

  @Prop({ type: Date, default: Date.now, required: true })
  created_at: Date;

  @Prop({ type: Date, default: Date.now, required: true })
  updated_at: Date;
}

export const ClientSchema = SchemaFactory.createForClass(Client);
@Schema()
export class Rating {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  client_id: Types.ObjectId;

  @Prop({
    type: String,
    enum: Object.values(RatingEnum),
    required: true,
  })
  rating: RatingEnum;

  @Prop({ type: String, required: false })
  message?: string;

  @Prop({ type: Date, required: true })
  date: Date;
}

export const RatingSchema = SchemaFactory.createForClass(Rating);
