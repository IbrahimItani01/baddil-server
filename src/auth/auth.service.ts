import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/modules/users/users.service';
import { BarterersService } from 'src/modules/barterers/barterers.service';
import { BrokersService } from 'src/modules/brokers/brokers.service';
import { Types } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as admin from 'firebase-admin';
import axios from 'axios';

@Injectable()
export class AuthService {
  private firebaseApiKey: string;

  constructor(
    @Inject('FIREBASE_ADMIN_INJECTOR')
    private readonly firebaseAuth: admin.auth.Auth,
    public readonly usersService: UsersService,
    private readonly barterersService: BarterersService,
    private readonly brokersService: BrokersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
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

      const user = await this.usersService.create({
        firebase_uid: firebaseUser.uid,
        name,
        email,
        password: null,
        user_type,
        profile_picture: firebaseUser.photoURL || null,
      });

      const userId = user._id as Types.ObjectId;

      let specificDocument = null;
      if (user_type === 'barterer') {
        await this.barterersService.create(userId);
        specificDocument = await this.barterersService.findByUserId(userId);
      } else if (user_type === 'broker') {
        await this.brokersService.create(userId);
        specificDocument = await this.brokersService.findByUserId(userId);
      }

      return {
        user,
        specificDocument,
      };
    } catch (error) {
      throw new BadRequestException('Registration failed', error);
    }
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password.current_password as unknown as string,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
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
  }
}
