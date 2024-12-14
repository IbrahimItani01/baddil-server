import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from 'src/modules/users/dto/createUser.dto';
import { BarterersService } from 'src/modules/barterers/barterers.service';
import { BrokersService } from 'src/modules/brokers/brokers.service';
import { UsersService } from 'src/modules/users/users.service';
import { Types } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly barterersService: BarterersService,
    private readonly brokersService: BrokersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const { name, email, password, user_type } = createUserDto;

    
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new BadRequestException('Email is already registered');
    }

    try {
      const hashedPassword = await bcrypt.hash(password.current_password, 10);

      const user = await this.usersService.create({
        name,
        email,
        password: {
          current_password: hashedPassword,
          password_forget: password.password_forget,
        },
        user_type,
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
