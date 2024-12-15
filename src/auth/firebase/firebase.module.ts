import { Module, Global } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
  providers: [
    {
      provide: 'FIREBASE_ADMIN_INJECTOR',
      useFactory: (configService: ConfigService) => {
        const serviceAccount = configService.get<string>(
          'FIREBASE_SERVICE_ACCOUNT',
        );
        const parsedAccount = JSON.parse(serviceAccount);

        const firebaseAdminApp = admin.initializeApp({
          credential: admin.credential.cert(parsedAccount),
        });

        const firebaseAuth = firebaseAdminApp.auth();

        return firebaseAuth;
      },
      inject: [ConfigService],
    },
  ],
  exports: ['FIREBASE_ADMIN_INJECTOR'],
})
export class FirebaseAdminModule {}
