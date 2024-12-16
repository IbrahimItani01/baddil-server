import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DisputeStatusEnum } from '../../../utils/enums.utils';
import { faker } from '@faker-js/faker';
import { Dispute, DisputeDocument } from '../../schemas/disputes.schema';
import { User, UserDocument } from '../../schemas/users.schema';

