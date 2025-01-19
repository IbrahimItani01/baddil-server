import { IsString, IsNumber } from 'class-validator'; // 📏 Importing validation decorators

/**
 * DTO for getting broker-specific data.
 */
export class GetBrokerDataDto {
  @IsString()
  brokerId: string; // 🆔 Broker ID for filtering data
}

/**
 * DTO for responses containing earnings data.
 */
export class BrokerEarningsDto {
  @IsNumber()
  totalEarnings: number; // 💰 Total earnings of the broker

  @IsNumber()
  completedHires: number; // 📊 Count of completed hires
}

/**
 * DTO for responses containing barters grouped by status.
 */
export class BrokerBartersDto {
  [status: string]: number; // 📋 Key-value pairs representing status and count
}

/**
 * DTO for responses containing broker ratings data.
 */
export class BrokerRatingsDto {
  @IsNumber()
  averageRating: number; // ⭐ Average rating

  @IsNumber()
  totalRatings: number; // 📈 Total ratings count
}
