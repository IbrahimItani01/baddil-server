import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common'; // 📦 Importing Injectable decorator
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin'; // 🔥 Importing Firebase Admin SDK
import * as nodemailer from 'nodemailer';
@Injectable() // 🏷 Marks the class as a service to be injectable
export class FirebaseService {
  private transporter: nodemailer.Transporter;

  // 🏗 Constructor
  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASS'),
      },
    });
  }

  /**
   * Verifies the Firebase ID token.
   * @param token - The Firebase ID token to verify.
   * @returns The decoded token if valid.
   * @throws Error if the token is invalid.
   */
  async verifyToken(token: string): Promise<admin.auth.DecodedIdToken> {
    try {
      // 🛡 Verifying the Firebase token with Firebase Admin SDK
      return await admin.auth().verifyIdToken(token); // ✅ Returning the decoded token
    } catch (error) {
      // 🛑 Catching the error and using the error variable
      console.error('Invalid Firebase token verification', error); // 📝 Logging the error for diagnostics
      throw new Error('Invalid Firebase token'); // 🔴 Throwing a new error if the token is invalid
    }
  }

  async sendResetPasswordEmail(email: string): Promise<void> {
    try {
      const user = await admin.auth().getUserByEmail(email); // Check if user exists
      if (!user) {
        throw new BadRequestException('No user found with the provided email');
      }

      const resetLink = await admin.auth().generatePasswordResetLink(email); // Generate link
      if (resetLink) {
        await this.transporter.sendMail({
          from: 'Baddil <no-reply@baddil.com>',
          to: email,
          subject: 'Baddil Password Reset Request',
          html: `
            <div style="font-family: Arial, sans-serif; color: #333;">
              <p>Hi,</p>
              <p>Please click the button below to reset your password:</p>
              <p style="margin: 20px;">
                <a href="${resetLink}" style="background-color: #E60000; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                  Reset Password
                </a>
              </p>
              <p>If you did not request this, you can safely ignore this email.</p>
              <p>Thank you,<br>The Baddil Team</p>
            </div>
          `,
        });
      } else {
        throw new InternalServerErrorException(
          'Failed to send password reset email',
        );
      }
      // Sending the reset link via email
    } catch (error) {
      console.error('Error sending reset password email:', error);
      throw new InternalServerErrorException(
        'Failed to send password reset email',
      );
    }
  }
}
