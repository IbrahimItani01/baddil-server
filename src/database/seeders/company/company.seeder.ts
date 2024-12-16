import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { faker } from '@faker-js/faker';
import { Company, CompanyDocument } from "../../schemas/company.schema";

@Injectable()
export class CompanySeeder {
  constructor(@InjectModel(Company.name) private companyModel: Model<CompanyDocument>) {}

  getModel(): Model<CompanyDocument> {
    return this.companyModel;
  }

  async seed() {
    const existingCompany = await this.companyModel.findOne();
    if (existingCompany) {
      console.warn("⚠️ Company document already exists");
      return; 
    }

