import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { OrderLeadService } from './order-lead.service';
import { CreateOrderLeadDto } from './dto/create-order-lead.dto';
import { ClerkAuthGuard } from '../../auth/guards/clerk-auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';

@ApiTags('Order Leads')
@Controller('businesses')
export class OrderLeadController {
  constructor(private readonly orderLeadService: OrderLeadService) {}

  @Post('public/:slug/order-leads')
  create(@Param('slug') slug: string, @Body() dto: CreateOrderLeadDto) {
    return this.orderLeadService.create(slug, dto);
  }

  @Get(':id/order-leads')
  @ApiBearerAuth()
  @UseGuards(ClerkAuthGuard, TenantGuard)
  findByBusiness(
    @Param('id') businessId: string,
    @Query('status') status?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    return this.orderLeadService.findByBusiness(businessId, {
      status,
      limit: limit ? parseInt(limit, 10) : 50,
      offset: offset ? parseInt(offset, 10) : 0,
    });
  }
}
