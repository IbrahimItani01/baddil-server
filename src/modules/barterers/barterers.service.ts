import { Injectable, NotFoundException } from '@nestjs/common'; // 📦 Importing necessary exceptions
import { PrismaService } from 'src/database/prisma.service'; // 🗄️ Importing PrismaService for database access

/**
 * 🛠️ Barterers Service
 * This service handles the business logic related to barterers, such as fetching
 * barterer information, including their bartering history and wallet details.
 */
@Injectable()
export class BarterersService {
  constructor(private readonly prisma: PrismaService) {} // 🏗️ Injecting PrismaService

  /**
   * 📄 Get Barterer Information
   * Fetches detailed information about a specific barterer, including their bartering history and wallet items.
   *
   * @param userId - The ID of the user (barterer)
   * @returns A detailed object containing the barterer's info, wallet items, and history
   * @throws NotFoundException if the barterer is not found
   */
  async getBartererInfo(userId: string) {
    // Fetch the barterer's information from the database, including relevant related data.
    const barterer = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        Barter1: { include: { user2_item: true } },
        Barter2: { include: { user1_item: true } },
        Wallet: { include: { Item: true } },
      },
    });

    // If the barterer does not exist, throw a NotFoundException
    if (!barterer) {
      throw new NotFoundException('Barterer not found');
    }

    // Return the formatted data
    return {
      id: barterer.id,
      name: barterer.name,
      email: barterer.email,
      wallet: barterer.Wallet.map((wallet) => ({
        id: wallet.id,
        items: wallet.Item,
      })),
      barteringHistory: [
        ...this.mapBarters(barterer.Barter1, 'user2_item'),
        ...this.mapBarters(barterer.Barter2, 'user1_item'),
      ],
    };
  }

  /**
   * 📜 Helper Method to Map Barters
   * A utility method to map over barter records and format them.
   *
   * @param barters - The list of barter records to map
   * @param itemKey - The key used to identify the traded item in the barter
   * @returns An array of formatted barter objects
   */
  private mapBarters(barters, itemKey: string) {
    return barters.map((barter) => ({
      id: barter.id,
      status: barter.status,
      itemTraded: barter[itemKey], // Dynamically access the item based on the provided key
    }));
  }
}
