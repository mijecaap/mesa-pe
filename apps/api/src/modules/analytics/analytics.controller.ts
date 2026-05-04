import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { TrackEventDto } from './dto/track-event.dto';

@ApiTags('Analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Post('events')
  async trackEvent(
    @Body() dto: TrackEventDto,
    @Query('ua') userAgent?: string,
    @Query('ref') referrer?: string,
    @Query('ip') ipAddress?: string,
  ) {
    return this.analyticsService.trackEvent({
      ...dto,
      userAgent,
      referrer,
      ipAddress,
    });
  }

  @Get('businesses/:id/summary')
  async getSummary(@Param('id') businessId: string) {
    return this.analyticsService.getSummary(businessId);
  }

  @Get('businesses/:id/top-products')
  async getTopProducts(
    @Param('id') businessId: string,
    @Query('type') type: 'view' | 'cart' = 'view',
  ) {
    return this.analyticsService.getTopProducts(businessId, type);
  }

  @Get('businesses/:id/hourly')
  async getHourlyVisits(@Param('id') businessId: string) {
    return this.analyticsService.getHourlyVisits(businessId);
  }

  @Get('businesses/:id/daily')
  async getDailyVisits(@Param('id') businessId: string) {
    return this.analyticsService.getDailyVisits(businessId);
  }
}
