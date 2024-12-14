import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/modules/users/dto/createUser.dto';
import { ApiResponseDto } from 'src/utils/apiResponse.dto';
import { ApiResponseStatusEnum } from 'src/utils/enums.utils';

