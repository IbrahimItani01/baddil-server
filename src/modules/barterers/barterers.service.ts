import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Barterer, BartererDocument } from 'src/database/schemas/barterers.schema';

@Injectable()
export class BarterersService {
  constructor(
    @InjectModel(Barterer.name) private bartererModel: Model<BartererDocument>,
  ) {}

  async create(userId: Types.ObjectId): Promise<Barterer> {
    const newBarterer = new this.bartererModel({ user_id:userId });
    return newBarterer.save();
  }
  

