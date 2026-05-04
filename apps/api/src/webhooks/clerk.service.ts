import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

interface ClerkEmailAddress {
  email_address?: string;
}

interface ClerkUserData {
  id: string;
  email_addresses?: ClerkEmailAddress[];
  first_name?: string | null;
  last_name?: string | null;
  image_url?: string | null;
}

interface ClerkOrganizationData {
  id: string;
  name: string;
  slug?: string | null;
  image_url?: string | null;
}

interface ClerkMembershipData {
  organization?: { id: string } | null;
  public_user_data?: { user_id: string } | null;
  role?: string;
}

@Injectable()
export class ClerkWebhookService {
  private readonly logger = new Logger(ClerkWebhookService.name);

  constructor(private readonly prisma: PrismaService) {}

  async processEvent(type: string, data: unknown): Promise<void> {
    this.logger.log(`Processing Clerk event: ${type}`);

    switch (type) {
      case 'user.created':
        await this.handleUserCreated(data as ClerkUserData);
        break;
      case 'user.updated':
        await this.handleUserUpdated(data as ClerkUserData);
        break;
      case 'user.deleted':
        await this.handleUserDeleted(data as ClerkUserData);
        break;
      case 'organization.created':
      case 'organization.updated':
        await this.handleOrganizationCreated(data as ClerkOrganizationData);
        break;
      case 'organizationMembership.created':
        await this.handleOrganizationMembershipCreated(
          data as ClerkMembershipData,
        );
        break;
      default:
        this.logger.warn(`Unhandled Clerk event type: ${type}`);
    }
  }

  private async handleUserCreated(data: ClerkUserData) {
    const email = data.email_addresses?.[0]?.email_address;
    const name =
      `${data.first_name ?? ''} ${data.last_name ?? ''}`.trim() || email;

    await this.prisma.user.upsert({
      where: { clerkId: data.id },
      update: { email, name, imageUrl: data.image_url },
      create: {
        clerkId: data.id,
        email: email ?? `unknown-${data.id}@mesa.pe`,
        name,
        imageUrl: data.image_url,
      },
    });

    this.logger.log(`User synced: ${data.id}`);
  }

  private async handleUserUpdated(data: ClerkUserData) {
    const email = data.email_addresses?.[0]?.email_address;
    const name =
      `${data.first_name ?? ''} ${data.last_name ?? ''}`.trim() || email;

    await this.prisma.user.update({
      where: { clerkId: data.id },
      data: { email, name, imageUrl: data.image_url },
    });

    this.logger.log(`User updated: ${data.id}`);
  }

  private async handleUserDeleted(data: ClerkUserData) {
    await this.prisma.user.delete({ where: { clerkId: data.id } }).catch(() => {
      this.logger.warn(`User not found for deletion: ${data.id}`);
    });

    this.logger.log(`User deleted: ${data.id}`);
  }

  private async handleOrganizationCreated(data: ClerkOrganizationData) {
    await this.prisma.organization.upsert({
      where: { clerkOrgId: data.id },
      update: { name: data.name, slug: data.slug },
      create: {
        clerkOrgId: data.id,
        name: data.name,
        slug: data.slug,
        imageUrl: data.image_url,
      },
    });

    this.logger.log(`Organization synced: ${data.id}`);
  }

  private async handleOrganizationMembershipCreated(data: ClerkMembershipData) {
    const orgId = data.organization?.id;
    const userId = data.public_user_data?.user_id;
    const role = data.role;

    if (!orgId || !userId) {
      this.logger.warn('Missing orgId or userId in membership event');
      return;
    }

    // Ensure both org and user exist locally
    await this.prisma.organization
      .upsert({
        where: { clerkOrgId: orgId },
        update: {},
        create: { clerkOrgId: orgId, name: orgId },
      })
      .catch(() => null);

    await this.prisma.user
      .upsert({
        where: { clerkId: userId },
        update: {},
        create: {
          clerkId: userId,
          email: `unknown-${userId}@mesa.pe`,
          name: 'Unknown',
        },
      })
      .catch(() => null);

    this.logger.log(
      `Organization membership synced: ${userId} -> ${orgId} (${role})`,
    );
  }
}
