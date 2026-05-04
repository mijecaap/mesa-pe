import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class PlanLimitsService {
  constructor(private readonly prisma: PrismaService) {}

  private limits = {
    FREE: { categories: 5, products: 10, modifiers: 2 },
    STARTER: { categories: 10, products: 50, modifiers: 5 },
    PRO: { categories: 999, products: 999, modifiers: 999 },
  };

  async checkCategoryLimit(businessId: string) {
    const business = await this.prisma.business.findUnique({
      where: { id: businessId },
      select: { plan: true },
    });
    if (!business) throw new NotFoundException('Negocio no encontrado');

    const count = await this.prisma.menuCategory.count({
      where: { businessId },
    });

    const limit =
      this.limits[business.plan as keyof typeof this.limits]?.categories ?? 5;
    if (count >= limit) {
      throw new ForbiddenException(
        `Límite de categorías alcanzado (${limit}). Actualiza tu plan.`,
      );
    }
  }

  async checkProductLimit(businessId: string) {
    const business = await this.prisma.business.findUnique({
      where: { id: businessId },
      select: { plan: true },
    });
    if (!business) throw new NotFoundException('Negocio no encontrado');

    const count = await this.prisma.menuItem.count({
      where: { businessId },
    });

    const limit =
      this.limits[business.plan as keyof typeof this.limits]?.products ?? 10;
    if (count >= limit) {
      throw new ForbiddenException(
        `Límite de productos alcanzado (${limit}). Actualiza tu plan.`,
      );
    }
  }

  async checkModifierLimit(businessId: string) {
    const business = await this.prisma.business.findUnique({
      where: { id: businessId },
      select: { plan: true },
    });
    if (!business) throw new NotFoundException('Negocio no encontrado');

    const count = await this.prisma.modifierGroup.count({
      where: {
        menuItem: { businessId },
      },
    });

    const limit =
      this.limits[business.plan as keyof typeof this.limits]?.modifiers ?? 2;
    if (count >= limit) {
      throw new ForbiddenException(
        `Límite de modificadores alcanzado (${limit}). Actualiza tu plan.`,
      );
    }
  }
}
