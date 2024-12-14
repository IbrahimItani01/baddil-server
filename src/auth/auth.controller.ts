import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/modules/users/dto/createUser.dto';
import { ApiResponseDto } from 'src/utils/apiResponse.dto';
import { ApiResponseStatusEnum } from 'src/utils/enums.utils';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() createUserDto: CreateUserDto) {
    try {
      const result = await this.authService.register(createUserDto);

      return new ApiResponseDto(
        ApiResponseStatusEnum.Success,
        'User registered successfully',
        result,
      );
    } catch (error) {
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
