import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';

export class ListCategoriesQueryDto {
  @ApiPropertyOptional({
    description: 'When true, only return top-level categories (no parent).',
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  topLevel?: boolean;
}
