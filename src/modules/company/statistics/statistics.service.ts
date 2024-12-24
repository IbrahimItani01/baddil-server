import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { getUserTypeId } from 'src/utils/modules/users/users.utils';

@Injectable()
export class StatisticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserCounts(): Promise<{
    admins_count: number;
    brokers_count: number;
    barterers_count: number;
  }> {
    const adminTypeId = await getUserTypeId(this.prisma, 'admin');
    const brokerTypeId = await getUserTypeId(this.prisma, 'broker');
    const bartererTypeId = await getUserTypeId(this.prisma, 'barterer');

    const [adminsCount, brokersCount, barterersCount] = await Promise.all([
      this.prisma.user.count({ where: { user_type_id: adminTypeId } }),
      this.prisma.user.count({ where: { user_type_id: brokerTypeId } }),
      this.prisma.user.count({ where: { user_type_id: bartererTypeId } }),
    ]);

    return {
      admins_count: adminsCount,
      brokers_count: brokersCount,
      barterers_count: barterersCount,
    };
  }
}
