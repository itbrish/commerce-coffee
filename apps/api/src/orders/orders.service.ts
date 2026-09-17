import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './orders.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateOrderDto) {
    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestException('Order items cannot be empty');
    }

    return this.prisma.$transaction(async (tx) => {
      let subtotal = 0;
      const orderItemsData: any[] = [];

      for (const item of dto.items) {
        const product = await tx.product.findUnique({ where: { id: item.productId } });
        if (!product) throw new NotFoundException('Product ' + item.productId + ' not found');
        if (product.stock < item.quantity) {
          throw new BadRequestException('Insufficient stock for ' + product.name + '. Available: ' + product.stock);
        }

        const price = Number(product.price);
        const itemTotal = price * item.quantity;
        subtotal += itemTotal;

        orderItemsData.push({
          productId: product.id,
          productName: product.name,
          productSku: product.sku,
          quantity: item.quantity,
          unitPrice: product.price,
          totalPrice: itemTotal,
        });

        const updatedStock = product.stock - item.quantity;
        await tx.product.update({
          where: { id: product.id },
          data: {
            stock: updatedStock,
            reservedStock: product.reservedStock + item.quantity,
          },
        });

        await tx.inventoryMovement.create({
          data: {
            productId: product.id,
            type: 'RESERVATION',
            quantity: item.quantity,
            balanceAfter: updatedStock,
            notes: 'Stock reserved for checkout order',
          },
        });
      }

      const shippingCost = subtotal >= 10000000 ? 0 : 250000;
      const totalAmount = subtotal + shippingCost;
      const orderNumber = 'ORD-' + Date.now().toString().slice(-6) + Math.floor(1000 + Math.random() * 9000);

      const order = await tx.order.create({
        data: {
          orderNumber,
          customerName: dto.customerName,
          customerEmail: dto.customerEmail,
          customerPhone: dto.customerPhone,
          whatsappNumber: dto.whatsappNumber || dto.customerPhone,
          streetAddress: dto.streetAddress,
          province: dto.province,
          city: dto.city,
          district: dto.district,
          postalCode: dto.postalCode,
          shippingMethodName: dto.shippingMethodName || 'White-Glove Courier & Installation',
          shippingCost,
          subtotal,
          totalAmount,
          status: 'PENDING',
          paymentStatus: 'PENDING',
          notes: dto.notes,
          items: {
            create: orderItemsData,
          },
          payments: {
            create: {
              paymentMethod: 'Midtrans Payment Gateway / Bank Transfer',
              amount: totalAmount,
              status: 'PENDING',
            },
          },
        },
        include: {
          items: true,
          payments: true,
        },
      });

      return order;
    });
  }

  async findAll(query: any) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { items: true, payments: true },
      }),
      this.prisma.order.count(),
    ]);

    return {
      data: orders,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { items: { include: { product: true } }, payments: true },
    });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async updateStatus(id: string, status: any, trackingNumber?: string) {
    return this.prisma.order.update({
      where: { id },
      data: {
        status,
        trackingNumber: trackingNumber || undefined,
      },
    });
  }
}
