import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { MessageStatus } from 'src/utils/enums.utils';
import { MessageSchema } from '../subSchemas/chats.subSchema';

export type ChatDocument = Chat & Document;

@Schema({ timestamps: true })
export class Chat {
  @Prop({ type: [Types.ObjectId], ref: 'User', required: true })
  users_involved: Types.ObjectId[];

  @Prop({
    type: [MessageSchema],
    required: true,
  })
  messages: {
    message_id: Types.ObjectId;
    sender: Types.ObjectId;
    content: string;
    sent_date: Date;
    status: MessageStatus;
  }[];

  @Prop({ type: Boolean, required: true, default: false })
  handled_by_ai: boolean;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
