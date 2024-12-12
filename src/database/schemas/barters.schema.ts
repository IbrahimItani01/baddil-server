import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type BarterDocument = Barter & Document;

@Schema({ timestamps: true })  
export class Barter {
}

export const BarterSchema = SchemaFactory.createForClass(Barter);
