import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ClerkAuthGuard } from '../../auth/guards/clerk-auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { PromotionsService } from './promotions.service';
import * as Dto from './promotions.dto';

@ApiTags('Promotions')
@ApiBearerAuth()
@UseGuards(ClerkAuthGuard, TenantGuard)
@Controller('businesses/:businessId/promotions')
export class PromotionsController {
  constructor(private readonly promotionsService: PromotionsService) {}

  @Post()
  create(
    @Param('businessId') businessId: string,
    @Body() dto: Dto.CreatePromotionDto,
  ) {
    return this.promotionsService.create(businessId, dto);
  }

  @Get()
  findByBusiness(@Param('businessId') businessId: string) {
    return this.promotionsService.findByBusiness(businessId);
  }

  @Patch(':id')
  update(
    @Param('businessId') businessId: string,
    @Param('id') id: string,
    @Body() dto: Dto.UpdatePromotionDto,
  ) {
    return this.promotionsService.update(businessId, id, dto);
  }

  @Delete(':id')
  remove(@Param('businessId') businessId: string, @Param('id') id: string) {
    return this.promotionsService.remove(businessId, id);
  }
}
