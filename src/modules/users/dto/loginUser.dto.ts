import { IsEmail, IsString } from 'class-validator';

export class LoginUserDto {
  @IsEmail({}, { message: 'Invalid email address' })
  readonly email: string;

  @IsString()
  readonly password: string;
}
