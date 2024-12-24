import { Module } from '@nestjs/common';
import { PerformancesService } from './performances.service';
import { PerformancesController } from './performances.controller';

@Module({
  controllers: [PerformancesController],
  providers: [PerformancesService],
})
export class PerformancesModule {}
