import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UserLanguage, UserTheme } from 'src/utils/enums.utils';

@Schema()
export class Settings {
  @Prop({
    type: String,
    enum: Object.values(UserLanguage),
    default: UserLanguage.English,
  })
  language: UserLanguage;

  @Prop({
    type: String,
    enum: Object.values(UserTheme),
    default: UserTheme.Light,
  })
  theme: UserTheme;

  @Prop({ type: Boolean, default: true })
  notifications: boolean;
}

export const SettingsSchema = SchemaFactory.createForClass(Settings);

@Schema()
export class AuthProvider {
  @Prop({ type: String, required: false })
  provider_id?: string;

  @Prop({ type: String, required: false })
  provider_email?: string;

  @Prop({ type: String, required: false })
  provider_profile_picture?: string;

  @Prop({ type: String, default: 'google' })
  auth_provider: string;
}

export const AuthProviderSchema = SchemaFactory.createForClass(AuthProvider);

@Schema()
export class PhoneNumber {
  @Prop({ type: String, required: false })
  number?: string;

  @Prop({ type: Boolean, default: false })
  verified: boolean;

  @Prop({ type: String, required: false })
  verification_code?: string;

  @Prop({ type: Date, required: false })
  verification_expiry?: Date;
}

export const PhoneNumberSchema = SchemaFactory.createForClass(PhoneNumber);
