import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async findBusinesses(query?: string, plan?: string, page = 1, limit = 20) {
    const where: Record<string, unknown> = {};

    if (query) {
      where.OR = [
        { name: { contains: query, mode: 'insensitive' } },
        { slug: { contains: query, mode: 'insensitive' } },
      ];
    }

    if (plan) {
      where.plan = plan;
    }

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.business.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          subscriptions: {
            where: { status: 'ACTIVE' },
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
          owner: { select: { id: true, name: true, email: true } },
          organization: { select: { id: true, name: true } },
        },
      }),
      this.prisma.business.count({ where }),
    ]);

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findBusinessById(id: string) {
    const business = await this.prisma.business.findUnique({
      where: { id },
      include: {
        subscriptions: {
          orderBy: { createdAt: 'desc' },
        },
        upgradeRequests: {
          orderBy: { createdAt: 'desc' },
        },
        owner: { select: { id: true, name: true, email: true } },
      },
    });

    if (!business) {
      throw new NotFoundException('Negocio no encontrado');
    }

    return business;
  }
}
