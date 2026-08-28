import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

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
    description: 'Max number of products to return.',
    default: 20,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;
}
