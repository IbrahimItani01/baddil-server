import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
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

    
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    
    const user = await this.usersService.create({
      name,
      email,
      password: hashedPassword, 
      user_type,
    });
