import { Module } from '@nestjs/common';
import { OpeningHoursService } from './opening-hours.service';
import { OpeningHoursController } from './opening-hours.controller';
import { DatabaseModule } from '../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [OpeningHoursController],
  providers: [OpeningHoursService],
})
export class OpeningHoursModule {}
