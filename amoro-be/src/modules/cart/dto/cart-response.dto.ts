import { ApiProperty } from '@nestjs/swagger';

export class CartItemResponseDto {
  @ApiProperty()
  productId: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  slug: string;

  @ApiProperty({ nullable: true, type: String })
  imageUrl: string | null;

  @ApiProperty({
    type: String,
    description: 'Decimal unit price, e.g. "129.90"',
  })
  price: string;

  @ApiProperty()
  quantity: number;

  @ApiProperty({ type: String, description: 'price * quantity, e.g. "259.80"' })
  lineTotal: string;
}

export class CartResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ type: CartItemResponseDto, isArray: true })
  items: CartItemResponseDto[];

  @ApiProperty()
  itemCount: number;

  @ApiProperty({
    type: String,
    description: 'Sum of all line totals, e.g. "389.70"',
  })
  subtotal: string;
}
