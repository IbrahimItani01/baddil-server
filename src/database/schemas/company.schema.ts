import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CompanyDocument = Company & Document;

@Schema({ timestamps: true })
export class Company {
  @Prop({ required: false, default: 'Baddĭl' })
  name: string;

  @Prop({ default: 0 })
  notification_count: number;

  @Prop({ default: 0 })
  flags_count: number;

}

export const CompanySchema = SchemaFactory.createForClass(Company);
