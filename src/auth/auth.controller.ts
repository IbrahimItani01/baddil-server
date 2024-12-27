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
import { RegisterDto, LoginDto } from './dto/auth.dto'; // 📦 Import DTOs

@Controller('auth') // 🔑 Handles authentication-related routes
export class AuthController {
  constructor(private readonly authService: AuthService) {} // 🏗 Injecting AuthService

  @Post('register') // 📝 Endpoint for user registration
  @HttpCode(HttpStatus.CREATED) // 📍 Status code for successful creation
  async register(@Body() registerDto: RegisterDto) { // 📝 Accept DTO as parameter
    try {
      const result = await this.authService.register(registerDto); // 🛠 Calling AuthService for registration
      return {
        status: ApiResponseStatusEnum.Success, // ✅ Success status
        message: 'User registered successfully', // 🎉 Success message
        data: result, // 📊 Registration result data
      };
    } catch (error) {
      console.error(error); // 🔴 Logging error for debugging
      throw new BadRequestException({
        status: ApiResponseStatusEnum.Failed, // ❌ Failed status
        message: error.message || 'Registration failed', // ⚠️ Error message
        data: null, // 🚫 No data on failure
      });
    }
  }

  @Post('login') // 📝 Endpoint for user login
  @HttpCode(HttpStatus.OK) // 📍 Status code for successful login
  async login(@Body() loginDto: LoginDto) { // 📝 Accept DTO as parameter
    try {
      const result = await this.authService.login(loginDto); // 🔑 Calling AuthService for login
      return {
        status: ApiResponseStatusEnum.Success, // ✅ Success status
        message: 'Login successful', // 🎉 Success message
        data: result, // 📊 Login result data
      };
    } catch (error) {
      console.error(error); // 🔴 Logging error for debugging
      throw new BadRequestException({
        status: ApiResponseStatusEnum.Failed, // ❌ Failed status
        message: error.response?.message || 'Authentication failed', // ⚠️ Error message
        error: error.response?.error || 'Request failed with status code 400', // 🚫 Error details
        statusCode: error.response?.statusCode || 401, // 📉 Status code
      });
    }
  }
}
