import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common'; // 📦 Importing necessary decorators and exceptions
import { AuthService } from './auth.service'; // 🔑 Importing AuthService for authentication logic
import { ApiResponseStatusEnum } from '../utils/enums.utils'; // 📊 Importing response status enums

@Controller('auth') // 🔑 Handles authentication-related routes
export class AuthController {
  constructor(private readonly authService: AuthService) {} // 🏗 Injecting AuthService

  /**
   * Register a new user.
   * @param name - The user's name.
   * @param email - The user's email.
   * @param user_type - The user's type (e.g., admin, user).
   * @param profile_picture - Optional user's profile picture.
   * @param password - Optional password for the user.
   * @param googleToken - Optional Google OAuth token.
   * @param language - Optional preferred language.
   * @param theme - Optional user interface theme.
   * @returns A response with the registration result.
   */
  @Post('register') // 📝 Endpoint for user registration
  @HttpCode(HttpStatus.CREATED) // 📍 Status code for successful creation
  async register(
    @Body('name') name: string, // 📛 User's name
    @Body('email') email: string, // 📧 User's email
    @Body('user_type') user_type: string, // 👤 User type
    @Body('profile_picture') profile_picture?: string, // 🖼️ Optional profile picture
    @Body('password') password?: string, // 🔑 Optional password
    @Body('googleToken') googleToken?: string, // 🔑 Optional Google OAuth token
    @Body('language') language?: string, // 🌐 Optional preferred language
    @Body('theme') theme?: string, // 🎨 Optional user interface theme
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
        status: ApiResponseStatusEnum.Success, // ✅ Success status
        message: 'User  registered successfully', // 🎉 Success message
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

  /**
   * Authenticate and login the user.
   * @param emailOrIdToken - User email or ID token (for Google sign-in).
   * @param password - Optional password if using traditional authentication.
   * @returns A response with the login result.
   */
  @Post('login') // 📝 Endpoint for user login
  @HttpCode(HttpStatus.OK) // 📍 Status code for successful login
  async login(
    @Body('emailOrIdToken') emailOrIdToken: string, // 📧 User email or ID token
    @Body('password') password?: string, // 🔑 Optional password
  ) {
    try {
      const result = await this.authService.login(emailOrIdToken, password); // 🔑 Attempting to login
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
