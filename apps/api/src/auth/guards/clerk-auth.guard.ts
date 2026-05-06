import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { verifyToken } from '@clerk/backend';

interface AuthRequest extends Request {
  user?: {
    userId: string;
    orgId?: string;
    orgRole?: string;
    role?: string;
  };
}

@Injectable()
export class ClerkAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthRequest>();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException(
        'Missing or invalid authorization header',
      );
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Missing token');
    }

    try {
      const claims = await verifyToken(token, {
        secretKey: process.env.CLERK_SECRET_KEY,
      });
      console.log('[CLERK AUTH] Token verified. Claims:', JSON.stringify(claims));
      request.user = {
        userId: claims.sub,
        orgId: claims.org_id,
        orgRole: claims.org_role,
        role: (claims as any).role,
      };
      return true;
    } catch (err: any) {
      console.error('[CLERK AUTH] verifyToken failed:', err?.message || err);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
