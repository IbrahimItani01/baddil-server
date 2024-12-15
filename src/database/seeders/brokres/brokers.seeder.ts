import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { faker } from '@faker-js/faker';
import { Broker, BrokerDocument } from 'src/database/schemas/brokers.schema';
import { User, UserDocument } from 'src/database/schemas/users.schema';
import {
  Earnings,
  Performance,
  VipStatus,
} from 'src/database/subSchemas/brokers.subSchema';
import {
  ItemConditionEnum,
  ClientStatusEnum,
  RatingEnum,
} from 'src/utils/enums.utils';
import { v4 as uuidv4 } from 'uuid';
import { Barterer, BartererDocument } from 'src/database/schemas/barterers.schema';
