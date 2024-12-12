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

}

export const BartererSchema = SchemaFactory.createForClass(Barterer);
