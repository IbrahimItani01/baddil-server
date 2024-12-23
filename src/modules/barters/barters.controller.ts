import { Controller, Get, Post, Put, Delete, Param, Body, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { AllowedUserTypes, UserTypeGuard } from 'src/guards/userType.guard';
import { BartersService } from './barters.service';
import { BarterStatus } from '@prisma/client';


@Controller('barters')
@UseGuards(JwtAuthGuard, UserTypeGuard)
@AllowedUserTypes('barterer')
export class BartersController {
  constructor(private readonly barterService: BartersService) {}
 
  @Get(':userId')
  async getBartersByUser(@Param('userId') userId: string) {
    try {
      const barters = await this.barterService.getBartersByUser(userId);
      return {
        status: 'success',
        message: 'Barters fetched successfully',
        data: barters,
      };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new Error('Failed to fetch barters');
    }
  }

