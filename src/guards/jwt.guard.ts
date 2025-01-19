import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common'; // 📦 Importing necessary decorators and exceptions
import { AuthGuard } from '@nestjs/passport'; // 🔑 Importing AuthGuard from Passport

/**
 * JwtAuthGuard is a custom guard that extends the AuthGuard from Passport
 * to protect routes by verifying the JWT token provided by the user. 🔐
 *
 * It uses the 'jwt' strategy to handle authentication and user validation.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  /**
   * canActivate checks if the user has a valid JWT token
   * and if the route can be accessed by the user. 🛡️
   */
  canActivate(context: ExecutionContext) {
    return super.canActivate(context); // ✅ Call the parent method to check access
  }

  /**
   * handleRequest processes the authenticated user
   * or throws an UnauthorizedException if authentication fails. ❌
   *
   * @param err The error that occurred during authentication (if any).
   * @param user The authenticated user, or null if authentication fails.
   */
  handleRequest(err, user) {
    if (err || !user) {
      throw err || new UnauthorizedException(); // Unauthorized access 🚫
    }

    return user; // Return the authenticated user ✅
  }
}