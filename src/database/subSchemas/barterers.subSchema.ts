import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { AutoTradeStatus, ItemCondition } from 'src/utils/enums.utils';

@Schema()
export class WalletItem {
  @Prop({ type: Types.ObjectId, ref: 'Item', required: true })
  item_id: Types.ObjectId;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  category: string;

  @Prop({
    type: String,
    enum: Object.values(ItemCondition),
    required: true,
  })
  condition: ItemCondition;

  @Prop({ type: String, required: false })
  description: string;

  @Prop({ type: Number, required: true })
  estimated_value: number;

  @Prop({ type: Date, default: Date.now, required: true })
  created_at: Date;

  @Prop({ type: [String], required: false })
  images: string[];
}

export const WalletItemSchema = SchemaFactory.createForClass(WalletItem);
@Schema()
export class AutoTradeData {
  @Prop({ type: Types.ObjectId })
  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Item', required: true })
  item_id: Types.ObjectId;

  @Prop({
    type: String,
    enum: Object.values(AutoTradeStatus),
    required: true,
  })
  status: AutoTradeStatus;

  @Prop({ type: Date, default: Date.now, required: true })
  started_on: Date;

  @Prop({ type: Date, required: false })
  finalized_on: Date;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Chat', required: false }] })
  chats: Types.ObjectId[];
}

export const AutoTradeDataSchema = SchemaFactory.createForClass(AutoTradeData);
@Schema()
export class SuccessProbability {
  @Prop({ type: Types.ObjectId })
  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Item', required: true })
  item_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Item', required: true })
  suggested_item_id: Types.ObjectId;

  @Prop({ type: Number, required: true })
  probability: number;

  @Prop({ type: Date, default: Date.now, required: true })
  created_at: Date;
}

export const SuccessProbabilitySchema =
  SchemaFactory.createForClass(SuccessProbability);
Schema();
export class HiredBroker {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  broker_id: Types.ObjectId;

  @Prop({ type: Date, required: true })
  hired_on: Date;

  @Prop({ type: Date, required: false })
  contract_termination_date?: Date;

  @Prop({ type: String, required: true })
  goal_to_barter: string;

  @Prop({ type: Types.ObjectId, ref: 'Item', required: true })
  starting_item_id: Types.ObjectId;

  @Prop({ type: Number, required: true })
  contract_budget: number;
}

export const HiredBrokerSchema = SchemaFactory.createForClass(HiredBroker);
@Schema()
export class Tier {
  @Prop({ type: Types.ObjectId, ref: 'Company', required: true })
  current_tier: Types.ObjectId;

  @Prop({ type: Number, required: true, default: 0 })
  progress: number;

  @Prop({ type: Number, required: true, default: 0 })
  trades_left: number;

  @Prop({ type: Date, required: true })
  date_reached: Date;

  @Prop({ type: Types.ObjectId, ref: 'Company', required: false })
  next_tier?: Types.ObjectId;
}

export const TierSchema = SchemaFactory.createForClass(Tier);
@Schema()
export class ProStatus {
  @Prop({ type: Boolean, required: true, default: false })
  is_pro: boolean;

  @Prop({ type: Date, required: false })
  activated_on?: Date;

  @Prop({ type: Date, required: false })
  expires_on?: Date;

  @Prop({ type: Types.ObjectId, ref: 'Company', required: false })
  plan_id?: Types.ObjectId;
}

export const ProStatusSchema = SchemaFactory.createForClass(ProStatus);
@Schema()
export class Wallet {
  @Prop({ type: [WalletItemSchema], required: false })
  items: WalletItem[];

  @Prop({ type: Number, required: true, default: 0 })
  total_value: number;
}

export const WalletSchema = SchemaFactory.createForClass(Wallet);
@Schema()
export class AutoTrade {
  @Prop({ type: Boolean, required: true, default: false })
  enabled: boolean;

  @Prop({ type: [AutoTradeDataSchema], required: true })
  data: AutoTradeData[];
}

export const AutoTradeSchema = SchemaFactory.createForClass(AutoTrade);
