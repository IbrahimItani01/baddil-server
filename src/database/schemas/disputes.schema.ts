import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { DisputeStatusEnum } from 'src/utils/enums.utils';

export type DisputeDocument = Dispute & Document;

@Schema({ timestamps: true })
export class Dispute {
  @Prop({ type: [Types.ObjectId], ref: 'User', required: true })
  users_involved: Types.ObjectId[];

  @Prop({
    type: String,
    enum: Object.values(DisputeStatusEnum),
    default: DisputeStatusEnum.Active,
  })
  status: DisputeStatusEnum;

  @Prop({ type: Date, default: null })
  resolved_at: Date | null;

  @Prop({ type: Types.ObjectId, ref: 'User', required: false })
  resolved_by?: Types.ObjectId;

  @Prop({ type: String, required: false })
  resolution_details?: string;

  @Prop({ type: String, required: true })
  reason: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  monitored_by: Types.ObjectId;
}

export const DisputeSchema = SchemaFactory.createForClass(Dispute);
