// src/brokers/brokers.controller.ts

import {
  Controller,
  Get,
  UseGuards,
  Request,
  Delete,
  Body,
  Post,
  Param,
} from '@nestjs/common'; // 📦 Importing necessary decorators and exceptions
import { BrokerService } from './brokers.service'; // 🤝 Importing BrokerService for business logic
import { JwtAuthGuard } from 'src/guards/jwt.guard'; // 🔑 Importing JWT authentication guard
import { UserTypeGuard, AllowedUserTypes } from 'src/guards/userType.guard'; // 🛡️ Importing user type guards
import { HireBrokerDto, TerminateBrokerContractDto } from './dto/brokers.dto'; // 📜 Importing DTOs
import { ApiResponse } from 'src/utils/api/apiResponse.interface';

@Controller('brokers') // 📍 Base route for broker-related operations
@UseGuards(JwtAuthGuard, UserTypeGuard) // 🛡️ Applying guards for authentication and user type validation
export class BrokersController {
  constructor(private readonly brokerService: BrokerService) {} // 🏗️ Injecting BrokerService

  @AllowedUserTypes('barterer', 'broker') // 🎯 Restricting access to specific user types
  @Get('hired-brokers') // 📥 Endpoint to get hired brokers
  async getHiredBrokers(@Request() req): Promise<ApiResponse> {
    const userId = req.user.id; // 🧑‍💼 Extract user ID from JWT payload

    const hiredBrokers = await this.brokerService.getHiredBrokers(userId); // 🔍 Fetching hired brokers
    return {
      success: true,
      message: 'Hired brokers retrieved successfully', // ✅ Success message
      data: hiredBrokers, // 🎉 Hired brokers data
    };
  }

  @AllowedUserTypes('barterer', 'broker') // 🎯 Restricting access to specific user types
  @Post() // ➕ Endpoint to hire a broker
  async hireBroker(
    @Body() body: HireBrokerDto, // 📜 Using HireBrokerDto for input validation
    @Request() req,
  ): Promise<ApiResponse> {
    const userId = req.user.id; // 🧑‍💼 Extract the authenticated user ID from the JWT payload
    const hireResult = await this.brokerService.hireBroker(userId, body); // 🔄 Hiring the broker
    return {
      success: true,
      message: 'Broker hired successfully', // ✅ Success message
      data: hireResult, // 🎉 Hire result data
    };
  }

  @AllowedUserTypes('barterer', 'broker') // 🎯 Restricting access to specific user types
  @Delete() // ❌ Endpoint to terminate a broker contract
  async terminateBrokerContract(
    @Body() body: TerminateBrokerContractDto, // 📜 Using TerminateBrokerContractDto for input validation
    @Request() req,
  ): Promise<ApiResponse> {
    const userId = req.user.id; // 🧑‍💼 Extract the authenticated user ID from the JWT payload
    const hireResult = await this.brokerService.terminateBrokerContract(
      userId,
      body.brokerEmail,
    ); // 🗑️ Terminating the broker contract
    return {
      success: true,
      message: 'Broker contract terminated successfully', // ✅ Success message
      data: hireResult, // 🎉 Termination result data
    };
  }
  
  @AllowedUserTypes('barterer', 'broker') // 🎯 Restricting access to specific user types
  @Get('hire-status/:hireId') // 📥 Endpoint to get hire contract status
  async getHireContractStatus(
    @Request() req,
    @Param('hireId') hireId: string, // 📜 Hire ID from the route parameters
  ): Promise<ApiResponse> {
    const userId = req.user.id; // 🧑‍💼 Extract user ID from JWT payload
    const contractStatus = await this.brokerService.getHireContractStatus(
      userId,
      hireId,
    ); // 🔍 Fetching contract status
    return {
      success: true,
      message: 'Hire contract status retrieved successfully', // ✅ Success message
      data: contractStatus, // 🎉 Contract status data
    };
  }
}
