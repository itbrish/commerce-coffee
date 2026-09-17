import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './products.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    brand?: string;
    boilerType?: string;
    usageType?: string;
    featured?: boolean;
    bestseller?: boolean;
    sortBy?: string;
    order?: 'asc' | 'desc';
  }) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 50;
    const skip = (page - 1) * limit;

    const where: any = { deletedAt: null };

    if (query.search) {
      where.OR = [
        { name: { contains: query.search } },
        { sku: { contains: query.search } },
        { shortDescription: { contains: query.search } },
      ];
    }

    if (query.category) {
      where.category = { slug: query.category };
    }

    if (query.brand) {
      where.brand = { slug: query.brand };
    }

    if (query.boilerType) {
      where.boilerType = { contains: query.boilerType };
    }

    if (query.usageType) {
      where.usageType = query.usageType.toUpperCase();
    }

    if (query.featured !== undefined) {
      where.featured = String(query.featured) === 'true';
    }

    if (query.bestseller !== undefined) {
      where.bestseller = String(query.bestseller) === 'true';
    }

    const orderBy: any = {};
    if (query.sortBy === 'price') {
      orderBy.price = query.order || 'asc';
    } else if (query.sortBy === 'name') {
      orderBy.name = query.order || 'asc';
    } else {
      orderBy.createdAt = 'desc';
    }

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          brand: true,
          category: true,
          images: { orderBy: { order: 'asc' } },
          specifications: { orderBy: { order: 'asc' } },
        },
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      data: products,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findBySlug(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: {
        brand: true,
        category: true,
        images: { orderBy: { order: 'asc' } },
        specifications: { orderBy: { order: 'asc' } },
        reviews: { include: { customer: true } },
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with slug "${slug}" not found`);
    }

    const relatedProducts = await this.prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: product.id },
        deletedAt: null,
      },
      take: 4,
      include: {
        brand: true,
        images: { orderBy: { order: 'asc' } },
      },
    });

    return {
      ...product,
      relatedProducts,
    };
  }

  async create(dto: CreateProductDto) {
    const { images, specifications, ...rest } = dto;
    return this.prisma.product.create({
      data: {
        ...rest,
        images: images ? { create: images } : undefined,
        specifications: specifications ? { create: specifications } : undefined,
        inventoryMovements: {
          create: {
            type: 'PURCHASE',
            quantity: dto.stock || 0,
            balanceAfter: dto.stock || 0,
            notes: 'Initial stock intake',
          },
        },
      },
      include: {
        brand: true,
        category: true,
        images: true,
        specifications: true,
      },
    });
  }

  async update(id: string, dto: any) {
    const { images, specifications, ...rest } = dto;

    if (images && Array.isArray(images)) {
      // Refresh image gallery for this product
      await this.prisma.productImage.deleteMany({ where: { productId: id } });
      await this.prisma.productImage.createMany({
        data: images.map((img: any, idx: number) => ({
          productId: id,
          url: img.url,
          altText: img.altText || `${rest.name || 'Product'} gallery image ${idx + 1}`,
          isPrimary: idx === 0 || img.isPrimary === true,
          order: idx,
        })),
      });
    }

    return this.prisma.product.update({
      where: { id },
      data: rest,
      include: {
        brand: true,
        category: true,
        images: true,
        specifications: true,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.product.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}