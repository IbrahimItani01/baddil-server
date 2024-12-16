import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { faker } from '@faker-js/faker';
import { BarterStatusEnum, RatingEnum } from '../../../utils/enums.utils';
import { MeetupStatusEnum, ReviewSideEnum } from '../../../utils/enums.utils';
import { v4 as uuidv4 } from 'uuid'; 
import { Barter, BarterDocument } from '../../schemas/barters.schema';

const ratingValues = Object.values(RatingEnum).filter(value => typeof value === 'number') as number[];

