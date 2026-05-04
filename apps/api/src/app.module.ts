import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { WebhooksModule } from './webhooks/webhooks.module';
import { BusinessModule } from './modules/business/business.module';
import { OpeningHoursModule } from './modules/opening-hours/opening-hours.module';
import { MenuCategoriesModule } from './modules/menu-categories/menu-categories.module';
import { MenuItemsModule } from './modules/menu-items/menu-items.module';
import { ModifiersModule } from './modules/modifiers/modifiers.module';
import { MediaModule } from './modules/media/media.module';
import { PaymentMethodsModule } from './modules/payment-methods/payment-methods.module';
import { DeliveryZonesModule } from './modules/delivery-zones/delivery-zones.module';
import { OrderLeadsModule } from './modules/order-leads/order-leads.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    AuthModule,
    WebhooksModule,
    BusinessModule,
    OpeningHoursModule,
    MenuCategoriesModule,
    MenuItemsModule,
    ModifiersModule,
    MediaModule,
    PaymentMethodsModule,
    DeliveryZonesModule,
    OrderLeadsModule,
    AnalyticsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
