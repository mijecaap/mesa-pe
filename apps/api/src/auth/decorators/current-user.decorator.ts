import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export interface CurrentUserPayload {
  userId: string;
  orgId?: string;
  orgRole?: string;
}

interface AuthRequest extends Request {
  user?: CurrentUserPayload;
}

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): CurrentUserPayload => {
    const request = ctx.switchToHttp().getRequest<AuthRequest>();
    const user = request.user;
    if (!user) {
      throw new Error('User not found in request. Is ClerkAuthGuard applied?');
    }
    return user;
  },
);
