import { Controller, Get, Put, Body, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ClerkAuthGuard } from '../../auth/guards/clerk-auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { OpeningHoursService } from './opening-hours.service';
import type { UpdateOpeningHoursInput } from '@mesa/shared-types';

@ApiTags('Opening Hours')
@ApiBearerAuth()
@UseGuards(ClerkAuthGuard, TenantGuard)
@Controller('businesses/:businessId/opening-hours')
export class OpeningHoursController {
  constructor(private readonly openingHoursService: OpeningHoursService) {}

  @Get()
  findByBusiness(@Param('businessId') businessId: string) {
    return this.openingHoursService.findByBusiness(businessId);
  }

  @Put()
  update(
    @Param('businessId') businessId: string,
    @Body() dto: UpdateOpeningHoursInput,
  ) {
    return this.openingHoursService.updateBusinessHours(businessId, dto.hours);
  }
}
