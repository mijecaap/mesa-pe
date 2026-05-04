import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ClerkAuthGuard } from '../../auth/guards/clerk-auth.guard';
import { MediaService } from './media.service';

class PresignedUrlDto {
  filename!: string;
  contentType!: string;
  fileSize!: number;
}

class ConfirmUploadDto {
  key!: string;
}

@ApiTags('Media')
@ApiBearerAuth()
@UseGuards(ClerkAuthGuard)
@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('presigned-url')
  generatePresignedUrl(@Body() dto: PresignedUrlDto) {
    return this.mediaService.generatePresignedUrl(
      dto.filename,
      dto.contentType,
      dto.fileSize,
    );
  }

  @Post('confirm')
  confirmUpload(@Body() dto: ConfirmUploadDto) {
    return this.mediaService.confirmUpload(dto.key);
  }
}
