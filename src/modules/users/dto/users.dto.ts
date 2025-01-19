import {
  IsString,
  IsOptional,
  IsEmail,
  IsBoolean,
  IsIn,
} from 'class-validator'; // ✅ Validation decorators

// 🆕 DTO for creating a new user
export class CreateUserDto {
  @IsString() // 🔤 Must be a string
  firebase_uid: string; // 🔑 Firebase unique identifier

  @IsString() // 🔤 Must be a string
  name: string; // 👤 User's name

  @IsEmail() // 📧 Must be a valid email
  email: string; // 📩 User's email address

  @IsString() // 🔤 Must be a string
  user_type: string; // ⚙️ User type (e.g., admin, customer)

  @IsOptional() // ❓ Optional field
  @IsString() // 🔤 Must be a string
  profile_picture?: string; // 🖼️ User's profile picture URL

  @IsOptional() // ❓ Optional field
  @IsString() // 🔤 Must be a string
  password?: string; // 🔒 User's password

  @IsOptional() // ❓ Optional field
  @IsString() // 🔤 Must be a string
  language?: string; // 🌐 Preferred language

  @IsOptional() // ❓ Optional field
  @IsString() // 🔤 Must be a string
  theme?: string; // 🎨 Preferred theme (e.g., light/dark)
}

// ✏️ DTO for updating an existing user
export class UpdateUserDto {
  @IsOptional() // ❓ Optional field
  @IsString() // 🔤 Must be a string
  name?: string; // 👤 Updated name

  @IsOptional() // ❓ Optional field
  @IsEmail() // 📧 Must be a valid email
  email?: string; // 📩 Updated email address

  @IsOptional() // ❓ Optional field
  @IsString() // 🔤 Must be a string
  profile_picture?: string; // 🖼️ Updated profile picture URL

  @IsOptional() // ❓ Optional field
  @IsString() // 🔤 Must be a string
  password?: string; // 🔒 Updated password

  @IsOptional() // ❓ Optional field
  @IsString() // 🔤 Must be a string
  language?: string; // 🌐 Updated preferred language

  @IsOptional() // ❓ Optional field
  @IsString() // 🔤 Must be a string
  theme?: string; // 🎨 Updated preferred theme
}

// 🚦 DTO for changing user status
export class ChangeStatusDto {
  @IsString() // 🔤 Must be a string
  @IsIn(['active', 'inactive', 'banned']) // 🔒 Restrict to valid statuses
  status: string; // 🚥 User's status (e.g., active/inactive/banned)
}

// ⚙️ DTO for updating user settings
export class UpdateSettingsDto {
  @IsOptional() // ❓ Optional field
  @IsString() // 🔤 Must be a string
  @IsIn(['en', 'es', 'fr']) // 🌐 Restrict to valid languages
  language?: string; // 🗣️ Preferred language (e.g., English, Spanish, French)

  @IsOptional() // ❓ Optional field
  @IsString() // 🔤 Must be a string
  @IsIn(['dark', 'light']) // 🎨 Restrict to valid themes
  theme?: string; // 💡 Preferred theme (e.g., dark/light mode)

  @IsOptional() // ❓ Optional field
  @IsBoolean() // ✔️ Must be a boolean
  notifications?: boolean; // 🔔 Notification preference
}

// 📱 DTO for saving a user's device token
export class DeviceTokenDto {
  @IsString() // 🔤 Must be a string
  deviceToken: string; // 🔑 Device token for push notifications
}
