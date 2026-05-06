import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { DatabaseModule } from '../../database/database.module';
import { SubscriptionModule } from '../subscription/subscription.module';
import { UpgradeRequestModule } from '../upgrade-request/upgrade-request.module';

@Module({
  imports: [DatabaseModule, SubscriptionModule, UpgradeRequestModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
