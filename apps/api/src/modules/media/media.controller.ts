import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IsString, IsNumber, IsIn } from 'class-validator';
import { ClerkAuthGuard } from '../../auth/guards/clerk-auth.guard';
import { MediaService } from './media.service';

class PresignedUrlDto {
  @IsString()
  filename!: string;

  @IsString()
  @IsIn(['image/jpeg', 'image/png', 'image/webp'])
  contentType!: string;

  @IsNumber()
  fileSize!: number;
}

class ConfirmUploadDto {
  @IsString()
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
