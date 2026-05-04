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
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CurrentOrg } from '../../common/decorators/current-org.decorator';
import { BusinessService } from './business.service';
import {
  CreateBusinessDto,
  UpdateBusinessDto,
} from './dto/create-business.dto';

@ApiTags('Business')
@ApiBearerAuth()
@UseGuards(ClerkAuthGuard)
@Controller('businesses')
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  @Post()
  create(
    @CurrentUser() user: { userId: string; orgId?: string },
    @CurrentOrg() orgId: string | undefined,
    @Body() dto: CreateBusinessDto,
  ) {
    return this.businessService.create(user.userId, orgId, dto);
  }

  @Get('org/:orgId')
  findByOrganization(@Param('orgId') orgId: string) {
    return this.businessService.findByOrganization(orgId);
  }

  @Get('me')
  findByOwner(@CurrentUser() user: { userId: string }) {
    return this.businessService.findByOwner(user.userId);
  }

  @Get(':id')
  @UseGuards(TenantGuard)
  findOne(@Param('id') id: string) {
    return this.businessService.findOne(id);
  }

  @Get(':id/feature-flags')
  @UseGuards(TenantGuard)
  getFeatureFlags(@Param('id') id: string) {
    return this.businessService.getFeatureFlags(id);
  }

  @Patch(':id')
  @UseGuards(TenantGuard)
  update(@Param('id') id: string, @Body() dto: UpdateBusinessDto) {
    return this.businessService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(TenantGuard)
  remove(@Param('id') id: string) {
    return this.businessService.remove(id);
  }
}
