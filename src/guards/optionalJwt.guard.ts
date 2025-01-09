import { Injectable, ExecutionContext } from '@nestjs/common';
import { JwtAuthGuard } from './jwt.guard';

@Injectable()
export class OptionalJwtAuthGuard extends JwtAuthGuard {
  handleRequest(err, user) {
    if (err) {
      throw err; // Re-throw errors if there are issues with the token
    }
    // Allow unauthenticated access by returning null if no user
    return user || null;
  }

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const authorizationHeader = request.headers['authorization'];
    if (!authorizationHeader) {
      return true; // Skip guard if no token is provided
    }
    return super.canActivate(context); // Use JwtAuthGuard logic if token exists
  }
}
