import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class BrokerService {
  constructor(private readonly prisma: PrismaService,private readonly usersService: UsersService) {}

}
