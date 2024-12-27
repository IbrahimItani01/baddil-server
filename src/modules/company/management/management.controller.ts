import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Delete,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common'; // 📦 Importing necessary decorators and exceptions
import { ManagementService } from './management.service'; // 🛠️ Importing ManagementService for business logic
import { JwtAuthGuard } from 'src/guards/jwt.guard'; // 🔑 Importing JWT authentication guard
import { AllowedUserTypes, UserTypeGuard } from 'src/guards/userType.guard'; // 🛡️ Importing user type guards

@UseGuards(JwtAuthGuard, UserTypeGuard) // 🛡️ Applying guards for authentication and user type validation
@AllowedUserTypes('admin') // 🎯 Restricting access to admin users
@Controller('management') // 📍 Base route for management-related operations
export class ManagementController {
  constructor(private readonly managementService: ManagementService) {} // 🏗️ Injecting ManagementService

  /**
   * ➕ Create a new subscription plan
   * @param body - The subscription plan details including name, price, target user type, and criteria.
   */
  @Post('subscription') // ➕ Endpoint to create a subscription plan
  async createSubscriptionPlan(
    @Body()
    body: {
      name: string;
      price: number;
      targetUserType: string;
      criteria?: string;
    },
  ) {
    try {
      // Map `targetUser Type` to `targetUser TypeId` for the service method
      const subscriptionPlan =
        await this.managementService.createSubscriptionPlan({
          name: body.name,
          price: body.price,
          targetUserTypeId: body.targetUserType,
          criteria: body.criteria,
        });
      return {
        status: 'success',
        message: 'Subscription plan created successfully', // ✅ Success message
        data: subscriptionPlan, // 🎉 Created subscription plan data
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to create subscription plan', // 🚫 Error message
        HttpStatus.INTERNAL_SERVER_ERROR, // ⚠️ Internal Server Error status
      );
    }
  }

  /**
   * 📜 Get all subscription plans
   */
  @Get('subscription') // 📥 Endpoint to get subscription plans
  async getSubscriptionPlans() {
    try {
      const plans = await this.managementService.getSubscriptionPlans(); // 🔍 Fetching subscription plans
      return {
        status: 'success',
        message: 'Subscription plans retrieved successfully', // ✅ Success message
        data: plans, // 🎉 Subscription plans data
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to retrieve subscription plans', // 🚫 Error message
        HttpStatus.INTERNAL_SERVER_ERROR, // ⚠️ Internal Server Error status
      );
    }
  }

  /**
   * ✏️ Update a subscription plan
   * @param id - The ID of the subscription plan to update.
   * @param body - The updated subscription plan details.
   */
  @Put('subscription/:id') // ✏️ Endpoint to update a subscription plan
  async updateSubscriptionPlan(
    @Param('id') id: string,
    @Body() body: { name?: string; price?: number; criteria?: string },
  ) {
    try {
      const updatedPlan = await this.managementService.updateSubscriptionPlan(
        id,
        body,
      ); // 🔄 Updating the subscription plan
      return {
        status: 'success',
        message: 'Subscription plan updated successfully', // ✅ Success message
        data: updatedPlan, // 🎉 Updated subscription plan data
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to update subscription plan', // 🚫 Error message
        HttpStatus.INTERNAL_SERVER_ERROR, // ⚠️ Internal Server Error status
      );
    }
  }

  /**
   * ➕ Create a new category
   * @param body - The category details including name and icon.
   */
  @Post('category') // ➕ Endpoint to create a category
  async createCategory(@Body() body: { name: string; categoryIcon: string }) {
    try {
      const category = await this.managementService.createCategory(body); // 🔄 Creating a new category
      return {
        status: 'success',
        message: 'Category created successfully', // ✅ Success message
        data: category, // 🎉 Created category data
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to create category', // 🚫 Error message
        HttpStatus.INTERNAL_SERVER_ERROR, // ⚠️ Internal Server Error status
      );
    }
  }

  /**
   * 📜 Get all categories
   */
  @Get('category') // 📥 Endpoint to get categories
  async getCategories() {
    try {
      const categories = await this.managementService.getCategories(); // 🔍 Fetching categories
      return {
        status: 'success',
        message: 'Categories retrieved successfully', // ✅ Success message
        data: categories, // 🎉 Categories data
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to retrieve categories', // 🚫 Error message
        HttpStatus.INTERNAL_SERVER_ERROR, // ⚠️ Internal Server Error status
      );
    }
  }

  /**
   * ✏️ Update a category
   * @param id - The ID of the category to update.
   * @param body - The updated category details.
   */
  @Put('category/:id') // ✏️ Endpoint to update a category
  async updateCategory(
    @Param('id') id: string,
    @Body() body: { name?: string; categoryIcon?: string },
  ) {
    try {
      const updatedCategory = await this.managementService.updateCategory(
        id,
        body,
      ); // 🔄 Updating the category
      return {
        status: 'success',
        message: 'Category updated successfully', // ✅ Success message
        data: updatedCategory, // 🎉 Updated category data
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to update category', // 🚫 Error message
        HttpStatus.INTERNAL_SERVER_ERROR, // ⚠️ Internal Server Error status
      );
    }
  }

  /**
   * 🗑️ Delete a category
   * @param id - The ID of the category to delete.
   */
  @Delete('category/:id') // 🗑️ Endpoint to delete a category
  async deleteCategory(@Param('id') id: string) {
    try {
      await this.managementService.deleteCategory(id); // 🔄 Deleting the category
      return {
        status: 'success',
        message: 'Category deleted successfully', // ✅ Success message
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to delete category', // 🚫 Error message
        HttpStatus.INTERNAL_SERVER_ERROR, // ⚠️ Internal Server Error status
      );
    }
  }

  /**
   * ➕ Create a new subcategory
   * @param body - The subcategory details including name and main category ID.
   */
  @Post('subcategory') // ➕ Endpoint to create a subcategory
  async createSubcategory(
    @Body() body: { name: string; mainCategoryId: string },
  ) {
    try {
      const subcategory = await this.managementService.createSubcategory(body); // 🔄 Creating a new subcategory
      return {
        status: 'success',
        message: 'Subcategory created successfully', // ✅ Success message
        data: subcategory, // 🎉 Created subcategory data
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to create subcategory', // 🚫 Error message
        HttpStatus.INTERNAL_SERVER_ERROR, // ⚠️ Internal Server Error status
      );
    }
  }

  /**
   * 📜 Get all subcategories
   */
  @Get('subcategory') // 📥 Endpoint to get subcategories
  async getSubcategories() {
    try {
      const subcategories = await this.managementService.getSubcategories(); // 🔍 Fetching subcategories
      return {
        status: 'success',
        message: 'Subcategories retrieved successfully', // ✅ Success message
        data: subcategories, // 🎉 Subcategories data
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to retrieve subcategories', // 🚫 Error message
        HttpStatus.INTERNAL_SERVER_ERROR, // ⚠️ Internal Server Error status
      );
    }
  }
}
