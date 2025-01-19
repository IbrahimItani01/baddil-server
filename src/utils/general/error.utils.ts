import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

export function handleError(error: any, customMessage: string) {
  if (error instanceof NotFoundException) {
    throw error;
  }
  throw new InternalServerErrorException(customMessage);
}
