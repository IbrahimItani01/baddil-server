import { Module, Global } from '@nestjs/common'; // 📦 Importing necessary decorators
import * as admin from 'firebase-admin'; // 🔥 Importing Firebase Admin SDK
import { ConfigService } from '@nestjs/config'; // ⚙️ Importing ConfigService for environment variables
import { FirebaseController } from './firebase.controller';
import { FirebaseService } from './firebase.service';

@Global() // 🌍 Makes this module available globally in the application
@Module({
  providers: [
    FirebaseService,
    ConfigService,
    {
      provide: 'FIREBASE_ADMIN_INJECTOR', // 🔑 This token will be used to inject Firebase Auth
      useFactory: (configService: ConfigService) => {
        // 🔐 Retrieve the Firebase service account JSON from environment
        const serviceAccount = configService.get<string>(
          'FIREBASE_SERVICE_ACCOUNT', // 📜 Fetching the service account from config
        );

        if (!serviceAccount) {
          throw new Error('FIREBASE_SERVICE_ACCOUNT is missing in the config'); // ⚠️ Error handling if config is missing
        }

        let parsedAccount;
        try {
          parsedAccount = JSON.parse(serviceAccount); // 🧾 Parsing the service account JSON string
        } catch {
          throw new Error('Invalid Firebase service account JSON'); // ⚠️ Error handling for invalid JSON
        }

        // 🎉 Initialize Firebase Admin SDK with the parsed service account
        const firebaseAdminApp = admin.initializeApp({
          credential: admin.credential.cert(parsedAccount), // 🛠 Using the parsed credentials
        });

        // 🛠 Get Firebase Authentication service
        const firebaseAuth = firebaseAdminApp.auth(); // 🔑 Accessing Firebase Auth service

        return firebaseAuth; // ✅ Returning the Firebase Auth instance for injection
      },
      inject: [ConfigService], // 🔧 Injecting ConfigService to access environment variables
    },
  ],
  exports: ['FIREBASE_ADMIN_INJECTOR'],
  controllers: [FirebaseController], // 🔓 Exporting Firebase Auth for use in other modules
})
export class FirebaseAdminModule {} // 📦 Firebase Admin Module
