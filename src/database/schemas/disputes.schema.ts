import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type DisputeDocument = Dispute & Document;
@Schema({ timestamps: true })
export class Dispute {
}

export const DisputeSchema = SchemaFactory.createForClass(Dispute);
