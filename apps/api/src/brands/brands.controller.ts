import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PrismaService } from '../prisma/prisma.service';

@ApiTags('Brands')
@Controller('brands')
export class BrandsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: 'List all heritage brands' })
  async findAll() {
    return this.prisma.brand.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { products: true } } },
    });
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get brand by slug with catalog preview' })
  async findBySlug(@Param('slug') slug: string) {
    return this.prisma.brand.findUnique({
      where: { slug },
      include: { products: { take: 12, include: { images: true, category: true } } },
    });
  }
}
