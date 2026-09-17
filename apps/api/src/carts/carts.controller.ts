import { Controller, Get, Post, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CartsService } from './carts.service';
import { AddToCartDto } from './carts.dto';

@ApiTags('Cart')
@Controller('cart')
export class CartsController {
  constructor(private cartsService: CartsService) {}

  @Get()
  @ApiOperation({ summary: 'Get current session cart' })
  async getCart(@Query('sessionId') sessionId: string) {
    return this.cartsService.getCart(sessionId || 'guest');
  }

  @Post('items')
  @ApiOperation({ summary: 'Add product item to cart' })
  async addItem(@Body() dto: AddToCartDto) {
    return this.cartsService.addItem(dto);
  }

  @Delete('items/:id')
  @ApiOperation({ summary: 'Remove item from cart' })
  async removeItem(@Param('id') id: string, @Query('sessionId') sessionId: string) {
    return this.cartsService.removeItem(id, sessionId || 'guest');
  }
}
