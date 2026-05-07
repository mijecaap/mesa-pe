import {
  Controller,
  Get,
  Param,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PdfService } from './pdf.service';
import { ClerkAuthGuard } from '../../auth/guards/clerk-auth.guard';

@ApiTags('PDF')
@Controller('pdf')
export class PdfController {
  constructor(private readonly pdfService: PdfService) {}

  @Get('qr/:slug')
  @UseGuards(ClerkAuthGuard)
  @ApiBearerAuth()
  async qrPdf(@Param('slug') slug: string, @Res() res: Response) {
    const pdf = await this.pdfService.generateQrPdf(slug);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${slug}-qr-mesa.pdf"`,
    );
    res.send(pdf);
  }
}
