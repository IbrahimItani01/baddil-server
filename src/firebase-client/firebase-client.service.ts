import { Injectable } from '@nestjs/common';
import { checkUserByEmail } from './util/firebase.util';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from './firebase';
@Injectable()
export class FirebaseClientService {
  async sendResetPasswordEmail(email: string): Promise<void> {
    const userExists = await checkUserByEmail(email);
    if (!userExists) {
      throw new Error('No user found with the provided email');
    }
    await sendPasswordResetEmail(auth, email);
  }
}
