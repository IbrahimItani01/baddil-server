import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BarterersController } from './barterers.controller';
import { BarterersService } from './barterers.service';
import { Barterer, BartererSchema } from '../../database/schemas/barterers.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Barterer.name, schema: BartererSchema }]),
  ],
  controllers: [BarterersController],
  providers: [BarterersService],
  exports:[BarterersService]
})
export class BarterersModule {}
