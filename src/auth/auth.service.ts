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

@Injectable()
export class AuthService {
  private firebaseApiKey: string;

  constructor(
    @Inject('FIREBASE_ADMIN_INJECTOR')
    private readonly firebaseAuth: admin.auth.Auth,
    public readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    this.firebaseApiKey = this.configService.get<string>('FIREBASE_API_KEY');
  }

  async register(
    name: string,
    email: string,
    user_type: string,
    profile_picture?: string,
    password?: string,
    googleToken?: string,
    language?: string,
    theme?: string,
  ) {
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new BadRequestException('Email is already registered');
    }

    try {
      let firebaseUser;

      if (googleToken) {
        try {
          const decodedToken =
            await this.firebaseAuth.verifyIdToken(googleToken);
          firebaseUser = decodedToken;
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
          throw new UnauthorizedException('Invalid Google token');
        }
      } else if (password) {
        firebaseUser = await this.firebaseAuth.createUser({
          email,
          password,
          displayName: name,
          photoURL: profile_picture || undefined,
        });
      } else {
        throw new BadRequestException('Password or Google token is required');
      }

      const userData = {
        firebase_uid: firebaseUser.uid,
        name,
        email,
        user_type,
        profile_picture: firebaseUser.photoURL || null,
        password: password,
        language,
        theme,
      };

      const user = await this.usersService.create(userData);

      return {
        status: 'success',
        message: 'Registration successful',
        data: {
          user,
        },
      };
    } catch (error) {
      throw new BadRequestException('Registration failed', error.message);
    }
  }

  async login(emailOrIdToken: string, password?: string) {
    try {
      let user;

      if (password) {
        const firebaseUser =
          await this.firebaseAuth.getUserByEmail(emailOrIdToken);

        if (!firebaseUser) {
          throw new UnauthorizedException('Invalid email or password');
        }

        const signInWithPasswordUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.firebaseApiKey}`;
        const response = await axios.post(signInWithPasswordUrl, {
          email: emailOrIdToken,
          password,
          returnSecureToken: true,
        });

        if (!response.data.idToken) {
          throw new UnauthorizedException('Wrong password');
        }

        user = await this.usersService.findByFirebaseUid(firebaseUser.uid);
      } else {
        const decodedToken =
          await this.firebaseAuth.verifyIdToken(emailOrIdToken);
        const firebase_uid = decodedToken.uid;

        user = await this.usersService.findByFirebaseUid(firebase_uid);
      }

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      if (user.status === 'banned') {
        throw new BadRequestException('This account is banned');
      }

      const payload = {
        sub: user._id,
        email: user.email,
        user_type: user.user_type,
      };
      const token = this.jwtService.sign(payload);

      return {
        token,
        user: {
          name: user.name,
          user_type: user.user_type,
          status: user.status,
        },
      };
    } catch (error) {
      console.error(error);
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Authentication failed', error.message);
    }
  }
}
