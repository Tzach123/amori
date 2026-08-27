import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../common/prisma/prisma.service';
import { ListProductsQueryDto } from './dto/list-products.query.dto';
import { ProductResponseDto } from './dto/product-response.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: ListProductsQueryDto): Promise<ProductResponseDto[]> {
    const where: Prisma.ProductWhereInput = {
      isAvailable: true,
      ...(query.featured !== undefined && { isFeatured: query.featured }),
      ...(query.categorySlug && {
        category: { slug: query.categorySlug },
      }),
    };

    const products = await this.prisma.product.findMany({
      where,
      orderBy: { sortOrder: 'asc' },
      take: query.limit,
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        price: true,
        imageUrl: true,
        categoryId: true,
      },
    });

    return products.map((product) => ({
      ...product,
      price: product.price.toFixed(2),
    }));
  }
}
