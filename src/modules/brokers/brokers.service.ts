import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Broker, BrokerDocument } from 'src/database/schemas/brokers.schema';

@Injectable()
export class BrokersService {
  constructor(
    @InjectModel(Broker.name) private brokerModel: Model<BrokerDocument>,
  ) {}

