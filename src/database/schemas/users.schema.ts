import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import {
  UserLanguage,
  UserStatus,
  UserTheme,
  UserType,
} from 'src/utils/enums.utils';

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

  @Prop({
    type: {
      language: {
        type: String,
        enum: Object.values(UserLanguage),
        default: UserLanguage.English,
      },
      theme: {
        type: String,
        enum: Object.values(UserTheme),
        default: UserTheme.Light,
      },
      notifications: {
        type: Boolean,
        default: true,
      },
    },
    required: false,
  })
  settings: {
    language: UserLanguage;
    theme: UserTheme;
    notifications: boolean;
  };

  @Prop({
    type: {
      provider_id: { type: String, required: false },
      provider_email: { type: String, required: false },
      provider_profile_picture: { type: String, required: false },
      auth_provider: { type: String, default: 'google' },
    },
    required: false,
  })
  auth_provider?: {
    provider_id?: string;
    provider_email?: string;
    provider_profile_picture?: string;
    auth_provider: string;
  };

  @Prop({ type: [Types.ObjectId], ref: 'Notification', default: [] })
  notifications: Types.ObjectId[];

  @Prop({
    type: {
      number: { type: String, required: false },
      verified: { type: Boolean, default: false },
      verification_code: { type: String, required: false },
      verification_expiry: { type: Date, required: false },
    },
    required: false,
  })
  phone_number?: {
    number?: string;
    verified: boolean;
    verification_code?: string;
    verification_expiry?: Date;
  };
}

export const UserSchema = SchemaFactory.createForClass(User);
