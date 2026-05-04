import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import {
  CreateDeliveryZoneDto,
  UpdateDeliveryZoneDto,
} from './delivery-zone.dto';

@Injectable()
export class DeliveryZoneService {
  constructor(private readonly prisma: PrismaService) {}

  async create(businessId: string, dto: CreateDeliveryZoneDto) {
    return this.prisma.deliveryZone.create({
      data: { ...dto, businessId },
    });
  }

  async findByBusiness(businessId: string) {
    return this.prisma.deliveryZone.findMany({
      where: { businessId },
      orderBy: { id: 'asc' },
    });
  }

  async update(id: string, dto: UpdateDeliveryZoneDto) {
    return this.prisma.deliveryZone.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    return this.prisma.deliveryZone.delete({
      where: { id },
    });
  }
}
