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
export const FlagSchema = SchemaFactory.createForClass(Flag);
