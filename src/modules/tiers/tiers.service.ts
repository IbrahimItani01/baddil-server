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

  async evaluateAndUpdateUserTier(userId: string) {
    // Find the user and ensure they are of user type "barterer"
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { user_type: true, tier: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.user_type.type !== 'barterer') {
      throw new NotFoundException(
        'This API only applies to users of type "barterer"',
      );
    }

    // Count the number of barters associated with the user
    const barterCount = await this.prisma.barter.count({
      where: {
        OR: [{ user1_id: user.id }, { user2_id: user.id }],
      },
    });

    // Get the user's current tier and all available tiers
    const tiers = await this.prisma.tier.findMany({
      orderBy: { requirement: 'asc' },
    });
    const currentTier = user.tier_id ? user.tier : null;

    // Determine the next tier based on requirements
    const nextTier = tiers.find(
      (tier) =>
        tier.requirement > (currentTier ? currentTier.requirement : 0) &&
        tier.requirement <= barterCount,
    );

    if (nextTier) {
      // Update the user's tier to the next tier
      const updatedUser = await this.prisma.user.update({
        where: { id: user.id },
        data: { tier_id: nextTier.id },
        include: { tier: true }, // Include the updated tier in the response
      });
      return {
        message: `User's tier updated to ${nextTier.name}`,
        updatedTier: updatedUser.tier,
      };
    }

    return { message: 'No tier update required for the user' };
  }
  
}
