import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from '../../database/prisma.service';

interface AuthRequest extends Request {
  user?: {
    userId: string;
    orgId?: string;
    orgRole?: string;
  };
}

@Injectable()
export class TenantGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthRequest>();
    const orgId = request.user?.orgId;

    const businessId =
      (request.params as Record<string, string | undefined>).businessId ||
      (request.params as Record<string, string | undefined>).id ||
      (request.body as Record<string, string | undefined>).businessId ||
      (request.query as Record<string, string | undefined>).businessId;

    if (!businessId || typeof businessId !== 'string') {
      // If no businessId in params/body/query, allow (e.g., create business)
      return true;
    }

    const business = await this.prisma.business.findUnique({
      where: { id: businessId },
      select: { organizationId: true, ownerId: true },
    });

    if (!business) {
      throw new ForbiddenException('Business not found');
    }

    // If business has an organization, check org match
    if (business.organizationId) {
      if (!orgId || business.organizationId !== orgId) {
        throw new ForbiddenException('Access denied for this business');
      }
      return true;
    }

    // Fallback: if no org, check owner (legacy or personal businesses)
    const user = await this.prisma.user.findUnique({
      where: { clerkId: request.user!.userId },
      select: { id: true },
    });

    if (business.ownerId !== user?.id) {
      throw new ForbiddenException('Access denied for this business');
    }

    return true;
  }
}
