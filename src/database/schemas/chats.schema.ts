import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ChatDocument = Chat & Document;

@Schema({ timestamps: true })
export class Chat {
  @Prop({ type: [Types.ObjectId], ref: 'User', required: true })
  users_involved: Types.ObjectId[];

  @Prop({
    type: [
      {
        message_id: { type: Types.ObjectId, required: true },
        sender: { type: Types.ObjectId, ref: 'User', required: true },
        content: { type: String, required: true },
        sent_date: { type: Date, default: Date.now, required: true },
        status: {
          type: String,
          enum: ['sent', 'read', 'received'],
          default: 'sent',
          required: true,
        },
      },
    ],
    required: true,
  })
  messages: {
    message_id: Types.ObjectId;
    sender: Types.ObjectId;
    content: string;
    sent_date: Date;
    status: 'sent' | 'read' | 'received';
  }[];
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
