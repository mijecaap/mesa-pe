import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

interface AuthRequest extends Request {
  user?: {
    userId: string;
    orgId?: string;
    orgRole?: string;
  };
}

export const CurrentOrg = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<AuthRequest>();
    return request.user?.orgId;
  },
);
