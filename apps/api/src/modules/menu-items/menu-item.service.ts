import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import {
  CreateMenuItemDto,
  UpdateMenuItemDto,
  ReorderItemsDto,
} from './menu-item.dto';
import { PlanLimitsService } from '../plan-limits.service';

@Injectable()
export class MenuItemService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly planLimits: PlanLimitsService,
  ) {}

  async create(businessId: string, dto: CreateMenuItemDto) {
    await this.planLimits.checkProductLimit(businessId);

    const maxOrder = await this.prisma.menuItem.findFirst({
      where: { businessId, categoryId: dto.categoryId },
      orderBy: { sortOrder: 'desc' },
      select: { sortOrder: true },
    });

    return this.prisma.menuItem.create({
      data: {
        ...dto,
        businessId,
        sortOrder: (maxOrder?.sortOrder ?? 0) + 1,
      },
    });
  }

  async findByBusiness(businessId: string) {
    return this.prisma.menuItem.findMany({
      where: { businessId },
      orderBy: { sortOrder: 'asc' },
      include: {
        category: true,
        modifiers: {
          orderBy: { sortOrder: 'asc' },
          include: {
            options: {
              orderBy: { sortOrder: 'asc' },
            },
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const item = await this.prisma.menuItem.findUnique({
      where: { id },
      include: {
        category: true,
        modifiers: {
          orderBy: { sortOrder: 'asc' },
          include: {
            options: {
              orderBy: { sortOrder: 'asc' },
            },
          },
        },
      },
    });
    if (!item) throw new NotFoundException('Producto no encontrado');
    return item;
  }

  async update(id: string, dto: UpdateMenuItemDto) {
    return this.prisma.menuItem.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    return this.prisma.menuItem.delete({
      where: { id },
    });
  }

  async duplicate(itemId: string) {
    const original = await this.prisma.menuItem.findUnique({
      where: { id: itemId },
      include: {
        modifiers: {
          include: {
            options: true,
          },
        },
      },
    });

    if (!original) throw new NotFoundException('Producto no encontrado');

    await this.planLimits.checkProductLimit(original.businessId);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, createdAt, updatedAt, modifiers, ...data } = original;

    return this.prisma.menuItem.create({
      data: {
        ...data,
        name: `${data.name} (copia)`,
        sortOrder: data.sortOrder + 1,
        modifiers: {
          create: modifiers.map((mod) => ({
            name: mod.name,
            isRequired: mod.isRequired,
            selectionType: mod.selectionType,
            minSelections: mod.minSelections,
            maxSelections: mod.maxSelections,
            sortOrder: mod.sortOrder,
            options: {
              create: mod.options.map((opt) => ({
                name: opt.name,
                priceDelta: opt.priceDelta,
                isAvailable: opt.isAvailable,
                sortOrder: opt.sortOrder,
              })),
            },
          })),
        },
      },
      include: {
        modifiers: {
          include: { options: true },
        },
      },
    });
  }

  async reorder(businessId: string, dto: ReorderItemsDto) {
    const updates = dto.items.map((item) =>
      this.prisma.menuItem.updateMany({
        where: { id: item.id, businessId },
        data: { sortOrder: item.sortOrder },
      }),
    );
    await this.prisma.$transaction(updates);
    return this.findByBusiness(businessId);
  }
}
