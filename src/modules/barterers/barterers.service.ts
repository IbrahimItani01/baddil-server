import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class BarterersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
  ) {}

  async getBartererInfo(userId: string) {
    // Fetch the barterer's information
    const barterer = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        Barter1: { include: { user2_item: true } },
        Barter2: { include: { user1_item: true } },
        Wallet: { include: { Item: true } },
      },
    });

    if (!barterer) {
      throw new Error('Barterer not found');
    }

    return {
      id: barterer.id,
      name: barterer.name,
      email: barterer.email,
      wallet: barterer.Wallet.map((wallet) => ({
        id: wallet.id,
        items: wallet.Item,
      })),
      barteringHistory: [
        ...barterer.Barter1.map((barter) => ({
          id: barter.id,
          status: barter.status,
          itemTraded: barter.user2_item,
        })),
        ...barterer.Barter2.map((barter) => ({
          id: barter.id,
          status: barter.status,
          itemTraded: barter.user1_item,
        })),
      ],
    };
  }

 
}
