import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { UserStatusEnum, UserTypeEnum } from 'src/utils/enums.utils';
import {
  AuthProvider,
  AuthProviderSchema,
  Password,
  PasswordSchema,
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

  @Prop({ type: PasswordSchema, required: true }) 
  password: Password;

  @Prop({ required: true, enum: Object.values(UserTypeEnum) })
  user_type: UserTypeEnum;

  @Prop({ trim: true, default: null })
  profile_picture?: string | null;

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
