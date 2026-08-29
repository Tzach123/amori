import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../common/prisma/prisma.service';
import { ListProductsMetaDto } from './dto/list-products-meta.dto';
import { ListProductsQueryDto } from './dto/list-products.query.dto';
import { ProductResponseDto } from './dto/product-response.dto';

const PRODUCT_SELECT = {
  id: true,
  name: true,
  slug: true,
  description: true,
  price: true,
  imageUrl: true,
  categoryId: true,
} satisfies Prisma.ProductSelect;

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    query: ListProductsQueryDto,
  ): Promise<{ data: ProductResponseDto[]; meta: ListProductsMetaDto }> {
    const where: Prisma.ProductWhereInput = {
      isAvailable: true,
      ...(query.featured !== undefined && { isFeatured: query.featured }),
      ...(query.categorySlug && {
        category: { slug: query.categorySlug },
      }),
    };

    const page = query.page ?? 1;
    const pageSize = query.limit ?? 20;
    const sortBy = query.sortBy ?? 'sortOrder';
    const sortDir = query.sortDir ?? 'asc';

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        orderBy: { [sortBy]: sortDir },
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: PRODUCT_SELECT,
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      data: products.map((product) => this.toResponseDto(product)),
      meta: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  async findBySlug(slug: string): Promise<ProductResponseDto> {
    const product = await this.prisma.product.findFirst({
      where: { slug, isAvailable: true },
      select: PRODUCT_SELECT,
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return this.toResponseDto(product);
  }

  private toResponseDto(
    product: Prisma.ProductGetPayload<{ select: typeof PRODUCT_SELECT }>,
  ): ProductResponseDto {
    return {
      ...product,
      price: product.price.toFixed(2),
    };
  }
}
