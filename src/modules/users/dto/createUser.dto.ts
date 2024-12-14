import {
  IsNotEmpty,
  IsString,
  Matches,
  ValidateNested,
  IsEnum,
  IsEmail,
  IsOptional,
  IsBoolean,
  IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';
import { UserTypeEnum } from 'src/utils/enums.utils';

export class PasswordForgetDto {
  @IsOptional()
  @IsBoolean()
  is_reset_active?: boolean;

  @IsOptional()
  @IsString()
  new_password?: string;

  @IsOptional()
  @IsString()
  verification_code?: string;

  @IsOptional()
  @IsDate()
  reset_expires_at?: Date;
}
export class PasswordDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/, {
    message:
      'Password must be at least 12 characters long, include at least one uppercase letter, one number, and one special character',
  })
  current_password: string;

  @ValidateNested()
  @Type(() => PasswordForgetDto)
  password_forget?: PasswordForgetDto;
}

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ValidateNested()
  @Type(() => PasswordDto)
  password: PasswordDto;

  @IsEnum(UserTypeEnum)
  user_type: string;
}
