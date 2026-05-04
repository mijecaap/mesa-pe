import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import {
  CreateModifierGroupDto,
  UpdateModifierGroupDto,
  CreateModifierOptionDto,
  UpdateModifierOptionDto,
} from './modifier.dto';
import { PlanLimitsService } from '../plan-limits.service';

@Injectable()
export class ModifierService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly planLimits: PlanLimitsService,
  ) {}

  // Modifier Groups
  async createGroup(menuItemId: string, dto: CreateModifierGroupDto) {
    const menuItem = await this.prisma.menuItem.findUnique({
      where: { id: menuItemId },
      select: { businessId: true },
    });
    if (!menuItem) throw new Error('Producto no encontrado');

    await this.planLimits.checkModifierLimit(menuItem.businessId);

    const maxOrder = await this.prisma.modifierGroup.findFirst({
      where: { menuItemId },
      orderBy: { sortOrder: 'desc' },
      select: { sortOrder: true },
    });

    return this.prisma.modifierGroup.create({
      data: {
        ...dto,
        menuItemId,
        sortOrder: (maxOrder?.sortOrder ?? 0) + 1,
      },
      include: { options: true },
    });
  }

  async updateGroup(id: string, dto: UpdateModifierGroupDto) {
    return this.prisma.modifierGroup.update({
      where: { id },
      data: dto,
      include: { options: true },
    });
  }

  async removeGroup(id: string) {
    return this.prisma.modifierGroup.delete({
      where: { id },
    });
  }

  // Modifier Options
  async createOption(modifierGroupId: string, dto: CreateModifierOptionDto) {
    const maxOrder = await this.prisma.modifierOption.findFirst({
      where: { modifierGroupId },
      orderBy: { sortOrder: 'desc' },
      select: { sortOrder: true },
    });

    return this.prisma.modifierOption.create({
      data: {
        ...dto,
        modifierGroupId,
        sortOrder: (maxOrder?.sortOrder ?? 0) + 1,
      },
    });
  }

  async updateOption(id: string, dto: UpdateModifierOptionDto) {
    return this.prisma.modifierOption.update({
      where: { id },
      data: dto,
    });
  }

  async removeOption(id: string) {
    return this.prisma.modifierOption.delete({
      where: { id },
    });
  }
}
