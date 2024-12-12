import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type BrokerDocument = Broker & Document;

@Schema({ timestamps: true })
export class Broker {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user_id: Types.ObjectId;

  @Prop({ type: Number, required: true })
  rate_per_hour: number;

  @Prop({
    type: {
      is_vip: { type: Boolean, required: true, default: false },
      validated_at: { type: Date, required: false, default: null },
    },
  })
  vip_status: {
    is_vip: boolean;
    validated_at?: Date | null;
  };

  @Prop({
    type: {
      success_rate: { type: Number, required: true, default: 0 },
      completed_barters: { type: Number, required: true, default: 0 },
      earnings: {
        type: {
          total: { type: Number, required: true, default: 0 },
          from_clients: { type: Number, required: true, default: 0 },
          from_baddil: { type: Number, required: true, default: 0 },
        },
        required: true,
      },
    },
    required: true,
  })
  performance: {
    success_rate: number;
    completed_barters: number;
    earnings: {
      total: number;
      from_clients: number;
      from_baddil: number;
    };
  };

  @Prop({
    type: [
      {
        client_id: { type: Types.ObjectId, ref: 'User', required: true },
        budget: { type: Number, required: true },
        client_goal: {
          type: {
            name: { type: String, required: true },
            condition: { type: String, required: true },
            category: { type: String, required: true },
            details: { type: String, required: false },
          },
          required: true,
        },
        client_item: {
          type: {
            barter_id: { type: Types.ObjectId, ref: 'Barter', required: true },
            name: { type: String, required: true },
            condition: { type: String, required: true },
            category: { type: String, required: true },
          },
          required: true,
        },
        process: {
          type: [
            {
              process_id: { type: String, required: true },
              title: { type: String, required: true },
              from_barter_id: {
                type: Types.ObjectId,
                ref: 'Barter',
                required: true,
              },
              to_barter_id: {
                type: Types.ObjectId,
                ref: 'Barter',
                required: true,
              },
              details: { type: String, required: false },
            },
          ],
          required: false,
        },
        progress: { type: Number, required: true, default: 0 },
        status: {
          type: String,
          enum: ['ongoing', 'onHold', 'cancelled'],
          required: true,
        },
        created_at: { type: Date, default: Date.now, required: true },
        updated_at: { type: Date, default: Date.now, required: true },
      },
    ],
    required: false,
  })
  clients: {
    client_id: Types.ObjectId;
    budget: number;
    client_goal: {
      name: string;
      condition: string;
      category: string;
      details?: string;
    };
    client_item: {
      barter_id: Types.ObjectId;
      name: string;
      condition: string;
      category: string;
    };
    process?: {
      process_id: string;
      title: string;
      from_barter_id: Types.ObjectId;
      to_barter_id: Types.ObjectId;
      details?: string;
    }[];
    progress: number;
    status: 'ongoing' | 'onHold' | 'cancelled';
    created_at: Date;
    updated_at: Date;
  }[];

  @Prop({
    type: [
      {
        client_id: { type: Types.ObjectId, ref: 'User', required: true },
        rating: {
          type: String,
          enum: ['1', '2', '3', '4', '5'],
          required: true,
        },
        message: { type: String, required: false },
        date: { type: Date, required: true },
      },
    ],
    required: false,
  })
  ratings: {
    client_id: Types.ObjectId;
    rating: '1' | '2' | '3' | '4' | '5';
    message?: string;
    date: Date;
  }[];
}

export const BrokerSchema = SchemaFactory.createForClass(Broker);
