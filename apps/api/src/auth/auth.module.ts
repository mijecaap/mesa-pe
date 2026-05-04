import { Module } from '@nestjs/common';
import { ClerkAuthGuard } from './guards/clerk-auth.guard';
import { TenantGuard } from '../common/guards/tenant.guard';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [ClerkAuthGuard, TenantGuard],
  exports: [ClerkAuthGuard, TenantGuard],
})
export class AuthModule {}
