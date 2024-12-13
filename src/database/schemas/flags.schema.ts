import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { FlagStatus, FlagType } from 'src/utils/enums.utils';

export type FlagDocument = Flag & Document;

@Schema({ timestamps: true })
export class Flag {
  @Prop({ type: Types.ObjectId, required: true })
  flagged_id: Types.ObjectId;

  @Prop({ type: String, enum: Object.values(FlagType), required: true })
  type: FlagType;

  @Prop({ type: Types.ObjectId, ref: 'User', required: false })
  owner_id?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  flagged_by: Types.ObjectId;

  @Prop({ type: String, required: true })
  reason: string;

  @Prop({
    type: String,
    enum: Object.values(FlagStatus),
    default: FlagStatus.Active,
  })
  status: FlagStatus;
}

export const FlagSchema = SchemaFactory.createForClass(Flag);
