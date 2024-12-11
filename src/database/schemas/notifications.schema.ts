import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type NotificationDocument = Notification & Document;

@Schema({ timestamps: true })
export class Notification {
  @Prop({ required: true, trim: true })
  message: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  sent_by: Types.ObjectId;

  @Prop({ type: [Types.ObjectId], ref: 'User', required: true })
  sent_to: Types.ObjectId[];

  @Prop({ type: Boolean, default: false })
  sent: boolean;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
