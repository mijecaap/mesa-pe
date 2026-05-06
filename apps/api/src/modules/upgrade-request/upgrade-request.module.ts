import { Module } from '@nestjs/common';
import { UpgradeRequestController } from './upgrade-request.controller';
import { UpgradeRequestService } from './upgrade-request.service';
import { DatabaseModule } from '../../database/database.module';
import { SubscriptionModule } from '../subscription/subscription.module';

@Module({
  imports: [DatabaseModule, SubscriptionModule],
  controllers: [UpgradeRequestController],
  providers: [UpgradeRequestService],
  exports: [UpgradeRequestService],
})
export class UpgradeRequestModule {}
