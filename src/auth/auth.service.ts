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

