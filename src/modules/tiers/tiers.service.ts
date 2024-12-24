import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class TiersService {
  constructor(private readonly prisma: PrismaService) {}

  async getBartererTier(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        tier: true, // Include the tier details
        Barter1: true, // Include barters related to the user
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const completedBarters = user.Barter1.filter(
      (barter) => barter.status === 'completed',
    ).length;

    const tierRequirement = user.tier.requirement;
    const progress = Math.min((completedBarters / tierRequirement) * 100, 100); // Calculate progress percentage

    return {
      currentTier: user.tier.name,
      tierRequirement: tierRequirement,
      completedBarters,
      progress, // Progress in percentage
    };
  }

  // Update the user's tier based on the new tier id
  async updateBartererTier(userId: string, tierId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Update the user's tier
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { tier_id: tierId },
    });

    return updatedUser;
  }
  async createTier(data: { name: string; requirement: number }) {
    return this.prisma.tier.create({ data });
  }

  async getTiers() {
    return this.prisma.tier.findMany({ orderBy: { requirement: 'asc' } });
  }

  async updateTier(id: string, data: { name?: string; requirement?: number }) {
    return this.prisma.tier.update({
      where: { id },
      data,
    });
  }

}
