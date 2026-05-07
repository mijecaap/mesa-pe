import { Injectable } from '@nestjs/common';
import { chromium } from 'playwright';

@Injectable()
export class PdfService {
  async generateQrPdf(slug: string): Promise<Buffer> {
    const browser = await chromium.launch({
      headless: true,
    });

    try {
      const page = await browser.newPage();

      const webUrl = process.env.WEB_URL ?? 'http://localhost:3000';
      const token = process.env.PDF_RENDER_TOKEN;

      if (!token) {
        throw new Error('PDF_RENDER_TOKEN no está configurado');
      }

      await page.goto(
        `${webUrl}/pdf/qr/${slug}?token=${token}`,
        { waitUntil: 'networkidle' },
      );

      await page.waitForSelector('[data-pdf-ready="true"]');

      const pdf = await page.pdf({
        format: 'A4',
        printBackground: true,
        preferCSSPageSize: true,
        margin: {
          top: '0mm',
          right: '0mm',
          bottom: '0mm',
          left: '0mm',
        },
        tagged: true,
        outline: true,
      });

      return Buffer.from(pdf);
    } finally {
      await browser.close();
    }
  }
}
