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
}

export const BrokerSchema = SchemaFactory.createForClass(Broker);
