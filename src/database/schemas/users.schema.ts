import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, enum: ['barterer', 'broker', 'admin'] })
  user_type: 'barterer' | 'broker' | 'admin';

  @Prop({ trim: true })
  profile_picture?: string;

  @Prop({
    enum: ['active', 'banned', 'flagged'],
    default: 'active',
  })
  status: 'active' | 'banned' | 'flagged';

  @Prop({
    type: {
      language: {
        type: String,
        enum: ['french', 'english'],
        default: 'english',
      },
      theme: {
        type: String,
        enum: ['dark', 'light'],
        default: 'light',
      },
      notifications: {
        type: Boolean,
        default: true,
      },
    },
    required: false,
  })
  settings: {
    language: 'french' | 'english';
    theme: 'dark' | 'light';
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
export const UserSchema = SchemaFactory.createForClass(User);
