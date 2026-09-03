import { ApiProperty } from '@nestjs/swagger';

export class CategoryResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  slug: string;

  @ApiProperty({ nullable: true, type: String })
  imageUrl: string | null;

  @ApiProperty({ nullable: true, type: String })
  parentId: string | null;
}

export class CategoryDetailResponseDto extends CategoryResponseDto {
  @ApiProperty({ type: CategoryResponseDto, isArray: true })
  children: CategoryResponseDto[];
}
