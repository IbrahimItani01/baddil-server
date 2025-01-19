import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common'; // 📦 Importing necessary decorators and exceptions
import { ManagementService } from './management.service'; // 🛠️ Importing ManagementService for business logic
import { JwtAuthGuard } from 'src/guards/jwt.guard'; // 🔑 Importing JWT authentication guard
import { AllowedUserTypes, UserTypeGuard } from 'src/guards/userType.guard'; // 🛡️ Importing user type guards
import {
  CreateSubscriptionPlanDto,
  UpdateSubscriptionPlanDto,
  CreateCategoryDto,
  UpdateCategoryDto,
  CreateSubcategoryDto,
} from './dto/management.dto'; // 📁 Importing DTOs
import { ApiResponse } from 'src/utils/api/apiResponse.interface';

@UseGuards(JwtAuthGuard, UserTypeGuard) // 🛡️ Applying guards for authentication and user type validation
@Controller('management') // 📍 Base route for management-related operations
export class ManagementController {
  constructor(private readonly managementService: ManagementService) {} // 🏗️ Injecting ManagementService

  /**
   * ➕ Create a new subscription plan
   * @param body - The subscription plan details including name, price, target user type, and criteria.
   */
  @AllowedUserTypes('admin') // 🎯 Restricting access to admin users
  @Post('subscription') // ➕ Endpoint to create a subscription plan
  async createSubscriptionPlan(
    @Body() body: CreateSubscriptionPlanDto, // Using the DTO for validation
  ): Promise<ApiResponse> {
    // Map `targetUser Type` to `targetUser TypeId` for the service method
    const subscriptionPlan =
      await this.managementService.createSubscriptionPlan({
        name: body.name,
        price: body.price,
        targetUserType: body.targetUserType, // Correct property name
        criteria: body.criteria,
      });

    return {
      success: true,
      message: 'Subscription plan created successfully', // ✅ Success message
      data: subscriptionPlan, // 🎉 Created subscription plan data
    };
  }

  /**
   * 📜 Get all subscription plans
   */
  @AllowedUserTypes('admin') // 🎯 Restricting access to admin users
  @Get('subscription') // 📥 Endpoint to get subscription plans
  async getSubscriptionPlans(): Promise<ApiResponse> {
    const plans = await this.managementService.getSubscriptionPlans(); // 🔍 Fetching subscription plans
    return {
      success: true,
      message: 'Subscription plans retrieved successfully', // ✅ Success message
      data: plans, // 🎉 Subscription plans data
    };
  }

  /**
   * ✏️ Update a subscription plan
   * @param id - The ID of the subscription plan to update.
   * @param body - The updated subscription plan details.
   */
  @AllowedUserTypes('admin') // 🎯 Restricting access to admin users
  @Put('subscription/:id') // ✏️ Endpoint to update a subscription plan
  async updateSubscriptionPlan(
    @Param('id') id: string,
    @Body() body: UpdateSubscriptionPlanDto, // Using the DTO for validation
  ): Promise<ApiResponse> {
    const updatedPlan = await this.managementService.updateSubscriptionPlan(
      id,
      body,
    ); // 🔄 Updating the subscription plan
    return {
      success: true,
      message: 'Subscription plan updated successfully', // ✅ Success message
      data: updatedPlan, // 🎉 Updated subscription plan data
    };
  }

  /**
   * ➕ Create a new category
   * @param body - The category details including name and icon.
   */
  @AllowedUserTypes('admin') // 🎯 Restricting access to admin users
  @Post('category') // ➕ Endpoint to create a category
  async createCategory(@Body() body: CreateCategoryDto): Promise<ApiResponse> {
    // Using the DTO for validation
    const category = await this.managementService.createCategory(body); // 🔄 Creating a new category
    return {
      success: true,
      message: 'Category created successfully', // ✅ Success message
      data: category, // 🎉 Created category data
    };
  }

  /**
   * 📜 Get all categories
   */
  // 🎯 Restricting access to admin users
  @AllowedUserTypes('barterer','admin','broker')
  @Get('category') // 📥 Endpoint to get categories
  async getCategories(): Promise<ApiResponse> {
    const categories = await this.managementService.getCategories(); // 🔍 Fetching categories
    return {
      success: true,
      message: 'Categories retrieved successfully', // ✅ Success message
      data: categories, // 🎉 Categories data
    };
  }

  /**
   * ✏️ Update a category
   * @param id - The ID of the category to update.
   * @param body - The updated category details.
   */
  @AllowedUserTypes('admin') // 🎯 Restricting access to admin users
  @Put('category/:id') // ✏️ Endpoint to update a category
  async updateCategory(
    @Param('id') id: string,
    @Body() body: UpdateCategoryDto, // Using the DTO for validation
  ): Promise<ApiResponse> {
    const updatedCategory = await this.managementService.updateCategory(
      id,
      body,
    ); // 🔄 Updating the category
    return {
      success: true,
      message: 'Category updated successfully', // ✅ Success message
      data: updatedCategory, // 🎉 Updated category data
    };
  }

  /**
   * 🗑️ Delete a category
   * @param id - The ID of the category to delete.
   */
  @AllowedUserTypes('admin') // 🎯 Restricting access to admin users
  @Delete('category/:id') // 🗑️ Endpoint to delete a category
  async deleteCategory(@Param('id') id: string): Promise<ApiResponse> {
    await this.managementService.deleteCategory(id); // 🔄 Deleting the category
    return {
      success: true,
      message: 'Category deleted successfully', // ✅ Success message
    };
  }

  /**
   * ➕ Create a new subcategory
   * @param body - The subcategory details including name and main category ID.
   */
  @AllowedUserTypes('admin') // 🎯 Restricting access to admin users
  @Post('subcategory') // ➕ Endpoint to create a subcategory
  async createSubcategory(
    @Body() body: CreateSubcategoryDto, // Using the DTO for validation
  ): Promise<ApiResponse> {
    const subcategory = await this.managementService.createSubcategory(body); // 🔄 Creating a new subcategory
    return {
      success: true,
      message: 'Subcategory created successfully', // ✅ Success message
      data: subcategory, // 🎉 Created subcategory data
    };
  }
}
