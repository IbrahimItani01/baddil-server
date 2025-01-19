import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as admin from 'firebase-admin';
import axios from 'axios';

import { UsersService } from '../modules/users/users.service';
import {
  getUserStatusById,
  getUserTypeById,
} from 'src/utils/modules/users/users.utils';
import { PrismaService } from 'src/database/prisma.service';
import { RegisterDto, LoginDto } from './dto/auth.dto'; // 📦 Import DTOs

@Injectable()
export class AuthService {
  private firebaseApiKey: string; // 🔑 Firebase API key for authentication requests

  constructor(
    @Inject('FIREBASE_ADMIN_INJECTOR') // 🛡 Firebase Admin injector
    private readonly firebaseAuth: admin.auth.Auth,
    public readonly usersService: UsersService, // 👤 Handles user-related operations
    private readonly jwtService: JwtService, // 🔒 JWT handling for authentication
    private readonly configService: ConfigService, // ⚙️ Access environment variables
    private readonly prisma: PrismaService, // 🗄 Database access service
  ) {
    this.firebaseApiKey = this.configService.get<string>('FIREBASE_API_KEY'); // 🔑 Load Firebase API key
  }

  /**
   * Registers a new user with Firebase and the database.
   * @param registerDto - The user registration data.
   * @returns User registration details.
   */
  async register(registerDto: RegisterDto) {
    const {
      name,
      email,
      user_type,
      profile_picture,
      password,
      googleToken,
      language,
      theme,
    } = registerDto;

    const existingUser = await this.usersService.findByEmail(email); // 🔍 Check if user already exists
    if (existingUser) {
      throw new BadRequestException('Email is already registered'); // 🚫 Email conflict
    }

    try {
      let firebaseUser;

      if (googleToken) {
        // 🔑 Validate Google token
        try {
          const decodedToken =
            await this.firebaseAuth.verifyIdToken(googleToken);
          firebaseUser = decodedToken;
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
          throw new UnauthorizedException('Invalid Google token'); // 🚫 Invalid Google token
        }
      } else if (password) {
        // 🛡 Create Firebase user with email and password
        firebaseUser = await this.firebaseAuth.createUser({
          email,
          password,
          displayName: name,
          photoURL: profile_picture || undefined,
        });
      } else {
        throw new BadRequestException('Password or Google token is required'); // 🚫 Missing credentials
      }

      const userData = {
        firebase_uid: firebaseUser.uid,
        name,
        email,
        user_type,
        profile_picture: firebaseUser.photoURL || null,
        password,
        language,
        theme,
      };

      const user = await this.usersService.create(userData); // 🛠 Save user in the database

      return {
        status: 'success', // ✅ Registration success status
        message: 'Registration successful', // 🎉 Success message
        data: { user }, // 📊 Registered user data
      };
    } catch (error) {
      throw new BadRequestException('Registration failed', error.message); // 🚫 Registration failed
    }
  }

  /**
   * Logs in a user using Firebase authentication.
   * @param loginDto - The login data (email or token, password).
   * @returns User authentication details and JWT token.
   */
  async login(loginDto: LoginDto) {
    const { emailOrIdToken, password } = loginDto;

    try {
      let user;

      if (password) {
        // 🔑 Authenticate using email and password
        const firebaseUser =
          await this.firebaseAuth.getUserByEmail(emailOrIdToken);

        if (!firebaseUser) {
          throw new UnauthorizedException('Invalid email or password'); // 🚫 Invalid email or password
        }

        const signInWithPasswordUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.firebaseApiKey}`;
        const response = await axios.post(signInWithPasswordUrl, {
          email: emailOrIdToken,
          password,
          returnSecureToken: true,
        });

        if (!response.data.idToken) {
          throw new UnauthorizedException('Wrong password'); // 🚫 Wrong password
        }

        user = await this.usersService.findByFirebaseUid(firebaseUser.uid); // 🔍 Find user by Firebase UID
      } else {
        // 🔑 Authenticate using Firebase ID token
        const decodedToken =
          await this.firebaseAuth.verifyIdToken(emailOrIdToken);
        const firebase_uid = decodedToken.uid;

        user = await this.usersService.findByFirebaseUid(firebase_uid);
      }
      if (!user) {
        throw new UnauthorizedException('User not found'); // 🚫 User not found
      }
      const user_status = await getUserStatusById(
        this.prisma,
        user.user_status_id,
      );
      const user_type = await getUserTypeById(this.prisma, user.user_type_id); // 🔍 Get user type
      const payload = {
        sub: user.id,
        email: user.email,
        user_type,
        firebase_uid: user.firebase_uid,
      };

      const token = this.jwtService.sign(payload); // 🔒 Generate JWT token

      return {
        token, // 🛡 JWT token
        user: {
          name: user.name,
          user_type: user_type,
          status: user_status,
        },
      };
    } catch (error) {
      console.error(error); // 🔴 Log error for debugging
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Authentication failed', error.message); // 🚫 Authentication failed
    }
  }
}
