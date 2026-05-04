import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateOrderLeadDto } from './dto/create-order-lead.dto';

@Injectable()
export class OrderLeadService {
  constructor(private readonly prisma: PrismaService) {}

  async create(slug: string, dto: CreateOrderLeadDto) {
    const business = await this.prisma.business.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!business) {
      throw new NotFoundException('Negocio no encontrado');
    }

    return this.prisma.orderLead.create({
      data: {
        businessId: business.id,
        customerName: dto.customerName,
        customerPhone: dto.customerPhone ?? null,
        fulfillmentType: dto.fulfillmentType,
        tableNumber: dto.tableNumber ?? null,
        address: dto.address ?? null,
        deliveryZoneId: dto.deliveryZoneId ?? null,
        itemsSummary: dto.itemsSummary as unknown as Parameters<
          typeof this.prisma.orderLead.create
        >[0]['data']['itemsSummary'],
        subtotal: dto.subtotal,
        deliveryFee: dto.deliveryFee ?? null,
        total: dto.total,
        preferredPaymentMethod: dto.preferredPaymentMethod ?? null,
        note: dto.note ?? null,
        whatsappMessage: dto.whatsappMessage,
        status: 'STARTED',
      },
    });
  }

  async findByBusiness(
    businessId: string,
    filters: { status?: string; limit: number; offset: number },
  ) {
    const where = {
      businessId,
      ...(filters.status ? { status: filters.status } : {}),
    };

    const [items, total] = await Promise.all([
      this.prisma.orderLead.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: filters.limit,
        skip: filters.offset,
      }),
      this.prisma.orderLead.count({ where }),
    ]);

    return { items, total };
  }
}
