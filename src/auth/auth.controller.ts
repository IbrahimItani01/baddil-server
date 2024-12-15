import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiResponseStatusEnum } from 'src/utils/enums.utils';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body('name') name: string,
    @Body('email') email: string,
    @Body('user_type') user_type: string,
    @Body('profile_picture') profile_picture?: string,
    @Body('password') password?: string,
    @Body('googleToken') googleToken?: string,
  ) {
    try {
      const result = await this.authService.register(
        name,
        email,
        user_type,
        profile_picture,
        password,
        googleToken,
      );

      return {
        status: ApiResponseStatusEnum.Success,
        message: 'User registered successfully',
        data: result,
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestException({
        status: ApiResponseStatusEnum.Failed,
        message: error.message || 'Registration failed',
        data: null,
      });
    }
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    try {
      const result = await this.authService.login(email, password);

      return new ApiResponseDto(
        ApiResponseStatusEnum.Success,
        'Login successful',
        result,
      );
    } catch (error) {
      throw new BadRequestException({
        status: ApiResponseStatusEnum.Failed,
        message: error.message || 'Login failed',
        data: null,
      });
    }
  }
}
