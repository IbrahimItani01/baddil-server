import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common'; // 📦 Importing necessary exceptions
import { PrismaService } from 'src/database/prisma.service'; // 🗄️ Importing PrismaService for database access
import {
  CreateSubscriptionPlanDto,
  UpdateSubscriptionPlanDto,
  CreateCategoryDto,
  UpdateCategoryDto,
  CreateSubcategoryDto,
} from './dto/management.dto'; // 📥 Importing the DTOs
import { handleError } from 'src/utils/general/error.utils';
import { checkCategoryExists } from 'src/utils/modules/company/management/management.utils';

@Injectable()
export class ManagementService {
  constructor(private readonly prisma: PrismaService) {} // 🏗️ Injecting PrismaService

  /**
   * ➕ Create a new subscription plan
   * @param data - The subscription plan details including name, price, target user type ID, and criteria.
   * @returns The created subscription plan record.
   * @throws BadRequestException if the price is invalid.
   */
  async createSubscriptionPlan(data: CreateSubscriptionPlanDto) {
    try {
      if (data.price <= 0) {
        throw new BadRequestException('Price must be greater than zero'); // 🚫 Invalid price
      }

      return await this.prisma.subscriptionPlan.create({
        data: {
          name: data.name,
          price: data.price,
          criteria: data.criteria,
          user_type: {
            connect: { id: data.targetUserType }, // Relates to UserType by ID
          },
        },
      });
    } catch (error) {
      handleError(error, 'Failed to create subscription plan');
    }
  }

  /**
   * 📜 Get all subscription plans
   * @returns An array of subscription plans with related features and user types.
   */
  async getSubscriptionPlans() {
    try {
      return await this.prisma.subscriptionPlan.findMany({
        include: { features: true, user_type: true }, // Include related UserType
      });
    } catch (error) {
      handleError(error, 'Failed to retrieve subscription plans');
    }
  }

  /**
   * ✏️ Update a subscription plan
   * @param id - The ID of the subscription plan to update.
   * @param data - The updated subscription plan details.
   * @returns The updated subscription plan record.
   * @throws NotFoundException if the subscription plan is not found.
   */
  async updateSubscriptionPlan(id: string, data: UpdateSubscriptionPlanDto) {
    try {
      const existingPlan = await this.prisma.subscriptionPlan.findUnique({
        where: { id },
      });

      if (!existingPlan) {
        throw new NotFoundException(
          `Subscription plan with ID ${id} not found`,
        ); // 🚫 Plan not found
      }

      return await this.prisma.subscriptionPlan.update({
        where: { id },
        data,
      });
    } catch (error) {
      handleError(error, 'Failed to update subscription plan');
    }
  }

  /**
   * ➕ Create a new category
   * @param data - The category details including name and icon.
   * @returns The created category record.
   */
  async createCategory(data: CreateCategoryDto) {
    try {
      return await this.prisma.category.create({
        data: {
          name: data.name,
          category_icon: data.categoryIcon, // Map to the correct field in Prisma schema
        },
      });
    } catch (error) {
      handleError(error, 'Failed to create category');
    }
  }

  /**
   * 📜 Get all categories
   * @returns An array of categories with their subcategories.
   */
  async getCategories() {
    try {
      return await this.prisma.category.findMany({
        include: { subcategories: true },
      });
    } catch (error) {
      handleError(error, 'Failed to retrieve categories');
    }
  }

  /**
   * ✏️ Update a category
   * @param id - The ID of the category to update.
   * @param data - The updated category details.
   * @returns The updated category record.
   * @throws NotFoundException if the category is not found.
   */
  async updateCategory(id: string, data: UpdateCategoryDto) {
    try {
      await checkCategoryExists(this.prisma, id);

      return await this.prisma.category.update({
        where: { id },
        data: {
          ...data,
          category_icon: data.categoryIcon, // Map to the correct field
        },
      });
    } catch (error) {
      handleError(error, `Failed to update category with ID ${id}`);
    }
  }

  /**
   * 🗑️ Delete a category
   * @param id - The ID of the category to delete.
   * @returns The deleted category record.
   * @throws NotFoundException if the category is not found.
   */
  async deleteCategory(id: string) {
    try {
      await checkCategoryExists(this.prisma, id); // Checking if category exists

      return await this.prisma.category.delete({ where: { id } }); // Deleting the category
    } catch (error) {
      handleError(error, `Failed to delete category with ID ${id}`); // Handling the error
    }
  }

  /**
   * ➕ Create a new subcategory
   * @param data - The subcategory details including name and main category ID.
   * @returns The created subcategory record.
   * @throws NotFoundException if the main category is not found.
   */
  async createSubcategory(data: CreateSubcategoryDto) {
    try {
      await checkCategoryExists(this.prisma, data.mainCategoryId); // Check if the main category exists

      return await this.prisma.subcategory.create({
        data: {
          name: data.name,
          category: {
            connect: { id: data.mainCategoryId }, // Relates to Category by ID
          },
        },
      });
    } catch (error) {
      handleError(
        error,
        `Failed to create subcategory for category ID ${data.mainCategoryId}`,
      ); // Handling the error
    }
  }
}
