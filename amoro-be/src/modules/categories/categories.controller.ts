import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import {
  CategoryDetailResponseDto,
  CategoryResponseDto,
} from './dto/category-response.dto';
import { ListCategoriesQueryDto } from './dto/list-categories.query.dto';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiOkResponse({ type: CategoryResponseDto, isArray: true })
  async findAll(
    @Query() query: ListCategoriesQueryDto,
  ): Promise<{ data: CategoryResponseDto[] }> {
    const data = await this.categoriesService.findAll(query);
    return { data };
  }

  @Get(':slug')
  @ApiOkResponse({ type: CategoryDetailResponseDto })
  async findBySlug(
    @Param('slug') slug: string,
  ): Promise<{ data: CategoryDetailResponseDto }> {
    const data = await this.categoriesService.findBySlug(slug);
    return { data };
  }
}
