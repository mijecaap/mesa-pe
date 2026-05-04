import { Module } from '@nestjs/common';
import { DeliveryZoneService } from './delivery-zone.service';
import { DeliveryZoneController } from './delivery-zone.controller';
import { DatabaseModule } from '../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [DeliveryZoneController],
  providers: [DeliveryZoneService],
})
export class DeliveryZonesModule {}
