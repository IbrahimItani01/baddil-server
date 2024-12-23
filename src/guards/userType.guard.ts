import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SetMetadata } from '@nestjs/common';

export const AllowedUserTypes = (...types: string[]) =>
  SetMetadata('allowedUserTypes', types);

