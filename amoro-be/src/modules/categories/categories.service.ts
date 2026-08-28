import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CategoryResponseDto } from './dto/category-response.dto';
import { ListCategoriesQueryDto } from './dto/list-categories.query.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: ListCategoriesQueryDto): Promise<CategoryResponseDto[]> {
    return this.prisma.category.findMany({
      where: query.topLevel ? { parentId: null } : undefined,
      orderBy: { sortOrder: 'asc' },
      select: {
        id: true,
        name: true,
        slug: true,
        imageUrl: true,
        parentId: true,
      },
    });
  }
}
