import { ApiProperty } from '@nestjs/swagger';

export class ProductResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  slug: string;

  @ApiProperty({ nullable: true, type: String })
  description: string | null;

  @ApiProperty({ type: String, description: 'Decimal price, e.g. "129.90"' })
  price: string;

  @ApiProperty({ nullable: true, type: String })
  imageUrl: string | null;

  @ApiProperty()
  categoryId: string;
}
