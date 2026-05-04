import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { OrderLeadController } from './order-lead.controller';
import { OrderLeadService } from './order-lead.service';

@Module({
  imports: [DatabaseModule],
  controllers: [OrderLeadController],
  providers: [OrderLeadService],
})
export class OrderLeadsModule {}
