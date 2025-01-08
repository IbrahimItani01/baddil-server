import { Module } from '@nestjs/common';
import { FirebaseClientService } from './firebase-client.service';
import { FirebaseClientController } from './firebase-client.controller';

@Module({
  controllers: [FirebaseClientController],
  providers: [FirebaseClientService],
})
export class FirebaseClientModule {}
