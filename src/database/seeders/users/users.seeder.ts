import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { faker } from '@faker-js/faker';
import { UserTypeEnum } from 'src/utils/enums.utils';

@Injectable()
export class UserSeeder {
