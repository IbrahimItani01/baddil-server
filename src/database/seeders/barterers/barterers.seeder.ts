import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { faker } from '@faker-js/faker';
import { Barterer, BartererDocument } from 'src/database/schemas/barterers.schema';
import { User, UserDocument } from 'src/database/schemas/users.schema';
import { AutoTradeStatusEnum, ItemConditionEnum } from 'src/utils/enums.utils';
import { Broker, BrokerDocument } from 'src/database/schemas/brokers.schema';
