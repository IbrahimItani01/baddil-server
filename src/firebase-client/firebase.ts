import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { ConfigService } from '@nestjs/config';

let auth: ReturnType<typeof getAuth>;

export const initializeFirebase = (configService: ConfigService): void => {
  const firebaseConfig = {
    apiKey: configService.get<string>('FIREBASE_API_KEY'),
    authDomain: configService.get<string>('FIREBASE_AUTH_DOMAIN'),
    projectId: configService.get<string>('FIREBASE_PROJECT_ID'),
    storageBucket: configService.get<string>('FIREBASE_STORAGE_BUCKET'),
    messagingSenderId: configService.get<string>(
      'FIREBASE_MESSAGING_SENDER_ID',
    ),
    appId: configService.get<string>('FIREBASE_APP_ID'),
  };

  const app = initializeApp(firebaseConfig);
  auth = getAuth(app);
};

export { auth };
