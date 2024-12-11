import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type DisputeDocument = Dispute & Document;

@Schema({ timestamps: true })
export class Dispute {
  @Prop({ type: [Types.ObjectId], ref: 'User', required: true })
  users_involved: Types.ObjectId[];

  @Prop({
    type: String,
    enum: ['active', 'unresolved', 'resolved'],
    default: 'active',
  })
  status: 'active' | 'unresolved' | 'resolved';

  @Prop({ type: Date, default: null })
  resolved_at: Date | null;

  @Prop({ type: Types.ObjectId, ref: 'User', required: false })
  resolved_by?: Types.ObjectId;

  @Prop({ type: String, required: false })
  resolution_details?: string;

}

export const DisputeSchema = SchemaFactory.createForClass(Dispute);
