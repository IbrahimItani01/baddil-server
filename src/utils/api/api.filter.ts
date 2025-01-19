import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiResponse } from './apiResponse.interface';

@Catch()
export class ApiResponseExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorResponse: ApiResponse = {
      success: false,
      message:
        exception instanceof HttpException
          ? exception.message
          : 'An unexpected error occurred',
      error:
        exception instanceof HttpException
          ? exception.getResponse()
          : exception,
    };

    response.status(status).json(errorResponse);
  }
}
