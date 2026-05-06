import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ClerkAuthGuard } from '../../auth/guards/clerk-auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { UpgradeRequestService } from './upgrade-request.service';
import { CreateUpgradeRequestDto } from './upgrade-request.dto';

@ApiTags('Upgrade Requests')
@ApiBearerAuth()
@UseGuards(ClerkAuthGuard, TenantGuard)
@Controller('businesses/:businessId/upgrade-requests')
export class UpgradeRequestController {
  constructor(private readonly upgradeRequestService: UpgradeRequestService) {}

  @Post()
  create(
    @Param('businessId') businessId: string,
    @Body() dto: CreateUpgradeRequestDto,
  ) {
    return this.upgradeRequestService.create(businessId, dto);
  }

  @Get()
  findByBusiness(@Param('businessId') businessId: string) {
    return this.upgradeRequestService.findByBusiness(businessId);
  }
}
