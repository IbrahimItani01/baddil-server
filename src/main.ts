import { NestFactory } from '@nestjs/core'; // 🏗️ Importing NestFactory to create the NestJS application
import { AppModule } from './app.module'; // 📦 Importing the main application module
import { ConfigService } from '@nestjs/config'; // ⚙️ Importing ConfigService to manage environment variables
import { Logger, ValidationPipe } from '@nestjs/common'; // 🛠️ Importing Logger for logging and ValidationPipe for request validation

async function bootstrap() {
  // 🚀 Creating the NestJS application instance
  const app = await NestFactory.create(AppModule);

  // 🔧 Getting the ConfigService to retrieve environment variables like PORT
  const configService = app.get(ConfigService);

  // 🌐 Fetching the port from the config, defaulting to 3000 if not set
  const port = configService.get('PORT', 3000);

  // 🔄 Applying global validation pipe to validate incoming requests
  app.useGlobalPipes(new ValidationPipe());

  app.enableCors();

  // 🌍 Setting a global prefix for all routes (e.g., /api)
  app.setGlobalPrefix('api');

  try {
    // 🖥️ Starting the server and listening on the specified port
    await app.listen(port);
    Logger.log(`🚀 Server started on http://localhost:${port}`); // 🎉 Logging success message when the server starts
  } catch (error) {
    Logger.error('❌ Server failed to start:', error); // ⚠️ Logging error if the server fails to start
  }
}

// 🏁 Calling the bootstrap function to start the application
bootstrap();
