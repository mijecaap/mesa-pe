import { Injectable, BadRequestException } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'crypto';

@Injectable()
export class MediaService {
  private readonly s3: S3Client;
  private readonly bucket: string;
  private readonly publicUrl: string;

  constructor() {
    this.s3 = new S3Client({
      region: 'auto',
      endpoint: process.env.S3_ENDPOINT,
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID!,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
      },
    });
    this.bucket = process.env.S3_BUCKET_NAME || 'mesa-pe';
    this.publicUrl = process.env.S3_PUBLIC_URL || process.env.S3_ENDPOINT || '';
  }

  async generatePresignedUrl(
    filename: string,
    contentType: string,
    fileSize: number,
  ) {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(contentType)) {
      throw new BadRequestException(
        'Tipo de archivo no permitido. Solo JPG, PNG, WebP.',
      );
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (fileSize > maxSize) {
      throw new BadRequestException('Archivo demasiado grande. Máximo 5MB.');
    }

    const ext = filename.split('.').pop() || 'jpg';
    const key = `uploads/${randomUUID()}.${ext}`;

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ContentType: contentType,
    });

    const presignedUrl = await getSignedUrl(this.s3, command, {
      expiresIn: 300,
    });

    return {
      presignedUrl,
      key,
      publicUrl: `${this.publicUrl}/${key}`,
    };
  }

  confirmUpload(key: string) {
    // In production, you could verify the object exists in R2
    const publicUrl = `${this.publicUrl}/${key}`;
    return { publicUrl, key };
  }
}
