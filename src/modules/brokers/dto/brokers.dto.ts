// src/brokers/dto/brokers.dto.ts

import { IsString, IsNumber, IsEmail } from 'class-validator'; // 📦 Importing necessary validation decorators

// DTO for hiring a broker
export class HireBrokerDto {
  @IsEmail() // 📧 Ensuring brokerEmail is a valid email
  brokerEmail: string; // Email of the broker to hire

  @IsString() // 🏷️ Ensuring targetItemId is a string
  targetItemId: string; // ID of the item to be targeted by the broker

  @IsNumber() // 💰 Ensuring budget is a number
  budget: number; // Budget allocated for hiring the broker
}

// DTO for terminating a broker contract
export class TerminateBrokerContractDto {
  @IsEmail() // 📧 Ensuring brokerEmail is a valid email
  brokerEmail: string; // Email of the broker whose contract is being terminated
}

// DTO for fetching the hire contract status
export class HireContractStatusDto {
  @IsString() // 🏷️ Ensuring hireId is a string
  hireId: string; // ID of the hire contract
}
