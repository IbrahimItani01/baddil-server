import { Body, Controller, Post } from '@nestjs/common';
import { FirebaseService } from './firebase.service';
import { ApiResponse } from 'src/utils/api/apiResponse.interface';

@Controller('firebase')
export class FirebaseController {
  constructor(private readonly firebaseService: FirebaseService) {}

  @Post('reset-password')
  async sendResetPasswordEmail(
    @Body('email') email: string,
  ): Promise<ApiResponse> {
    await this.firebaseService.sendResetPasswordEmail(email);
    return { success: true, message: 'Password reset email sent successfully' };
  }
}
