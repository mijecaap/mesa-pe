import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import {
  CreateMenuCategoryDto,
  UpdateMenuCategoryDto,
  ReorderCategoriesDto,
} from './menu-category.dto';
import { PlanLimitsService } from '../plan-limits.service';

@Injectable()
export class MenuCategoryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly planLimits: PlanLimitsService,
  ) {}

  async create(businessId: string, dto: CreateMenuCategoryDto) {
    await this.planLimits.checkCategoryLimit(businessId);

    const maxOrder = await this.prisma.menuCategory.findFirst({
      where: { businessId },
      orderBy: { sortOrder: 'desc' },
      select: { sortOrder: true },
    });

    return this.prisma.menuCategory.create({
      data: {
        ...dto,
        businessId,
        sortOrder: (maxOrder?.sortOrder ?? 0) + 1,
      },
    });
  }

  async findByBusiness(businessId: string) {
    return this.prisma.menuCategory.findMany({
      where: { businessId },
      orderBy: { sortOrder: 'asc' },
      include: { items: { orderBy: { sortOrder: 'asc' } } },
    });
  }

  async update(id: string, dto: UpdateMenuCategoryDto) {
    return this.prisma.menuCategory.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    return this.prisma.menuCategory.delete({
      where: { id },
    });
  }

  async reorder(businessId: string, dto: ReorderCategoriesDto) {
    const updates = dto.categories.map((cat) =>
      this.prisma.menuCategory.updateMany({
        where: { id: cat.id, businessId },
        data: { sortOrder: cat.sortOrder },
      }),
    );
    await this.prisma.$transaction(updates);
    return this.findByBusiness(businessId);
  }
}
