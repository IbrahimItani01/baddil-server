import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ManagementService } from './management.service';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { AllowedUserTypes, UserTypeGuard } from 'src/guards/userType.guard';

@UseGuards(JwtAuthGuard, UserTypeGuard)
@AllowedUserTypes('admin')
@Controller('management')
export class ManagementController {
  constructor(private readonly managementService: ManagementService) {}

  @Post('subscription')
  createSubscriptionPlan(
    @Body()
    body: {
      name: string;
      price: number;
      targetUserType: string;
      criteria?: string;
    },
  ) {
    // Map `targetUserType` to `targetUserTypeId` for the service method
    return this.managementService.createSubscriptionPlan({
      name: body.name,
      price: body.price,
      targetUserTypeId: body.targetUserType,
      criteria: body.criteria,
    });
  }

  @Get('subscription')
  getSubscriptionPlans() {
    return this.managementService.getSubscriptionPlans();
  }

  @Put('subscription/:id')
  updateSubscriptionPlan(
    @Param('id') id: string,
    @Body() body: { name?: string; price?: number; criteria?: string },
  ) {
    return this.managementService.updateSubscriptionPlan(id, body);
  }

  @Post('category')
  createCategory(@Body() body: { name: string; categoryIcon: string }) {
    // Map `categoryIcon` to `category_icon` if necessary in the service layer
    return this.managementService.createCategory(body);
  }

  @Get('category')
  getCategories() {
    return this.managementService.getCategories();
  }
