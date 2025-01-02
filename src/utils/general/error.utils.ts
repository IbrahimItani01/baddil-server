import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

export function handleError(error: any, customMessage: string) {
  if (error instanceof NotFoundException) {
    throw error; // If it's a NotFoundException, rethrow it
  }
  throw new InternalServerErrorException(customMessage); // General error message for other errors
}
