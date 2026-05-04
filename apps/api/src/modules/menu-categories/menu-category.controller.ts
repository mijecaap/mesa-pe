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
import { MenuCategoryService } from './menu-category.service';
import {
  CreateMenuCategoryDto,
  UpdateMenuCategoryDto,
  ReorderCategoriesDto,
} from './menu-category.dto';

@ApiTags('Menu Categories')
@ApiBearerAuth()
@UseGuards(ClerkAuthGuard, TenantGuard)
@Controller('businesses/:businessId/categories')
export class MenuCategoryController {
  constructor(private readonly menuCategoryService: MenuCategoryService) {}

  @Post()
  create(
    @Param('businessId') businessId: string,
    @Body() dto: CreateMenuCategoryDto,
  ) {
    return this.menuCategoryService.create(businessId, dto);
  }

  @Get()
  findByBusiness(@Param('businessId') businessId: string) {
    return this.menuCategoryService.findByBusiness(businessId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateMenuCategoryDto) {
    return this.menuCategoryService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.menuCategoryService.remove(id);
  }

  @Post('reorder')
  reorder(
    @Param('businessId') businessId: string,
    @Body() dto: ReorderCategoriesDto,
  ) {
    return this.menuCategoryService.reorder(businessId, dto);
  }
}
