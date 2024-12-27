import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common'; // 📦 Importing necessary exceptions
import { PrismaService } from 'src/database/prisma.service'; // 🗄️ Importing PrismaService for database access

@Injectable()
export class RatingsService {
  constructor(private readonly prisma: PrismaService) {} // 🏗️ Injecting PrismaService

  /**
   * ➕ Add a rating for a broker
   * @param userId - The ID of the user adding the rating.
   * @param brokerId - The ID of the broker being rated.
   * @param value - The rating value.
   * @param description - The description of the rating.
   * @returns The created rating record.
   * @throws InternalServerErrorException if there is an error adding the rating.
   */
  async addBrokerRating(
    userId: string,
    brokerId: string,
    value: number,
    description: string,
  ) {
    try {
      return await this.prisma.rating.create({
        data: {
          value,
          description,
          wrote_by: userId,
          broker_id: brokerId,
        },
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new InternalServerErrorException('Failed to add broker rating'); // 🚫 Error handling
    }
  }

  /**
   * 🗑️ Delete a rating
   * @param ratingId - The ID of the rating to delete.
   * @returns A success message upon deletion.
   * @throws NotFoundException if the rating is not found.
   * @throws InternalServerErrorException if there is an error deleting the rating.
   */
  async deleteRating(ratingId: string) {
    try {
      const existingRating = await this.prisma.rating.findUnique({
        where: { id: ratingId },
      });

      if (!existingRating) {
        throw new NotFoundException('Rating not found'); // 🚫 Error handling for not found
      }

      await this.prisma.rating.delete({
        where: { id: ratingId },
      });

      return { message: 'Rating deleted successfully' }; // Return success message
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete rating'); // 🚫 Error handling
    }
  }

  /**
   * ➕ Add a rating for a barter
   * @param userId - The ID of the user adding the rating.
   * @param barterId - The ID of the barter being rated.
   * @param value - The rating value.
   * @param description - The description of the rating.
   * @returns The created rating record.
   * @throws InternalServerErrorException if there is an error adding the rating.
   */
  async addBarterRating(
    userId: string,
    barterId: string,
    value: number,
    description: string,
  ) {
    try {
      return await this.prisma.rating.create({
        data: {
          value,
          description,
          wrote_by: userId,
          barter_id: barterId,
        },
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new InternalServerErrorException('Failed to add barter rating'); // 🚫 Error handling
    }
  }
}
