import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BrokersController } from './brokers.controller';
import { BrokersService } from './brokers.service';
import { Broker, BrokerSchema } from 'src/database/schemas/brokers.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Broker.name, schema: BrokerSchema }]), 
  ],
  controllers: [BrokersController],
  providers: [BrokersService],
  exports: [BrokersService], 
})
export class BrokersModule {}
