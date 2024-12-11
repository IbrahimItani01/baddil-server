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

export const UserSchema = SchemaFactory.createForClass(User);
