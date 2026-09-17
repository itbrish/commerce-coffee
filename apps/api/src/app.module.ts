import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { BrandsModule } from './brands/brands.module';
import { CartsModule } from './carts/carts.module';
import { OrdersModule } from './orders/orders.module';
import { InventoryModule } from './inventory/inventory.module';
import { WhatsAppModule } from './whatsapp/whatsapp.module';
import { PaymentsModule } from './payments/payments.module';
import { CMSModule } from './cms/cms.module';
import { NotificationsModule } from './notifications/notifications.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    ProductsModule,
    CategoriesModule,
    BrandsModule,
    CartsModule,
    OrdersModule,
    InventoryModule,
    WhatsAppModule,
    PaymentsModule,
    CMSModule,
    NotificationsModule,
    UploadModule,
  ],
})
export class AppModule {}