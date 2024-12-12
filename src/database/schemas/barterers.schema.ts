import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type BartererDocument = Barterer & Document;

@Schema({ timestamps: true })
export class Barterer {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user_id: Types.ObjectId;
}

export const BartererSchema = SchemaFactory.createForClass(Barterer);
