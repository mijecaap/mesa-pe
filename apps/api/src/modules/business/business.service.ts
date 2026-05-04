import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import {
  CreateBusinessDto,
  UpdateBusinessDto,
} from './dto/create-business.dto';
import { FeatureFlagsService } from '../feature-flags.service';

function getLimaTime(): Date {
  return new Date(
    new Date().toLocaleString('en-US', { timeZone: 'America/Lima' }),
  );
}

function formatTime(date: Date): string {
  const h = String(date.getHours()).padStart(2, '0');
  const m = String(date.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}

function computeIsOpenNow(
  manualStatus: string,
  openingHours: {
    dayOfWeek: number;
    openTime: string;
    closeTime: string;
    isClosed: boolean;
  }[],
): boolean {
  if (manualStatus === 'OPEN') return true;
  if (manualStatus === 'CLOSED') return false;

  const now = getLimaTime();
  const dayOfWeek = now.getDay();
  const currentTime = formatTime(now);

  const todayHours = openingHours.find((h) => h.dayOfWeek === dayOfWeek);
  if (!todayHours || todayHours.isClosed) return false;

  return (
    currentTime >= todayHours.openTime && currentTime <= todayHours.closeTime
  );
}

@Injectable()
export class BusinessService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly featureFlags: FeatureFlagsService,
  ) {}

  async create(
    userId: string,
    orgId: string | undefined,
    dto: CreateBusinessDto,
  ) {
    const existing = await this.prisma.business.findUnique({
      where: { slug: dto.slug },
    });
    if (existing) {
      throw new ConflictException('El slug ya está en uso');
    }

    const user = await this.prisma.user.findUnique({
      where: { clerkId: userId },
    });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return this.prisma.business.create({
      data: {
        ...dto,
        ownerId: user.id,
        organizationId: orgId || null,
      },
    });
  }

  async findOne(id: string) {
    const business = await this.prisma.business.findUnique({
      where: { id },
      include: {
        openingHours: true,
        categories: {
          orderBy: { sortOrder: 'asc' },
        },
        items: {
          orderBy: { sortOrder: 'asc' },
        },
        paymentMethods: true,
        zones: true,
      },
    });
    if (!business) {
      throw new NotFoundException('Negocio no encontrado');
    }
    return business;
  }

  async findBySlug(slug: string) {
    const business = await this.prisma.business.findUnique({
      where: { slug },
      include: {
        openingHours: true,
        categories: {
          where: { isVisible: true },
          orderBy: { sortOrder: 'asc' },
          include: {
            items: {
              where: { isVisible: true },
              orderBy: { sortOrder: 'asc' },
              include: {
                modifiers: {
                  orderBy: { sortOrder: 'asc' },
                  include: {
                    options: {
                      orderBy: { sortOrder: 'asc' },
                    },
                  },
                },
              },
            },
          },
        },
        paymentMethods: {
          where: { isActive: true },
        },
        zones: {
          where: { isActive: true },
        },
      },
    });
    if (!business) {
      throw new NotFoundException('Negocio no encontrado');
    }
    return business;
  }

  async findPublicBySlug(slug: string) {
    const business = await this.prisma.business.findUnique({
      where: { slug },
      include: {
        openingHours: true,
        categories: {
          where: { isVisible: true },
          orderBy: { sortOrder: 'asc' },
          include: {
            items: {
              where: { isVisible: true },
              orderBy: { sortOrder: 'asc' },
              include: {
                modifiers: {
                  orderBy: { sortOrder: 'asc' },
                  include: {
                    options: {
                      orderBy: { sortOrder: 'asc' },
                    },
                  },
                },
              },
            },
          },
        },
        paymentMethods: {
          where: { isActive: true },
        },
        zones: {
          where: { isActive: true },
        },
        promotions: {
          where: {
            isActive: true,
            OR: [
              { startDate: { lte: new Date() }, endDate: { gte: new Date() } },
              { startDate: null, endDate: null },
              { startDate: { lte: new Date() }, endDate: null },
              { startDate: null, endDate: { gte: new Date() } },
            ],
          },
        },
      },
    });

    if (!business) {
      throw new NotFoundException('Negocio no encontrado');
    }

    if (!business.isPublished) {
      throw new NotFoundException('Negocio no encontrado');
    }

    const isOpenNow = computeIsOpenNow(
      business.manualStatus,
      business.openingHours,
    );

    return {
      ...business,
      isOpenNow,
    };
  }

  async update(id: string, dto: UpdateBusinessDto) {
    return this.prisma.business.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    return this.prisma.business.delete({
      where: { id },
    });
  }

  async findByOrganization(orgId: string) {
    return this.prisma.business.findMany({
      where: { organizationId: orgId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findPublicSlugs() {
    return this.prisma.business.findMany({
      where: { isPublished: true },
      select: { slug: true, updatedAt: true },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async getFeatureFlags(id: string) {
    return this.featureFlags.getFlags(id);
  }
}
