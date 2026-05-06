import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ClerkAuthGuard } from '../../auth/guards/clerk-auth.guard';
import { SuperAdminGuard } from '../../common/guards/super-admin.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AdminService } from './admin.service';
import { SubscriptionService } from '../subscription/subscription.service';
import { UpgradeRequestService } from '../upgrade-request/upgrade-request.service';
import { CreateSubscriptionDto } from '../subscription/subscription.dto';
import {
  ApproveUpgradeRequestDto,
  RejectUpgradeRequestDto,
} from '../upgrade-request/upgrade-request.dto';

@ApiTags('Admin')
@ApiBearerAuth()
@UseGuards(ClerkAuthGuard, SuperAdminGuard)
@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly subscriptionService: SubscriptionService,
    private readonly upgradeRequestService: UpgradeRequestService,
  ) {}

  @Get('me')
  me() {
    return { isAdmin: true };
  }

  @Get('businesses')
  findBusinesses(
    @Query('q') query?: string,
    @Query('plan') plan?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.adminService.findBusinesses(
      query,
      plan,
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20,
    );
  }

  @Get('businesses/:id')
  findBusinessById(@Param('id') id: string) {
    return this.adminService.findBusinessById(id);
  }

  @Post('businesses/:id/subscription')
  createSubscription(
    @Param('id') id: string,
    @Body() dto: CreateSubscriptionDto,
    @CurrentUser() user: { userId: string },
  ) {
    return this.subscriptionService.create(id, dto, user.userId);
  }

  @Get('upgrade-requests')
  findPendingUpgradeRequests() {
    return this.upgradeRequestService.findPending();
  }

  @Post('upgrade-requests/:id/approve')
  approveUpgradeRequest(
    @Param('id') id: string,
    @Body() dto: ApproveUpgradeRequestDto,
    @CurrentUser() user: { userId: string },
  ) {
    return this.upgradeRequestService.approve(id, dto, user.userId);
  }

  @Post('upgrade-requests/:id/reject')
  rejectUpgradeRequest(
    @Param('id') id: string,
    @Body() dto: RejectUpgradeRequestDto,
  ) {
    return this.upgradeRequestService.reject(id, dto);
  }
}
