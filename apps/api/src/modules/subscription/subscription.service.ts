import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import {
  CreateSubscriptionDto,
  UpdateSubscriptionDto,
} from './subscription.dto';

@Injectable()
export class SubscriptionService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    businessId: string,
    dto: CreateSubscriptionDto,
    adminClerkId?: string,
  ) {
    const business = await this.prisma.business.findUnique({
      where: { id: businessId },
    });
    if (!business) {
      throw new NotFoundException('Negocio no encontrado');
    }

    // Cancelar cualquier suscripción activa previa
    await this.prisma.subscription.updateMany({
      where: { businessId, status: 'ACTIVE' },
      data: { status: 'CANCELLED' },
    });

    const subscription = await this.prisma.subscription.create({
      data: {
        businessId,
        plan: dto.plan,
        endsAt: dto.endsAt,
        notes: dto.notes,
        isTrial: dto.isTrial ?? false,
        createdBy: adminClerkId,
      },
    });

    // Sincronizar plan en Business
    await this.prisma.business.update({
      where: { id: businessId },
      data: { plan: dto.plan },
    });

    return subscription;
  }

  async getActiveSubscription(businessId: string) {
    return this.prisma.subscription.findFirst({
      where: { businessId, status: 'ACTIVE' },
      orderBy: { createdAt: 'desc' },
    });
  }

  async checkAndExpire(businessId: string) {
    const activeSub = await this.getActiveSubscription(businessId);
    if (!activeSub) return null;

    if (activeSub.endsAt < new Date()) {
      await this.prisma.subscription.update({
        where: { id: activeSub.id },
        data: { status: 'EXPIRED' },
      });

      await this.prisma.business.update({
        where: { id: businessId },
        data: { plan: 'FREE' },
      });

      return null;
    }

    return activeSub;
  }

  async getDaysRemaining(businessId: string) {
    const activeSub = await this.checkAndExpire(businessId);
    if (!activeSub) return null;

    const diffMs = activeSub.endsAt.getTime() - Date.now();
    const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    return Math.max(0, days);
  }

  async findByBusiness(businessId: string) {
    return this.prisma.subscription.findMany({
      where: { businessId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(
    businessId: string,
    id: string,
    dto: UpdateSubscriptionDto,
    adminClerkId?: string,
  ) {
    const subscription = await this.prisma.subscription.findFirst({
      where: { id, businessId },
    });
    if (!subscription) {
      throw new NotFoundException('Suscripción no encontrada');
    }

    const updated = await this.prisma.subscription.update({
      where: { id },
      data: {
        ...dto,
        createdBy: adminClerkId ?? subscription.createdBy,
      },
    });

    if (dto.plan && subscription.status === 'ACTIVE') {
      await this.prisma.business.update({
        where: { id: businessId },
        data: { plan: dto.plan },
      });
    }

    return updated;
  }
}
