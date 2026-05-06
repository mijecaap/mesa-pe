import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import {
  CreateUpgradeRequestDto,
  ApproveUpgradeRequestDto,
  RejectUpgradeRequestDto,
} from './upgrade-request.dto';
import { SubscriptionService } from '../subscription/subscription.service';

@Injectable()
export class UpgradeRequestService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly subscriptionService: SubscriptionService,
  ) {}

  async create(businessId: string, dto: CreateUpgradeRequestDto) {
    const business = await this.prisma.business.findUnique({
      where: { id: businessId },
    });
    if (!business) {
      throw new NotFoundException('Negocio no encontrado');
    }

    return this.prisma.upgradeRequest.create({
      data: {
        businessId,
        requestedPlan: dto.requestedPlan,
        paymentMethod: dto.paymentMethod,
        receiptUrl: dto.receiptUrl,
      },
    });
  }

  async findByBusiness(businessId: string) {
    return this.prisma.upgradeRequest.findMany({
      where: { businessId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findPending() {
    return this.prisma.upgradeRequest.findMany({
      where: { status: 'PENDING' },
      include: { business: { select: { id: true, name: true, slug: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAll() {
    return this.prisma.upgradeRequest.findMany({
      include: { business: { select: { id: true, name: true, slug: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async approve(
    id: string,
    dto: ApproveUpgradeRequestDto,
    adminClerkId?: string,
  ) {
    const request = await this.prisma.upgradeRequest.findUnique({
      where: { id },
    });
    if (!request) {
      throw new NotFoundException('Solicitud no encontrada');
    }

    if (request.status !== 'PENDING') {
      throw new NotFoundException('La solicitud ya fue procesada');
    }

    // Crear suscripción por 30 días por defecto
    const endsAt = new Date();
    endsAt.setDate(endsAt.getDate() + 30);

    await this.subscriptionService.create(
      request.businessId,
      { plan: request.requestedPlan, endsAt, notes: dto.notes },
      adminClerkId,
    );

    return this.prisma.upgradeRequest.update({
      where: { id },
      data: { status: 'APPROVED', notes: dto.notes },
    });
  }

  async reject(id: string, dto: RejectUpgradeRequestDto) {
    const request = await this.prisma.upgradeRequest.findUnique({
      where: { id },
    });
    if (!request) {
      throw new NotFoundException('Solicitud no encontrada');
    }

    if (request.status !== 'PENDING') {
      throw new NotFoundException('La solicitud ya fue procesada');
    }

    return this.prisma.upgradeRequest.update({
      where: { id },
      data: { status: 'REJECTED', notes: dto.notes },
    });
  }
}
