import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/auth.dto'; // 📦 Import DTOs
import { ApiResponse } from 'src/utils/api/apiResponse.interface';

@Controller('auth') // 🔑 Handles authentication-related routes
export class AuthController {
  constructor(private readonly authService: AuthService) {} // 🏗 Injecting AuthService

  @Post('register') // 📝 Endpoint for user registration
  @HttpCode(HttpStatus.CREATED) // 📍 Status code for successful creation
  async register(@Body() registerDto: RegisterDto): Promise<ApiResponse> {
    // 📝 Accept DTO as parameter
    const result = await this.authService.register(registerDto); // 🛠 Calling AuthService for registration
    return {
      success: true,
      message: 'User registered successfully', // 🎉 Success message
      data: result, // 📊 Registration result data
    };
  }

  @Post('login') // 📝 Endpoint for user login
  @HttpCode(HttpStatus.OK) // 📍 Status code for successful login
  async login(@Body() loginDto: LoginDto): Promise<ApiResponse> {
    // 📝 Accept DTO as parameter
    const result = await this.authService.login(loginDto); // 🔑 Calling AuthService for login
    return {
      success: true,
      message: 'Login successful', // 🎉 Success message
      data: result, // 📊 Login result data
    };
  }
}
