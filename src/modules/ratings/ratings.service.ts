import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service'; // 🗄️ Importing PrismaService to interact with the database
import { AddBrokerRatingDto, AddBarterRatingDto } from './dto/ratings.dto'; // 🧳 Importing DTOs

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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new InternalServerErrorException('Failed to add broker rating'); // 🚫 Error handling
    }
  }

  async deleteRating(ratingId: string) {
    // 🗑️ Deleting a rating by ID
    try {
      const existingRating = await this.prisma.rating.findUnique({
        where: { id: ratingId }, // 📑 Find the rating by ID
      });

      if (!existingRating) {
        throw new NotFoundException('Rating not found'); // 🚫 Rating not found error
      }

      await this.prisma.rating.delete({
        where: { id: ratingId }, // 🧹 Deleting the rating from the database
      });

      return { message: 'Rating deleted successfully' }; // 🏁 Return success message
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete rating'); // 🚫 Error handling
    }
  }

  async addBarterRating(
    userId: string, // 🆔 User ID who is adding the rating
    body: AddBarterRatingDto, // 📥 Using AddBarterRatingDto to validate input
  ) {
    const { value, description, barterId } = body; // 📦 Destructuring the DTO to get rating details

    try {
      return await this.prisma.rating.create({
        data: {
          value, // 🌟 Rating value
          description, // ✍️ Rating description
          wrote_by: userId, // 🆔 User ID who wrote the rating
          barter_id: barterId, // 🔄 Barter ID
        },
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new InternalServerErrorException('Failed to add barter rating'); // 🚫 Error handling
    }
  }
}
