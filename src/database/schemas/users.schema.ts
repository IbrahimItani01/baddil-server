import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import {
  UserLanguage,
  UserStatus,
  UserTheme,
  UserType,
} from 'src/utils/enums.utils';
import {
  AuthProviderSchema,
  PhoneNumberSchema,
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

  @Prop({ required: true, enum: Object.values(UserType) })
  user_type: UserType;

  @Prop({ trim: true })
  profile_picture?: string;

  @Prop({
    enum: Object.values(UserStatus),
    default: UserStatus.Active,
  })
  status: UserStatus;

  @Prop({ type: SettingsSchema, _id: false })
  settings: {
    language: UserLanguage;
    theme: UserTheme;
    notifications: boolean;
  };

  @Prop({ type: AuthProviderSchema, _id: false })
  auth_provider?: {
    provider_id?: string;
    provider_email?: string;
    provider_profile_picture?: string;
    auth_provider: string;
  };

  @Prop({ type: [Types.ObjectId], ref: 'Notification', default: [] })
  notifications: Types.ObjectId[];

  @Prop({ type: PhoneNumberSchema, _id: false })
  phone_number?: {
    number?: string;
    verified: boolean;
    verification_code?: string;
    verification_expiry?: Date;
  };
}

export const UserSchema = SchemaFactory.createForClass(User);
