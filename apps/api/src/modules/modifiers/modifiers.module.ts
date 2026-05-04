import { Module } from '@nestjs/common';
import { ModifierService } from './modifier.service';
import { ModifierController } from './modifier.controller';
import { DatabaseModule } from '../../database/database.module';
import { PlanLimitsService } from '../plan-limits.service';

@Module({
  imports: [DatabaseModule],
  controllers: [ModifierController],
  providers: [ModifierService, PlanLimitsService],
})
export class ModifiersModule {}
