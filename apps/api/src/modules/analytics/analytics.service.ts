import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { TrackEventDto } from './dto/track-event.dto';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async trackEvent(
    dto: TrackEventDto & {
      userAgent?: string;
      referrer?: string;
      ipAddress?: string;
    },
  ) {
    return this.prisma.analyticsEvent.create({
      data: {
        businessId: dto.businessId,
        eventName: dto.eventName,
        entityType: dto.entityType ?? null,
        entityId: dto.entityId ?? null,
        metadata: (dto.metadata ?? undefined) as Parameters<
          typeof this.prisma.analyticsEvent.create
        >[0]['data']['metadata'],
        sessionId: dto.sessionId ?? null,
        userAgent: dto.userAgent ?? null,
        referrer: dto.referrer ?? null,
        ipAddress: dto.ipAddress ?? null,
      },
    });
  }

  private getLimaNow(): Date {
    return new Date(
      new Date().toLocaleString('en-US', { timeZone: 'America/Lima' }),
    );
  }

  private getLimaStartOfDay(offsetDays = 0): Date {
    const now = this.getLimaNow();
    now.setDate(now.getDate() + offsetDays);
    now.setHours(0, 0, 0, 0);
    return now;
  }

  async getSummary(businessId: string) {
    const todayStart = this.getLimaStartOfDay(0);
    const todayEnd = this.getLimaStartOfDay(1);
    const sevenDaysStart = this.getLimaStartOfDay(-7);
    const thirtyDaysStart = this.getLimaStartOfDay(-30);

    const [
      visitsToday,
      visitsLast7Days,
      visitsLast30Days,
      whatsappClicks,
      ordersStarted,
    ] = await Promise.all([
      this.prisma.analyticsEvent.count({
        where: {
          businessId,
          eventName: 'page_view',
          createdAt: { gte: todayStart, lt: todayEnd },
        },
      }),
      this.prisma.analyticsEvent.count({
        where: {
          businessId,
          eventName: 'page_view',
          createdAt: { gte: sevenDaysStart },
        },
      }),
      this.prisma.analyticsEvent.count({
        where: {
          businessId,
          eventName: 'page_view',
          createdAt: { gte: thirtyDaysStart },
        },
      }),
      this.prisma.analyticsEvent.count({
        where: {
          businessId,
          eventName: 'whatsapp_click',
          createdAt: { gte: thirtyDaysStart },
        },
      }),
      this.prisma.orderLead.count({
        where: {
          businessId,
          createdAt: { gte: thirtyDaysStart },
        },
      }),
    ]);

    return {
      visitsToday,
      visitsLast7Days,
      visitsLast30Days,
      whatsappClicks,
      ordersStarted,
    };
  }

  async getTopProducts(businessId: string, type: 'view' | 'cart' = 'view') {
    const eventName = type === 'view' ? 'product_view' : 'add_to_cart';
    const thirtyDaysStart = this.getLimaStartOfDay(-30);

    const raw = await this.prisma.analyticsEvent.groupBy({
      by: ['entityId'],
      where: {
        businessId,
        eventName,
        createdAt: { gte: thirtyDaysStart },
        entityType: 'product',
        entityId: { not: null },
      },
      _count: { entityId: true },
      orderBy: { _count: { entityId: 'desc' } },
      take: 10,
    });

    const productIds = raw.map((r) => r.entityId!).filter(Boolean);

    const products = await this.prisma.menuItem.findMany({
      where: { id: { in: productIds } },
      select: { id: true, name: true },
    });

    const nameMap = new Map(products.map((p) => [p.id, p.name]));

    return raw.map((r) => ({
      id: r.entityId!,
      name: nameMap.get(r.entityId!) || 'Producto desconocido',
      count: r._count.entityId,
    }));
  }

  async getHourlyVisits(businessId: string) {
    const thirtyDaysStart = this.getLimaStartOfDay(-30);

    const events = await this.prisma.analyticsEvent.findMany({
      where: {
        businessId,
        eventName: 'page_view',
        createdAt: { gte: thirtyDaysStart },
      },
      select: { createdAt: true },
    });

    const map = new Map<string, number>();
    for (const e of events) {
      const d = new Date(e.createdAt);
      const key = `${d.getDay()}-${d.getHours()}`;
      map.set(key, (map.get(key) || 0) + 1);
    }

    const result: { hour: number; dayOfWeek: number; count: number }[] = [];
    for (let d = 0; d <= 6; d++) {
      for (let h = 0; h <= 23; h++) {
        const key = `${d}-${h}`;
        result.push({ dayOfWeek: d, hour: h, count: map.get(key) || 0 });
      }
    }

    return result;
  }

  async getDailyVisits(businessId: string) {
    const thirtyDaysStart = this.getLimaStartOfDay(-30);

    const events = await this.prisma.analyticsEvent.findMany({
      where: {
        businessId,
        eventName: 'page_view',
        createdAt: { gte: thirtyDaysStart },
      },
      select: { createdAt: true },
    });

    const map = new Map<string, number>();
    for (const e of events) {
      const d = new Date(e.createdAt);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      map.set(key, (map.get(key) || 0) + 1);
    }

    const result: { date: string; count: number }[] = [];
    for (let i = 0; i < 30; i++) {
      const d = this.getLimaStartOfDay(-29 + i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      result.push({ date: key, count: map.get(key) || 0 });
    }

    return result;
  }
}
