import { Injectable } from '@nestjs/common'; // 📦 Importing Injectable decorator
import * as admin from 'firebase-admin'; // 🔥 Importing Firebase Admin SDK

@Injectable() // 🏷 Marks the class as a service to be injectable
export class FirebaseService {
  constructor() {} // 🏗 Constructor, no dependencies injected for now

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
}
