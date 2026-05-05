import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

const PLAN_CONFIG = {
  FREE: {
    productsLimit: 10,
    categoriesLimit: 5,
    modifiersLimit: 2,
    promotionsLimit: 1,
    watermark: true,
    advancedAnalytics: false,
  },
  STARTER: {
    productsLimit: 50,
    categoriesLimit: 10,
    modifiersLimit: 5,
    promotionsLimit: 3,
    watermark: false,
    advancedAnalytics: false,
  },
  PRO: {
    productsLimit: 999,
    categoriesLimit: 999,
    modifiersLimit: 999,
    promotionsLimit: 999,
    watermark: false,
    advancedAnalytics: true,
  },
};

@Injectable()
export class FeatureFlagsService {
  constructor(private readonly prisma: PrismaService) {}

  async getFlags(businessId: string) {
    const business = await this.prisma.business.findUnique({
      where: { id: businessId },
      select: { plan: true },
    });
    if (!business) throw new NotFoundException('Negocio no encontrado');

    const config =
      PLAN_CONFIG[business.plan as keyof typeof PLAN_CONFIG] ??
      PLAN_CONFIG.FREE;

    const [productCount, categoryCount, modifierCount, promotionCount] =
      await Promise.all([
        this.prisma.menuItem.count({ where: { businessId } }),
        this.prisma.menuCategory.count({ where: { businessId } }),
        this.prisma.modifierGroup.count({
          where: {
            menuItem: { businessId },
          },
        }),
        this.prisma.promotion.count({ where: { businessId } }),
      ]);

    return {
      canCreateProduct: productCount < config.productsLimit,
      canCreateCategory: categoryCount < config.categoriesLimit,
      canCreateModifier: modifierCount < config.modifiersLimit,
      canCreatePromotion: promotionCount < config.promotionsLimit,
      showWatermark: config.watermark,
      showAdvancedAnalytics: config.advancedAnalytics,
      productsRemaining: Math.max(0, config.productsLimit - productCount),
      categoriesRemaining: Math.max(0, config.categoriesLimit - categoryCount),
      modifiersRemaining: Math.max(0, config.modifiersLimit - modifierCount),
      promotionsRemaining: Math.max(0, config.promotionsLimit - promotionCount),
    };
  }

  async getPlanConfig(businessId: string) {
    const business = await this.prisma.business.findUnique({
      where: { id: businessId },
      select: { plan: true },
    });
    if (!business) throw new NotFoundException('Negocio no encontrado');

    const config =
      PLAN_CONFIG[business.plan as keyof typeof PLAN_CONFIG] ??
      PLAN_CONFIG.FREE;

    return {
      plan: business.plan,
      ...config,
    };
  }
}
