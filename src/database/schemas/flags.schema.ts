import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { FlagStatusEnum, FlagTypeEnum } from '../../utils/enums.utils';

export type FlagDocument = Flag & Document;

@Schema({ timestamps: true })
export class Flag {
  @Prop({ type: Types.ObjectId, required: true })
  flagged_id: Types.ObjectId;

  @Prop({ type: String, enum: Object.values(FlagTypeEnum), required: true })
  type: FlagTypeEnum;


  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  flagged_by: Types.ObjectId;

  @Prop({ type: String, required: true })
  reason: string;

  @Prop({
    type: String,
    enum: Object.values(FlagStatusEnum),
    default: FlagStatusEnum.Active,
  })
  status: FlagStatusEnum;
}

export const FlagSchema = SchemaFactory.createForClass(Flag);
