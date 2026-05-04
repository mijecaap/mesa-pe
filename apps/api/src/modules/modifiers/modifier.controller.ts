import {
  Controller,
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
import { ModifierService } from './modifier.service';
import {
  CreateModifierGroupDto,
  UpdateModifierGroupDto,
  CreateModifierOptionDto,
  UpdateModifierOptionDto,
} from './modifier.dto';

@ApiTags('Modifiers')
@ApiBearerAuth()
@UseGuards(ClerkAuthGuard, TenantGuard)
@Controller()
export class ModifierController {
  constructor(private readonly modifierService: ModifierService) {}

  @Post('menu-items/:menuItemId/modifier-groups')
  createGroup(
    @Param('menuItemId') menuItemId: string,
    @Body() dto: CreateModifierGroupDto,
  ) {
    return this.modifierService.createGroup(menuItemId, dto);
  }

  @Patch('modifier-groups/:id')
  updateGroup(@Param('id') id: string, @Body() dto: UpdateModifierGroupDto) {
    return this.modifierService.updateGroup(id, dto);
  }

  @Delete('modifier-groups/:id')
  removeGroup(@Param('id') id: string) {
    return this.modifierService.removeGroup(id);
  }

  @Post('modifier-groups/:groupId/options')
  createOption(
    @Param('groupId') groupId: string,
    @Body() dto: CreateModifierOptionDto,
  ) {
    return this.modifierService.createOption(groupId, dto);
  }

  @Patch('modifier-options/:id')
  updateOption(@Param('id') id: string, @Body() dto: UpdateModifierOptionDto) {
    return this.modifierService.updateOption(id, dto);
  }

  @Delete('modifier-options/:id')
  removeOption(@Param('id') id: string) {
    return this.modifierService.removeOption(id);
  }
}
