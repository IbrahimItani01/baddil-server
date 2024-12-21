import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiResponseStatusEnum } from '../utils/enums.utils';

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
    @Body('language') language?: string, // Optional
    @Body('theme') theme?: string, // Optional
  ) {
    try {
      const result = await this.authService.register(
        name,
        email,
        user_type,
        profile_picture,
        password,
        googleToken,
        language,
        theme,
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
    @Body('emailOrIdToken') emailOrIdToken: string,
    @Body('password') password?: string,
  ) {
    try {
      const result = await this.authService.login(emailOrIdToken, password);
      return {
        status: ApiResponseStatusEnum.Success,
        message: 'Login successful',
        data: result,
      };
    } catch (error) {
      throw new BadRequestException({
        status: ApiResponseStatusEnum.Failed,
        message: error.response?.message || 'Authentication failed',
        error: error.response?.error || 'Request failed with status code 400',
        statusCode: error.response?.statusCode || 401,
      });
    }
  }
}
