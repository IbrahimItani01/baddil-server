import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import {
  AutoTradeData,
  AutoTradeDataSchema,
  WalletItem,
  WalletItemSchema,
} from '../subSchemas/barterers.subSchema';

export type BartererDocument = Barterer & Document;

@Schema({ timestamps: true })
export class Barterer {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  user_id: Types.ObjectId;

  @Prop({
    type: {
      is_pro: { type: Boolean, required: true, default: false },
      activated_on: { type: Date, required: false },
      expires_on: { type: Date, required: false },
      plan_id: { type: Types.ObjectId, ref: 'Company', required: true },
    },
  })
  pro_status: {
    is_pro: boolean;
    activated_on?: Date;
    expires_on?: Date;
    plan_id: Types.ObjectId;
  };

  @Prop({
    type: {
      current_tier: { type: Types.ObjectId, ref: 'Company', required: true },
      progress: { type: Number, required: true, default: 0 },
      trades_left: { type: Number, required: true, default: 0 },
      date_reached: { type: Date, required: true },
      next_tier: { type: Types.ObjectId, ref: 'Company', required: false },
    },
  })
  tier: {
    current_tier: Types.ObjectId;
    progress: number;
    trades_left: number;
    date_reached: Date;
    next_tier?: Types.ObjectId;
  };

  @Prop({
    type: {
      items: [WalletItemSchema],
      total_value: { type: Number, required: true, default: 0 },
    },
  })
  wallet: {
    items: WalletItem[];
    total_value: number;
  };

  @Prop({
    type: {
      success_probability: [
        {
          _id: { type: Types.ObjectId },
          item_id: { type: Types.ObjectId, ref: 'Item', required: true },
          suggested_item_id: {
            type: Types.ObjectId,
            ref: 'Item',
            required: true,
          },
          probability: { type: Number, required: true },
          created_at: { type: Date, default: Date.now, required: true },
        },
      ],
      auto_trade: {
        enabled: { type: Boolean, required: true, default: false },
        data: [AutoTradeDataSchema],
      },
    },
  })
  ai_assistance: {
    success_probability: {
      _id: Types.ObjectId;
      item_id: Types.ObjectId;
      suggested_item_id: Types.ObjectId;
      probability: number;
      created_at: Date;
    }[];
    auto_trade: {
      enabled: boolean;
      data: AutoTradeData[];
    };
  };

  @Prop({
    type: [
      {
        broker_id: { type: Types.ObjectId, ref: 'User', required: true },
        hired_on: { type: Date, required: true },
        contract_termination_date: { type: Date, required: false },
        goal_to_barter: { type: String, required: true },
        starting_item_id: { type: Types.ObjectId, ref: 'Item', required: true },
        contract_budget: { type: Number, required: true },
      },
    ],
  })
  hired_brokers: {
    broker_id: Types.ObjectId;
    hired_on: Date;
    contract_termination_date?: Date;
    goal_to_barter: string;
    starting_item_id: Types.ObjectId;
    contract_budget: number;
  }[];

  @Prop({ type: [Types.ObjectId], ref: 'Chat', default: [] })
  chats_history: Types.ObjectId[];

  @Prop({ type: [Types.ObjectId], ref: 'Barter', default: [] })
  barters: Types.ObjectId[];
}

export const BartererSchema = SchemaFactory.createForClass(Barterer);
