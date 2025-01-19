import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  OnApplicationShutdown,
} from '@nestjs/common';
import { PrismaClient, Prisma } from '@prisma/client';

/**
 * PrismaService
 *
 * A service that extends PrismaClient to integrate with NestJS.
 * 🌐 It handles database connections during the lifecycle of the application
 * and provides a centralized place to configure Prisma-related logic.
 */
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy, OnApplicationShutdown
{
  /**
   * Lifecycle hook: onModuleInit
   *
   * 📅 This method is triggered when the module is initialized.
   * 🔌 It establishes a connection to the database.
   */
  async onModuleInit() {
    try {
      console.log('Connecting to the database...'); // 🌐 Start connecting
      await this.$connect(); // 🔗 Connect to the database
      console.log('Database connection established.'); // ✅ Successfully connected
    } catch (error) {
      console.error('Failed to connect to the database:', error); // ❌ Failed to connect
      throw error; // 🚨 Ensure application fails if database is not connected
    }
  }

  /**
   * Lifecycle hook: onModuleDestroy
   *
   * 🧹 This method is triggered when the module is destroyed.
   * 🚪 It disconnects from the database to release resources.
   */
  async onModuleDestroy() {
    try {
      console.log('Disconnecting from the database...'); // 🔌 Start disconnecting
      await this.$disconnect(); // 🚪 Disconnect from the database
      console.log('Database connection closed.'); // ✅ Successfully disconnected
    } catch (error) {
      console.error('Error during database disconnection:', error); // ❌ Error during disconnection
    }
  }

  /**
   * Lifecycle hook: onApplicationShutdown
   *
   * ⏹️ This method is triggered when the application is shutting down.
   * 🛑 Ensures the database connection is gracefully closed.
   *
   * @param signal Optional shutdown signal (e.g., SIGINT, SIGTERM)
   */
  async onApplicationShutdown(signal?: string) {
    console.log(`Application is shutting down with signal: ${signal}`); // 🚨 Application shutdown signal
    await this.onModuleDestroy(); // 🧹 Clean up resources before shutdown
  }

  /**
   * Middleware: Logging Queries
   *
   * 📝 Logs query execution time for performance monitoring during development.
   * ⚠️ This can be commented out or removed in production environments.
   */
  constructor() {
    super();
    this.$use(async (params, next) => {
      const before = Date.now(); // ⏱️ Start time
      const result = await next(params); // 🚀 Execute the query
      const after = Date.now(); // ⏱️ End time
      console.log(
        `Query ${params.model}.${params.action} took ${after - before}ms`, // 📊 Log query execution time
      );
      return result;
    });
  }

  /**
   * Utility: Clean Database
   *
   * 🧼 Resets the database by truncating all tables. Useful for testing environments.
   * ⚠️ WARNING: This will delete all data in the database.
   */
  async cleanDatabase() {
    console.warn('Cleaning the database... This action will delete all data!'); // ⚠️ Warning before cleaning

    // 📚 Query to fetch all table names
    const tables = await this.$queryRaw<{ table_name: string }[]>( // 📦 Fetch tables
      Prisma.sql`SELECT table_name FROM information_schema.tables WHERE table_schema = DATABASE() AND table_type = 'BASE TABLE';`,
    );

    for (const { table_name } of tables) {
      // 🧹 Unsafe raw query to truncate tables
      await this.$executeRawUnsafe(`TRUNCATE TABLE \`${table_name}\`;`);
    }

    console.log('Database cleaned.'); // ✅ Database cleaned successfully
  }
}
