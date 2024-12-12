import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type BrokerDocument = Broker & Document;

@Schema({ timestamps: true })
export class Broker {
