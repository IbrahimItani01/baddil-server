import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UserLanguageEnum, UserThemeEnum } from '../../utils/enums.utils';

@Schema()
export class Settings {
  @Prop({
    type: String,
    enum: Object.values(UserLanguageEnum),
    default: UserLanguageEnum.English,
  })
  language: UserLanguageEnum;

  @Prop({
    type: String,
    enum: Object.values(UserThemeEnum),
    default: UserThemeEnum.Light,
  })
  theme: UserThemeEnum;

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
  @Prop({ type: String, required: false, default: null })
  number?: string;

  @Prop({ type: Boolean, default: false })
  verified: boolean;

  @Prop({ type: String, required: false, default: null })
  verification_code?: string;

  @Prop({ type: Date, required: false, default: null })
  verification_expiry?: Date;
}

export const PhoneNumberSchema = SchemaFactory.createForClass(PhoneNumber);
