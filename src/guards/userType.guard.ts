import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SetMetadata } from '@nestjs/common';

/**
 * AllowedUserTypes is a custom decorator that defines the user types
 * allowed to access a particular route or handler. 🛠️
 *
 * This decorator allows route-level access control based on user roles.
 */
export const AllowedUserTypes = (...types: string[]) =>
  SetMetadata('allowedUserTypes', types);

@Injectable()
export class UserTypeGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  /**
   * CanActivate checks if the user has an allowed user type to access the route. 🔍
   * It ensures that only users with a specific user type can access certain routes.
   *
   * @param context - The execution context for the request. 🌐
   * @returns boolean - Returns `true` if access is allowed, otherwise throws a ForbiddenException. 🚫
   */
  canActivate(context: ExecutionContext): boolean {
    // Retrieve allowed user types from the metadata decorator 📜
    const allowedUserTypes = this.reflector.get<string[]>(
      'allowedUserTypes',
      context.getHandler(),
    );

    // If no allowed user types are specified, throw a ForbiddenException 🚫
    if (!allowedUserTypes || allowedUserTypes.length === 0) {
      throw new ForbiddenException(
        'No allowed user types configured for this route', // 🚫 No user type restrictions found
      );
    }

    // Get the user from the request, which is set by JwtAuthGuard 🧑‍💻
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Ensure the user has a type associated with their account ✅
    if (!user || !user.user_type) {
      throw new ForbiddenException('User type not found in request'); // 🚫 Missing user type
    }

    // Check if the user's type is in the list of allowed types ✅
    if (!allowedUserTypes.includes(user.user_type)) {
      throw new ForbiddenException(
        `Access denied: Requires one of the following user types: ${allowedUserTypes.join(
          ', ',
        )}`, // 🚫 User type mismatch
      );
    }

    return true; // ✅ User is authorized to access the route
  }
}
