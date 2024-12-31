import { IsString, IsEmail, IsOptional, IsEnum } from 'class-validator'; // 📦 Importing validation decorators

// Enum for user types (you can expand this based on your application needs)
export enum UserTypeEnum {
  Broker = 'broker',
  Barterer = 'barterer',

  // Add other user types here if needed
}

// DTO for registration
export class RegisterDto {
  @IsString()
  name: string; // 📛 User's name

  @IsEmail()
  email: string; // 📧 User's email

  @IsEnum(UserTypeEnum)
  user_type: UserTypeEnum; // 👤 User type (e.g., admin, user)

  @IsOptional()
  @IsString()
  profile_picture?: string; // 🖼️ Optional profile picture

  @IsOptional()
  @IsString()
  password?: string; // 🔑 Optional password

  @IsOptional()
  @IsString()
  googleToken?: string; // 🔑 Optional Google OAuth token

  @IsOptional()
  @IsString()
  language?: string; // 🌐 Optional preferred language

  @IsOptional()
  @IsString()
  theme?: string; // 🎨 Optional user interface theme
}

// DTO for login
export class LoginDto {
  @IsString()
  emailOrIdToken: string; // 📧 User email or ID token

  @IsOptional()
  @IsString()
  password?: string; // 🔑 Optional password for traditional login
}
