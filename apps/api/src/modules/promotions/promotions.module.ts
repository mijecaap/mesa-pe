import { Module } from '@nestjs/common';
import { PromotionsController } from './promotions.controller';
import { PromotionsService } from './promotions.service';
import { DatabaseModule } from '../../database/database.module';
import { PlanLimitsService } from '../plan-limits.service';

@Module({
  imports: [DatabaseModule],
  controllers: [PromotionsController],
  providers: [PromotionsService, PlanLimitsService],
})
export class PromotionsModule {}
