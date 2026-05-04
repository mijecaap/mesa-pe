import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { ClerkWebhookController } from './clerk.controller';
import { ClerkWebhookService } from './clerk.service';

@Module({
  imports: [DatabaseModule],
  controllers: [ClerkWebhookController],
  providers: [ClerkWebhookService],
})
export class WebhooksModule {}
