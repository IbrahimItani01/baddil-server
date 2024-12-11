import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type FlagDocument = Flag & Document;

@Schema({ timestamps: true })
export class Flag {
  @Prop({ type: Types.ObjectId, required: true })
  flagged_id: Types.ObjectId;

  @Prop({ type: String, enum: ['user', 'barter'], required: true })
  type: 'user' | 'barter';

  @Prop({ type: Types.ObjectId, ref: 'User', required: false })
  owner_id?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  flagged_by: Types.ObjectId;

  @Prop({ type: String, required: true })
  reason: string;

  @Prop({ type: String, enum: ['active', 'resolved'], default: 'active' })
  status: 'active' | 'resolved';
}

export const FlagSchema = SchemaFactory.createForClass(Flag);
