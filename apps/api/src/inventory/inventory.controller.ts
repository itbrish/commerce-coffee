import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PrismaService } from '../prisma/prisma.service';

@ApiTags('Inventory')
@Controller('inventory')
export class InventoryController {
  constructor(private prisma: PrismaService) {}

  @Get('movements')
  @ApiOperation({ summary: 'Get audit trail of inventory movements' })
  async getMovements(@Query('productId') productId?: string) {
    return this.prisma.inventoryMovement.findMany({
      where: productId ? { productId } : undefined,
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: { product: { select: { name: true, sku: true } } },
    });
  }

  @Post('adjust')
  @ApiOperation({ summary: 'Manual inventory stock adjustment' })
  async adjustStock(@Body() body: { productId: string; adjustmentQty: number; notes: string }) {
    const product = await this.prisma.product.findUnique({ where: { id: body.productId } });
    if (!product) throw new Error('Product not found');

    const newStock = product.stock + body.adjustmentQty;
    const updated = await this.prisma.product.update({
      where: { id: body.productId },
      data: { stock: newStock },
    });

    await this.prisma.inventoryMovement.create({
      data: {
        productId: body.productId,
        type: 'ADJUSTMENT',
        quantity: body.adjustmentQty,
        balanceAfter: newStock,
        notes: body.notes || 'Admin manual stock adjustment',
      },
    });

    return updated;
  }
}
