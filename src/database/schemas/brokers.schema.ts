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
}

export const BrokerSchema = SchemaFactory.createForClass(Broker);
