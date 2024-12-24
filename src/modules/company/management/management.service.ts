import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class ManagementService {
  constructor(private readonly prisma: PrismaService) {}

  async createSubscriptionPlan(data: {
    name: string;
    price: number;
    targetUserTypeId: string; // Updated to handle foreign key
    criteria?: string;
  }) {
    return this.prisma.subscriptionPlan.create({
      data: {
        name: data.name,
        price: data.price,
        criteria: data.criteria,
        user_type: {
          connect: { id: data.targetUserTypeId }, // Relates to UserType by ID
        },
      },
    });
  }

  async getSubscriptionPlans() {
    return this.prisma.subscriptionPlan.findMany({
      include: { features: true, user_type: true }, // Include related UserType
    });
  }

  async updateSubscriptionPlan(
    id: string,
    data: { name?: string; price?: number; criteria?: string },
  ) {
    return this.prisma.subscriptionPlan.update({
      where: { id },
      data,
    });
  }

  async createCategory(data: { name: string; categoryIcon: string }) {
    return this.prisma.category.create({
      data: {
        name: data.name,
        category_icon: data.categoryIcon, // Map to the correct field in Prisma schema
      },
    });
  }

  async getCategories() {
    return this.prisma.category.findMany({
      include: { subcategories: true },
    });
  }

  async updateCategory(id: string, data: { name?: string; categoryIcon?: string }) {
    return this.prisma.category.update({
      where: { id },
      data: {
        ...data,
        category_icon: data.categoryIcon, // Map to the correct field
      },
    });
  }

  async deleteCategory(id: string) {
    return this.prisma.category.delete({ where: { id } });
  }

  async createSubcategory(data: { name: string; mainCategoryId: string }) {
    return this.prisma.subcategory.create({
      data: {
        name: data.name,
        category: {
          connect: { id: data.mainCategoryId }, // Relates to Category by ID
        },
      },
    });
  }

  async getSubcategories() {
    return this.prisma.subcategory.findMany({
      include: { category: true },
    });
  }
}
