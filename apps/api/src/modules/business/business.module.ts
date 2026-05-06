import { Module } from '@nestjs/common';
import { BusinessService } from './business.service';
import { BusinessController } from './business.controller';
import { PublicBusinessController } from './public-business.controller';
import { DatabaseModule } from '../../database/database.module';
import { FeatureFlagsService } from '../feature-flags.service';
import { SubscriptionModule } from '../subscription/subscription.module';

@Module({
  imports: [DatabaseModule, SubscriptionModule],
  controllers: [BusinessController, PublicBusinessController],
  providers: [BusinessService, FeatureFlagsService],
  exports: [BusinessService],
})
export class BusinessModule {}
