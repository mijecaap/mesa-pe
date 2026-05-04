import { Module } from '@nestjs/common';
import { MenuCategoryService } from './menu-category.service';
import { MenuCategoryController } from './menu-category.controller';
import { DatabaseModule } from '../../database/database.module';
import { PlanLimitsService } from '../plan-limits.service';

@Module({
  imports: [DatabaseModule],
  controllers: [MenuCategoryController],
  providers: [MenuCategoryService, PlanLimitsService],
})
export class MenuCategoriesModule {}
