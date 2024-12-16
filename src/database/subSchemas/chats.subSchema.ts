import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { MessageStatusEnum } from '../../utils/enums.utils';

@Schema()
export class Message {
  @Prop({ type: Types.ObjectId, required: true, default: () => new Types.ObjectId() })
  message_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true, default: null })
  sender: Types.ObjectId;

  @Prop({ type: String, required: true, default: '' })
  content: string;

  @Prop({ type: Date, default: Date.now, required: true })
  sent_date: Date;

  @Prop({
    type: String,
    enum: Object.values(MessageStatusEnum),
    default: MessageStatusEnum.Sent,
    required: true,
  })
  status: MessageStatusEnum;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
