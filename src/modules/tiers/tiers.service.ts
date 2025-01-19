import { Injectable, NotFoundException } from '@nestjs/common'; // 📦 Importing necessary exceptions
import { PrismaService } from 'src/database/prisma.service'; // 🗄️ Importing PrismaService for database access
import { CreateTierDto, UpdateTierDto } from './dto/tiers.dto'; // 🛠️ Importing DTOs
import { handleError } from 'src/utils/general/error.utils';

@Injectable()
export class TiersService {
  constructor(private readonly prisma: PrismaService) {} // 🏗️ Injecting PrismaService

  /**
   * 📜 Get the tier information for a barterer
   * @param userId - The ID of the user to retrieve tier information for.
   * @returns The tier information for the specified barterer.
   * @throws NotFoundException if the user is not found.
   */
  async getBartererTier(userId: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: {
          tier: true, // Include the tier details
          Barter1: true, // Include barters related to the user
        },
      });

      if (!user) {
        throw new NotFoundException('User not found'); // 🚫 Error handling for not found
      }

      const completedBarters = user.Barter1.filter(
        (barter) => barter.status === 'completed',
      ).length;

      const tierRequirement = user.tier.requirement;
      const progress = Math.min(
        (completedBarters / tierRequirement) * 100,
        100,
      ); // Calculate progress percentage

      return {
        currentTier: user.tier.name,
        tierRequirement: tierRequirement,
        completedBarters,
        progress, // Progress in percentage
      };
    } catch (error) {
      handleError(error, 'failed to get barterer tier');
    }
  }

  /**
   * ➕ Create a new tier
   * @param data - The tier details including name and requirement.
   * @returns The created tier information.
   */
  async createTier(data: CreateTierDto) {
    // 📥 Accepting CreateTierDto
    try {
      return this.prisma.tier.create({ data });
    } catch (error) {
      handleError(error, 'failed to create tier');
    }
  }

  /**
   * 📜 Get all tiers
   * @returns An array of all tiers.
   */
  async getTiers() {
    try {
      return this.prisma.tier.findMany({ orderBy: { requirement: 'asc' } });
    } catch (error) {
      handleError(error, 'failed to get tiers');
    }
  }

  /**
   * 📜 Update a specific tier
   * @param id - The ID of the tier to update.
   * @param data - The updated tier details.
   * @returns The updated tier information.
   */
  async updateTier(id: string, data: UpdateTierDto) {
    // 📥 Accepting UpdateTierDto
    try {
      return this.prisma.tier.update({
        where: { id },
        data,
      });
    } catch (error) {
      handleError(error, 'failed to update tier');
    }
  }

  /**
   * 📜 Evaluate and update the user's tier based on their barters
   * @param userId - The ID of the user to evaluate.
   * @returns A message indicating the result of the evaluation.
   * @throws NotFoundException if the user is not found.
   */
  async evaluateAndUpdateUserTier(userId: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: { user_type: true, tier: true },
      });

      if (!user) {
        throw new NotFoundException('User not found'); // 🚫 Error handling for not found
      }

      if (user.user_type.type !== 'barterer') {
        throw new NotFoundException(
          'This API only applies to users of type "barterer"',
        ); // 🚫 Error handling for user type
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
    } catch (error) {
      handleError(error, 'evaluation failed');
    }
  }

  /**
   * 🗑️ Delete a specific tier
   * @param id - The ID of the tier to delete.
   * @returns A success message if the deletion was successful.
   * @throws InternalServerErrorException if the deletion fails.
   */
  async deleteTier(id: string) {
    try {
      await this.prisma.tier.delete({
        where: { id },
      });
      return { success: true, message: 'Tier deleted successfully' };
    } catch (error) {
      handleError(error, 'failed to delete tier');
    }
  }
}
