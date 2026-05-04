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
import { MenuItemService } from './menu-item.service';
import {
  CreateMenuItemDto,
  UpdateMenuItemDto,
  ReorderItemsDto,
} from './menu-item.dto';

@ApiTags('Menu Items')
@ApiBearerAuth()
@UseGuards(ClerkAuthGuard, TenantGuard)
@Controller('businesses/:businessId/items')
export class MenuItemController {
  constructor(private readonly menuItemService: MenuItemService) {}

  @Post()
  create(
    @Param('businessId') businessId: string,
    @Body() dto: CreateMenuItemDto,
  ) {
    return this.menuItemService.create(businessId, dto);
  }

  @Get()
  findByBusiness(@Param('businessId') businessId: string) {
    return this.menuItemService.findByBusiness(businessId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.menuItemService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateMenuItemDto) {
    return this.menuItemService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.menuItemService.remove(id);
  }

  @Post(':id/duplicate')
  duplicate(@Param('id') id: string) {
    return this.menuItemService.duplicate(id);
  }

  @Post('reorder')
  reorder(
    @Param('businessId') businessId: string,
    @Body() dto: ReorderItemsDto,
  ) {
    return this.menuItemService.reorder(businessId, dto);
  }
}
