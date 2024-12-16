import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { faker } from '@faker-js/faker';
import { DisputeStatusEnum } from '../../../utils/enums.utils';
import { Dispute, DisputeDocument } from '../../schemas/disputes.schema';
import { User, UserDocument } from '../../schemas/users.schema';

@Injectable()
export class DisputesSeeder {
  constructor(
    @InjectModel(Dispute.name) private disputeModel: Model<DisputeDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  getModel(): Model<DisputeDocument> {
    return this.disputeModel;
  }

