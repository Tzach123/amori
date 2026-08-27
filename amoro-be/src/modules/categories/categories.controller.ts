import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CategoryResponseDto } from './dto/category-response.dto';
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
}
