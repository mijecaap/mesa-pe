import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ClerkAuthGuard } from '../../auth/guards/clerk-auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { SubscriptionService } from './subscription.service';
import {
  CreateSubscriptionDto,
  UpdateSubscriptionDto,
} from './subscription.dto';

@ApiTags('Subscriptions')
@ApiBearerAuth()
@UseGuards(ClerkAuthGuard, TenantGuard)
@Controller('businesses/:businessId/subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post()
  create(
    @Param('businessId') businessId: string,
    @Body() dto: CreateSubscriptionDto,
  ) {
    return this.subscriptionService.create(businessId, dto);
  }

  @Get()
  findActive(@Param('businessId') businessId: string) {
    return this.subscriptionService.getActiveSubscription(businessId);
  }

  @Get('days-remaining')
  async getDaysRemaining(@Param('businessId') businessId: string) {
    const days = await this.subscriptionService.getDaysRemaining(businessId);
    return { days };
  }

  @Get('history')
  findByBusiness(@Param('businessId') businessId: string) {
    return this.subscriptionService.findByBusiness(businessId);
  }

  @Patch(':id')
  update(
    @Param('businessId') businessId: string,
    @Param('id') id: string,
    @Body() dto: UpdateSubscriptionDto,
  ) {
    return this.subscriptionService.update(businessId, id, dto);
  }
}
