import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { PlanLimitsService } from '../plan-limits.service';
import { CreatePromotionDto, UpdatePromotionDto } from './promotions.dto';

@Injectable()
export class PromotionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly planLimits: PlanLimitsService,
  ) {}

  async create(businessId: string, dto: CreatePromotionDto) {
    await this.planLimits.checkPromotionLimit(businessId);
    return this.prisma.promotion.create({
      data: { ...dto, businessId },
    });
  }

  async findByBusiness(businessId: string) {
    return this.prisma.promotion.findMany({
      where: { businessId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(businessId: string, id: string, dto: UpdatePromotionDto) {
    const promotion = await this.prisma.promotion.findFirst({
      where: { id, businessId },
    });
    if (!promotion) {
      throw new NotFoundException('Promoción no encontrada');
    }
    return this.prisma.promotion.update({
      where: { id },
      data: dto,
    });
  }

  async remove(businessId: string, id: string) {
    const promotion = await this.prisma.promotion.findFirst({
      where: { id, businessId },
    });
    if (!promotion) {
      throw new NotFoundException('Promoción no encontrada');
    }
    return this.prisma.promotion.delete({
      where: { id },
    });
  }
}
