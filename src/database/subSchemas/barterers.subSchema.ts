import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { AutoTradeStatusEnum, ItemConditionEnum } from 'src/utils/enums.utils';

/**
 * Represents an item in a user's wallet.
 * 
 * @example
 * const walletItem = new WalletItem({
 *   item_id: new Types.ObjectId(),
 *   name: 'Vintage Watch',
 *   category: 'Accessories',
 *   condition: ItemConditionEnum.Good,
 *   description: 'A classic vintage watch in good condition.',
 *   estimated_value: 150,
 *   created_at: new Date(),
 *   images: ['image1.jpg', 'image2.jpg']
 * });
 */
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
    enum: Object.values(ItemConditionEnum),
    required: true,
  })
  condition: ItemConditionEnum;

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

/**
 * Represents data related to an auto trade.
 * 
 * @example
 * const autoTradeData = new AutoTradeData({
 *   item_id: new Types.ObjectId(),
 *   status: AutoTradeStatusEnum.Pending,
 *   started_on: new Date(),
 *   chats: []
 * });
 */
@Schema()
export class AutoTradeData {
  @Prop({ type: Types.ObjectId })
  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Item', required: true })
  item_id: Types.ObjectId;

  @Prop({
    type: String,
    enum: Object.values(AutoTradeStatusEnum),
    required: true,
  })
  status: AutoTradeStatusEnum;

  @Prop({ type: Date, default: Date.now, required: true })
  started_on: Date;

  @Prop({ type: Date, required: false })
  finalized_on: Date;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Chat', required: false }] })
  chats: Types.ObjectId[];
}

export const AutoTradeDataSchema = SchemaFactory.createForClass(AutoTradeData);

/**
 * Represents the success probability of trading an item.
 * 
 * @example
 * const successProbability = new SuccessProbability({
 *   item_id: new Types.ObjectId(),
 *   suggested_item_id: new Types.ObjectId(),
 *   probability: 75,
 *   created_at: new Date()
 * });
 */
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

export const SuccessProbabilitySchema = SchemaFactory.createForClass(SuccessProbability);

/**
 * Represents a hired broker for trading.
 * 
 * @example
 * const hiredBroker = new HiredBroker({
 *   broker_id: new Types.ObjectId(),
 *   hired_on: new Date(),
 *   goal_to_barter: 'Trade for a new laptop',
 *   starting_item_id: new Types.ObjectId(),
 *   contract_budget: 500
 * });
 */
@Schema()
export class HiredBroker {
  @Prop({ type: Types.ObjectId, ref: 'User ', required: true })
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

/**
 * Represents a user's tier in the trading system.
 * 
 * @example
 * const tier = new Tier({
 *   current_tier: new Types.ObjectId(),
 *   progress: 50,
 *   trades_left: 10,
 *   date_reached: new Date(),
 *   next_tier: new Types.ObjectId()
 * });
 */
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

/**
 * Represents the professional status of a user.
 * 
 * @example
 * const proStatus = new ProStatus({
 *   is_pro: true,
 *   activated_on: new Date(),
 *   expires_on: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
 *   plan_id: new Types.ObjectId()
 * });
 */
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

/**
 * Represents a user's wallet containing items.
 * 
 * @example
 * const wallet = new Wallet({
 *   items: [],
 *   total_value: 0
 * });
 */
@Schema()
export class Wallet {
  @Prop({ type: [WalletItemSchema], required: false })
  items: WalletItem[];

  @Prop({ type: Number, required: true, default: 0 })
  total_value: number;
}

export const WalletSchema = SchemaFactory.createForClass(Wallet);

/**
 * Represents the auto trade settings for a user.
 * 
 * @example
 * const autoTrade = new AutoTrade({
 *   enabled: true,
 *   data: []
 * });
 */
@Schema()
export class AutoTrade {
  @Prop({ type: Boolean, required: true, default: false })
  enabled: boolean;

  @Prop({ type: [AutoTradeDataSchema], required: true })
  data: AutoTradeData[];
}

export const AutoTradeSchema = SchemaFactory.createForClass(AutoTrade);

/**
 * Represents AI assistance data for trading.
 * 
 * @example
 * const aiAssistance = new AiAssistance({
 *   success_probability: [],
 *   auto_trade: new AutoTrade()
 * });
 */
@Schema({ timestamps: true })
export class AiAssistance {
  @Prop({
    type: [SuccessProbabilitySchema],
    required: true,
  })
  success_probability: SuccessProbability[];

  @Prop({
    type: AutoTradeSchema, 
    required: true,
  })
  auto_trade: AutoTrade;
}

export const AiAssistanceSchema = SchemaFactory.createForClass(AiAssistance);