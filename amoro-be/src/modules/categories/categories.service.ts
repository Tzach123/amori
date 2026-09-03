import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import {
  CategoryDetailResponseDto,
  CategoryResponseDto,
} from './dto/category-response.dto';
import { ListCategoriesQueryDto } from './dto/list-categories.query.dto';

const CATEGORY_SELECT = {
  id: true,
  name: true,
  slug: true,
  imageUrl: true,
  parentId: true,
};

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: ListCategoriesQueryDto): Promise<CategoryResponseDto[]> {
    return this.prisma.category.findMany({
      where: query.topLevel ? { parentId: null } : undefined,
      orderBy: { sortOrder: 'asc' },
      select: CATEGORY_SELECT,
    });
  }

  async findBySlug(slug: string): Promise<CategoryDetailResponseDto> {
    const category = await this.prisma.category.findUnique({
      where: { slug },
      select: {
        ...CATEGORY_SELECT,
        children: {
          orderBy: { sortOrder: 'asc' },
          select: CATEGORY_SELECT,
        },
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }
}
