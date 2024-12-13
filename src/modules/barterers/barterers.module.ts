import { Module } from '@nestjs/common';
import { BarterersController } from './barterers.controller';
import { BarterersService } from './barterers.service';

@Module({
  controllers: [BarterersController],
  providers: [BarterersService],
  exports:[BarterersService]
})
export class BarterersModule {}
