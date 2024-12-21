import { Module } from '@nestjs/common';
import { BarterersController } from './barterers.controller';
import { BarterersService } from './barterers.service';
import { PrismaService } from '../../database/prisma.service';

@Module({
  controllers: [BarterersController],
  providers: [BarterersService, PrismaService],
  exports: [BarterersService],
})
export class BarterersModule {}
