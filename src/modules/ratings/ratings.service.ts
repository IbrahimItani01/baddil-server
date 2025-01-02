import {
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service'; // 🗄️ Importing PrismaService to interact with the database
import { AddBrokerRatingDto, AddBarterRatingDto } from './dto/ratings.dto'; // 🧳 Importing DTOs
import { handleError } from 'src/utils/general/error.utils';
import { checkEntityExists } from 'src/utils/general/models.utils';

@Injectable() // 🛠️ Marking this class as injectable for dependency injection
export class RatingsService {
  constructor(private readonly prisma: PrismaService) {} // 🏗️ Injecting PrismaService

  async addBrokerRating(
    userId: string, // 🆔 User ID who is adding the rating
    body: AddBrokerRatingDto, // 📥 Using AddBrokerRatingDto to validate input
  ) {
    const { value, description, brokerId } = body; // 📦 Destructuring the DTO to get rating details

    try {
      return await this.prisma.rating.create({
        data: {
          value, // 🌟 Rating value
          description, // ✍️ Rating description
          wrote_by: userId, // 🆔 User ID who wrote the rating
          broker_id: brokerId, // 🧑‍💼 Broker ID
        },
      });
    } catch (error) {
      handleError(error, 'Failed to add broker rating');
    }
  }

  async deleteRating(ratingId: string) {
    // 🗑️ Deleting a rating by ID
    try {
      await checkEntityExists(this.prisma, 'rating', ratingId);

      await this.prisma.rating.delete({
        where: { id: ratingId }, // 🧹 Deleting the rating from the database
      });

      return { message: 'Rating deleted successfully' }; // 🏁 Return success message
    } catch (error) {
      handleError(error, 'Failed to delete rating');
    }
  }

  async addBarterRating(
    userId: string, // 🆔 User ID who is adding the rating
    body: AddBarterRatingDto, // 📥 Using AddBarterRatingDto to validate input
  ) {
    const { value, description, barterId } = body; // 📦 Destructuring the DTO to get rating details

    try {
      await this.validateRatingValue(value);

      return await this.prisma.rating.create({
        data: {
          value, // 🌟 Rating value
          description, // ✍️ Rating description
          wrote_by: userId, // 🆔 User ID who wrote the rating
          barter_id: barterId, // 🔄 Barter ID
        },
      });
    } catch (error) {
      handleError(error, 'Failed to add barter rating');
    }
  }

  private async validateRatingValue(value: number) {
    if (value >= 1 && value <= 5) {
      return true;
    }
    throw new Error('Rating value must be between 1 and 5');
  }
}
