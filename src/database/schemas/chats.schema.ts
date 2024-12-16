import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Message, MessageSchema } from '../subSchemas/chats.subSchema';

export type ChatDocument = Chat & Document;

@Schema({ timestamps: true })
export class Chat {
  @Prop({ type: [Types.ObjectId], ref: 'User', required: true, default: [] })
  users_involved: Types.ObjectId[];

  @Prop({
    type: [MessageSchema],
    required: true,
    default: [], // Default to an empty array
  })
  messages: Message[];

  @Prop({ type: Boolean, required: true, default: false })
  handled_by_ai: boolean;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
