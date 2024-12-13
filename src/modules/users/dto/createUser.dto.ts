import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  Matches,
} from 'class-validator';
import { UserTypeEnum } from 'src/utils/enums.utils';

export class CreateUserDto {
  @IsEmail({}, { message: 'Invalid email address' })
  readonly email: string;
  @IsString()
  readonly name: string;
  @IsString()
  @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/, {
    message:
      'Password must be at least 12 characters long, include at least one uppercase letter, one number, and one special character',
  })
  readonly password: string;

  @IsNotEmpty()
  @IsEnum(UserTypeEnum)
  user_type: UserTypeEnum;
}
