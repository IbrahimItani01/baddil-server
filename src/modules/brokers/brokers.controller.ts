// src/brokers/brokers.controller.ts

import {
  Controller,
  Get,
  UseGuards,
  Request,
  HttpException,
  HttpStatus,
  Delete,
  Body,
  Post,
  Param,
} from '@nestjs/common'; // 📦 Importing necessary decorators and exceptions
import { BrokerService } from './brokers.service'; // 🤝 Importing BrokerService for business logic
import { JwtAuthGuard } from 'src/guards/jwt.guard'; // 🔑 Importing JWT authentication guard
import { UserTypeGuard, AllowedUserTypes } from 'src/guards/userType.guard'; // 🛡️ Importing user type guards
import { HireBrokerDto, TerminateBrokerContractDto } from './dto/brokers.dto'; // 📜 Importing DTOs

@Controller('brokers') // 📍 Base route for broker-related operations
@UseGuards(JwtAuthGuard, UserTypeGuard) // 🛡️ Applying guards for authentication and user type validation
@AllowedUserTypes('barterer', 'broker') // 🎯 Restricting access to specific user types
export class BrokersController {
  constructor(private readonly brokerService: BrokerService) {} // 🏗️ Injecting BrokerService

  @Get('hired-brokers') // 📥 Endpoint to get hired brokers
  async getHiredBrokers(@Request() req) {
    const userId = req.user.id; // 🧑‍💼 Extract user ID from JWT payload
    try {
      const hiredBrokers = await this.brokerService.getHiredBrokers(userId); // 🔍 Fetching hired brokers
      return {
        status: 'success',
        message: 'Hired brokers retrieved successfully', // ✅ Success message
        data: hiredBrokers, // 🎉 Hired brokers data
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to retrieve hired brokers', // 🚫 Error message
        HttpStatus.INTERNAL_SERVER_ERROR, // ⚠️ Internal Server Error status
      );
    }
  }

  @Post() // ➕ Endpoint to hire a broker
  async hireBroker(
    @Body() body: HireBrokerDto, // 📜 Using HireBrokerDto for input validation
    @Request() req,
  ) {
    const userId = req.user.id; // 🧑‍💼 Extract the authenticated user ID from the JWT payload
    try {
      const hireResult = await this.brokerService.hireBroker(
        userId,
        body.brokerEmail,
        body.targetItemId,
        body.budget,
      ); // 🔄 Hiring the broker
      return {
        status: 'success',
        message: 'Broker hired successfully', // ✅ Success message
        data: hireResult, // 🎉 Hire result data
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to hire broker', // 🚫 Error message
        HttpStatus.INTERNAL_SERVER_ERROR, // ⚠️ Internal Server Error status
      );
    }
  }

  @Delete() // ❌ Endpoint to terminate a broker contract
  async terminateBrokerContract(
    @Body() body: TerminateBrokerContractDto, // 📜 Using TerminateBrokerContractDto for input validation
    @Request() req,
  ) {
    const userId = req.user.id; // 🧑‍💼 Extract the authenticated user ID from the JWT payload
    try {
      const hireResult = await this.brokerService.terminateBrokerContract(
        userId,
        body.brokerEmail,
      ); // 🗑️ Terminating the broker contract
      return {
        status: 'success',
        message: 'Broker contract terminated successfully', // ✅ Success message
        data: hireResult, // 🎉 Termination result data
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to terminate broker contract', // 🚫 Error message
        HttpStatus.INTERNAL_SERVER_ERROR, // ⚠️ Internal Server Error status
      );
    }
  }

  @Get('hire-status/:hireId') // 📥 Endpoint to get hire contract status
  async getHireContractStatus(
    @Request() req,
    @Param('hireId') hireId: string, // 📜 Hire ID from the route parameters
  ) {
    const userId = req.user.id; // 🧑‍💼 Extract user ID from JWT payload
    try {
      const contractStatus = await this.brokerService.getHireContractStatus(
        userId,
        hireId,
      ); // 🔍 Fetching contract status
      return {
        status: 'success',
        message: 'Hire contract status retrieved successfully', // ✅ Success message
        data: contractStatus, // 🎉 Contract status data
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to retrieve hire contract status', // 🚫 Error message
        HttpStatus.INTERNAL_SERVER_ERROR, // ⚠️ Internal Server Error status
      );
    }
  }
}
