import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import {
  UserStatusEnum,
  UserTypeEnum,
} from 'src/utils/enums.utils';
import {
  AuthProvider,
  AuthProviderSchema,
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

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, enum: Object.values(UserTypeEnum) })
  user_type: UserTypeEnum;

  @Prop({ trim: true })
  profile_picture?: string;

  @Prop({
    enum: Object.values(UserStatusEnum),
    default: UserStatusEnum.Active,
  })
  status: UserStatusEnum;

  @Prop({ type: SettingsSchema, _id: false })
  settings: Settings;

  @Prop({ type: AuthProviderSchema, _id: false })
  auth_provider?: AuthProvider;

  @Prop({ type: [Types.ObjectId], ref: 'Notification', default: [] })
  notifications: Types.ObjectId[];

  @Prop({ type: PhoneNumberSchema, _id: false })
  phone_number?: PhoneNumber;
}

export const UserSchema = SchemaFactory.createForClass(User);
