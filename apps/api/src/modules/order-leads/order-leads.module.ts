import { Module } from '@nestjs/common';
import { OrderLeadController } from './order-lead.controller';
import { OrderLeadService } from './order-lead.service';

@Module({
  controllers: [OrderLeadController],
  providers: [OrderLeadService],
})
export class OrderLeadsModule {}
