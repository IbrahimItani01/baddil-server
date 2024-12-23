import { Injectable, NotFoundException } from '@nestjs/common';
import { ItemCondition } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import * as fs from 'fs';
import * as path from 'path';
@Injectable()
export class WalletsService {
  constructor(private readonly prisma: PrismaService) {}

  async getItemDetails(walletId: string, itemId: string) {
    return await this.prisma.item.findFirst({
      where: { id: itemId, wallet_id: walletId },
    });
  }

    });
  }

