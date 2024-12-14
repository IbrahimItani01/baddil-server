import { Module } from '@nestjs/common';
import { BarterersController } from './barterers.controller';
import { BarterersService } from './barterers.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Barterer, BartererSchema } from 'src/database/schemas/barterers.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Barterer.name, schema: BartererSchema }]),
  ],
  controllers: [BarterersController],
  providers: [BarterersService],
  exports:[BarterersService]
})
export class BarterersModule {}
