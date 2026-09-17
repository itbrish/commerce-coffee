import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddToCartDto } from './carts.dto';

@Injectable()
export class CartsService {
  constructor(private prisma: PrismaService) {}

  async getCart(sessionId: string) {
    let cart = await this.prisma.cart.findUnique({
      where: { sessionId },
      include: {
        items: {
          include: {
            product: {
              include: { brand: true, images: { take: 1 } },
            },
          },
        },
      },
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { sessionId },
        include: {
          items: {
            include: {
              product: {
                include: { brand: true, images: { take: 1 } },
              },
            },
          },
        },
      });
    }

    const subtotal = cart.items.reduce(
      (sum, item) => sum + Number(item.unitPrice) * item.quantity,
      0,
    );

    return {
      id: cart.id,
      sessionId: cart.sessionId,
      items: cart.items,
      subtotal,
      itemCount: cart.items.reduce((sum, item) => sum + item.quantity, 0),
    };
  }

  async addItem(dto: AddToCartDto) {
    const product = await this.prisma.product.findUnique({ where: { id: dto.productId } });
    if (!product) throw new NotFoundException('Product not found');

    const cartData = await this.getCart(dto.sessionId);
    const existingItem = await this.prisma.cartItem.findFirst({
      where: { cartId: cartData.id, productId: dto.productId },
    });

    if (existingItem) {
      await this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + dto.quantity },
      });
    } else {
      await this.prisma.cartItem.create({
        data: {
          cartId: cartData.id,
          productId: dto.productId,
          quantity: dto.quantity,
          unitPrice: product.price,
        },
      });
    }

    return this.getCart(dto.sessionId);
  }

  async removeItem(itemId: string, sessionId: string) {
    await this.prisma.cartItem.delete({ where: { id: itemId } });
    return this.getCart(sessionId);
  }
}
