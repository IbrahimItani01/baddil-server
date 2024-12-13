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
