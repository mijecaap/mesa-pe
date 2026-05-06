import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Request } from 'express';

interface AuthRequest extends Request {
  user?: {
    userId: string;
    orgId?: string;
    orgRole?: string;
    role?: string;
  };
}

@Injectable()
export class SuperAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthRequest>();
    const userId = request.user?.userId;
    const role = request.user?.role;

    if (!userId || role !== 'admin') {
      throw new ForbiddenException('Acceso restringido a administradores');
    }

    return true;
  }
}
