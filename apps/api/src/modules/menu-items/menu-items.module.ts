import { Module } from '@nestjs/common';
import { MenuItemService } from './menu-item.service';
import { MenuItemController } from './menu-item.controller';
import { DatabaseModule } from '../../database/database.module';
import { PlanLimitsService } from '../plan-limits.service';

@Module({
  imports: [DatabaseModule],
  controllers: [MenuItemController],
  providers: [MenuItemService, PlanLimitsService],
})
export class MenuItemsModule {}
