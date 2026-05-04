import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BusinessService } from './business.service';

@ApiTags('Public Business')
@Controller('businesses')
export class PublicBusinessController {
  constructor(private readonly businessService: BusinessService) {}

  @Get('public/:slug')
  findPublicBySlug(@Param('slug') slug: string) {
    return this.businessService.findPublicBySlug(slug);
  }

  @Get('public-slugs')
  findPublicSlugs() {
    return this.businessService.findPublicSlugs();
  }
}
