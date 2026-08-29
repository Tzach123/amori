import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ListProductsMetaDto } from './dto/list-products-meta.dto';
import { ListProductsQueryDto } from './dto/list-products.query.dto';
import { ProductResponseDto } from './dto/product-response.dto';
import { ProductsService } from './products.service';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOkResponse({ type: ProductResponseDto, isArray: true })
  async findAll(
    @Query() query: ListProductsQueryDto,
  ): Promise<{ data: ProductResponseDto[]; meta: ListProductsMetaDto }> {
    return this.productsService.findAll(query);
  }

  @Get(':slug')
  @ApiOkResponse({ type: ProductResponseDto })
  async findBySlug(
    @Param('slug') slug: string,
  ): Promise<{ data: ProductResponseDto }> {
    const data = await this.productsService.findBySlug(slug);
    return { data };
  }
}
