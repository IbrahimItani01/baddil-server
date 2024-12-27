import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

/**
 * PrismaModule is a global module that provides PrismaService,
 * which serves as the data access layer for the application. 🌐
 *
 * By marking this module as `@Global`, the PrismaService becomes
 * available application-wide without needing to import this module
 * into every other feature module. 🔄
 */
@Global()
@Module({
  providers: [
    PrismaService,
  ],
  exports: [
    PrismaService,
  ],
})
export class PrismaModule {}
