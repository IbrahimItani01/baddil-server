import { Injectable } from '@nestjs/common'; // 🏷️ Injectable decorator for NestJS services
import { PassportStrategy } from '@nestjs/passport'; // 🔒 PassportStrategy to integrate with Passport
import { ConfigService } from '@nestjs/config'; // ⚙️ ConfigService to access environment variables
import { ExtractJwt, Strategy } from 'passport-jwt'; // 💼 Passport JWT strategy to handle JWT extraction and validation

// 🛡️ JwtStrategy class to handle JWT-based authentication
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  // 🚀 Constructor to initialize JWT strategy with secret and token extraction logic
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // 📑 Extract JWT from the Authorization header
      secretOrKey: configService.get<string>('JWT_SECRET'), // 🔑 Get the JWT secret from environment variables
    });
  }

  // 🔒 Validate the payload from the JWT token
  async validate(payload: any) {
    // Return only the necessary user information from the JWT payload
    return {
      id: payload.sub, // 🆔 Extract user ID from the payload
      email: payload.email, // 📧 Extract user email from the payload
      userType: payload.user_type, // 🧑‍💼 Extract user type (e.g., admin, user, etc.)
    };
  }
}
