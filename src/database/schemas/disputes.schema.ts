import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type DisputeDocument = Dispute & Document;

@Schema({ timestamps: true })
export class Dispute {
  @Prop({ type: [Types.ObjectId], ref: 'User', required: true })
  users_involved: Types.ObjectId[];
}

export const DisputeSchema = SchemaFactory.createForClass(Dispute);
