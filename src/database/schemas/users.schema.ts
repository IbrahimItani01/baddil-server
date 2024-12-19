import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { UserStatusEnum, UserTypeEnum } from '../../utils/enums.utils';
import {
  PhoneNumber,
  PhoneNumberSchema,
  Settings,
  SettingsSchema,
} from '../subSchemas/users.subSchema';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true, unique: true })
  firebase_uid: string; 

  @Prop({ required: true, enum: Object.values(UserTypeEnum) })
  user_type: UserTypeEnum;

  @Prop({ trim: true, default: null })
  profile_picture?: string | null;

  @Prop({
    enum: Object.values(UserStatusEnum),
    default: UserStatusEnum.Active,
  })
  status: UserStatusEnum;

  @Prop({ type: SettingsSchema, _id: false, default: () => ({}) })
  settings: Settings;

  @Prop({ type: [Types.ObjectId], ref: 'Notification', default: [] })
  notifications: Types.ObjectId[];

  @Prop({ type: PhoneNumberSchema, _id: false, default: () => ({}) })
  phone_number?: PhoneNumber;

  
  @Prop({ required: false}) 
  password?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
