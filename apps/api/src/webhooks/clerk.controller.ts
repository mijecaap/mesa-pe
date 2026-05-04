import {
  Controller,
  Post,
  Headers,
  HttpCode,
  BadRequestException,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { Webhook } from 'svix';
import { ClerkWebhookService } from './clerk.service';

interface WebhookEvent {
  type: string;
  data: Record<string, unknown>;
}

@Controller('webhooks/clerk')
export class ClerkWebhookController {
  constructor(private readonly clerkWebhookService: ClerkWebhookService) {}

  @Post()
  @HttpCode(200)
  async handleWebhook(
    @Headers('svix-id') svixId: string,
    @Headers('svix-timestamp') svixTimestamp: string,
    @Headers('svix-signature') svixSignature: string,
    @Req() req: Request,
  ) {
    if (!svixId || !svixTimestamp || !svixSignature) {
      throw new BadRequestException('Missing Svix headers');
    }

    const secret = process.env.CLERK_WEBHOOK_SECRET;
    if (!secret || secret === 'whsec_...') {
      throw new BadRequestException('Webhook secret not configured');
    }

    const wh = new Webhook(secret);
    const payload =
      req.body instanceof Buffer
        ? req.body.toString()
        : JSON.stringify(req.body);

    let evt: WebhookEvent;

    try {
      evt = wh.verify(payload, {
        'svix-id': svixId,
        'svix-timestamp': svixTimestamp,
        'svix-signature': svixSignature,
      }) as WebhookEvent;
    } catch {
      throw new BadRequestException('Webhook verification failed');
    }

    await this.clerkWebhookService.processEvent(evt.type, evt.data);

    return { received: true };
  }
}
