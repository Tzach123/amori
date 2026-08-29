import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export type ProductSortBy = 'sortOrder' | 'price' | 'name';
export type SortDirection = 'asc' | 'desc';

export class ListProductsQueryDto {
  @ApiPropertyOptional({ description: 'Only return featured products.' })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  featured?: boolean;

  @ApiPropertyOptional({ description: 'Filter by category slug.' })
  @IsOptional()
  @IsString()
  categorySlug?: string;

  @ApiPropertyOptional({
    description: 'Page number (1-based).',
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(10_000)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Number of products per page.',
    default: 20,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @ApiPropertyOptional({
    description: 'Field to sort by.',
    enum: ['sortOrder', 'price', 'name'],
    default: 'sortOrder',
  })
  @IsOptional()
  @IsIn(['sortOrder', 'price', 'name'])
  sortBy?: ProductSortBy = 'sortOrder';

  @ApiPropertyOptional({
    description: 'Sort direction.',
    enum: ['asc', 'desc'],
    default: 'asc',
  })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortDir?: SortDirection = 'asc';
}
