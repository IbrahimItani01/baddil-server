import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type BartererDocument = Barterer & Document;

@Schema({ timestamps: true })
export class Barterer {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
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
      items: [
        {
          item_id: { type: Types.ObjectId, ref: 'Item', required: true },
          name: { type: String, required: true },
          category: { type: String, required: true },
          condition: {
            type: String,
            enum: ['new', 'refurbished', 'used'],
            required: true,
          },
          description: { type: String, required: false },
          estimated_value: { type: Number, required: true },
          created_at: { type: Date, default: Date.now, required: true },
          images: { type: [String], required: false }, // Array of image URLs
        },
      ],
      total_value: { type: Number, required: true, default: 0 },
    },
  })
  wallet: {
    items: {
      item_id: Types.ObjectId;
      name: string;
      category: string;
      condition: 'new' | 'refurbished' | 'used';
      description?: string;
      estimated_value: number;
      created_at: Date;
      images?: string[];
    }[];
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
        data: [
          {
            _id: { type: Types.ObjectId },
            item_id: { type: Types.ObjectId, ref: 'Item', required: true },
            status: {
              type: String,
              enum: ['ongoing', 'completed', 'userPending', 'aborted'],
              required: true,
            },
            started_on: { type: Date, default: Date.now, required: true },
            finalized_on: { type: Date, required: false },
            chats: [{ type: Types.ObjectId, ref: 'Chat', required: false }],
          },
        ],
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
      data: {
        _id: Types.ObjectId;
        item_id: Types.ObjectId;
        status: 'ongoing' | 'completed' | 'userPending' | 'aborted';
        started_on: Date;
        finalized_on?: Date;
        chats: Types.ObjectId[];
      }[];
    };
  };

}

export const BartererSchema = SchemaFactory.createForClass(Barterer);
