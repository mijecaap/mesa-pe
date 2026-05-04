import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { OpeningHourInput } from '@mesa/shared-types';

@Injectable()
export class OpeningHoursService {
  constructor(private readonly prisma: PrismaService) {}

  async findByBusiness(businessId: string) {
    return this.prisma.openingHour.findMany({
      where: { businessId },
      orderBy: { dayOfWeek: 'asc' },
    });
  }

  async updateBusinessHours(businessId: string, hours: OpeningHourInput[]) {
    // Delete existing and recreate
    await this.prisma.openingHour.deleteMany({
      where: { businessId },
    });

    return this.prisma.openingHour.createMany({
      data: hours.map((h) => ({
        ...h,
        businessId,
      })),
    });
  }
}
