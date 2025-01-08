import { Body, Controller, Post } from '@nestjs/common';
import { FirebaseClientService } from './firebase-client.service';
import { ApiResponse } from 'src/utils/api/apiResponse.interface';

@Controller('firebase-client')
export class FirebaseClientController {
  constructor(private readonly firebaseClientService: FirebaseClientService) {}

  @Post('reset-password')
  async sendResetPasswordEmail(
    @Body('email') email: string,
  ): Promise<ApiResponse> {
    await this.firebaseClientService.sendResetPasswordEmail(email);
    return { success: true, message: 'Password reset email sent successfully' };
  }
}
