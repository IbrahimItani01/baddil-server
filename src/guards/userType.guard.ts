import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SetMetadata } from '@nestjs/common';

export const AllowedUserTypes = (...types: string[]) =>
  SetMetadata('allowedUserTypes', types);

@Injectable()
export class UserTypeGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Retrieve allowed user types from the decorator
    const allowedUserTypes = this.reflector.get<string[]>(
      'allowedUserTypes',
      context.getHandler(),
    );

    if (!allowedUserTypes || allowedUserTypes.length === 0) {
      throw new ForbiddenException(
        'No allowed user types configured for this route',
      );
    }

    // Get the user from the request (set by JwtAuthGuard)
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.user_type) {
      throw new ForbiddenException('User type not found in request');
    }

    // Check if the user's type is allowed
    if (!allowedUserTypes.includes(user.user_type)) {
      throw new ForbiddenException(
        `Access denied: Requires one of the following user types: ${allowedUserTypes.join(
          ', ',
        )}`,
      );
    }

    return true; // Allow access if user type is authorized
  }
}
