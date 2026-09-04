import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from '@prisma/client';

export class OrderItemResponseDto {
  @ApiProperty()
  productId: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ type: String, description: 'Unit price, e.g. "129.90"' })
  unitPrice: string;

  @ApiProperty()
  quantity: number;

  @ApiProperty({
    type: String,
    description: 'unitPrice * quantity, e.g. "259.80"',
  })
  lineTotal: string;
}

export class OrderResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ enum: OrderStatus })
  status: OrderStatus;

  @ApiProperty()
  customerName: string;

  @ApiProperty()
  customerPhone: string;

  @ApiProperty()
  customerEmail: string;

  @ApiProperty()
  shippingAddress: string;

  @ApiProperty()
  shippingCity: string;

  @ApiProperty()
  shippingPostalCode: string;

  @ApiProperty({ type: OrderItemResponseDto, isArray: true })
  items: OrderItemResponseDto[];

  @ApiProperty({
    type: String,
    description: 'Sum of all line totals, e.g. "389.70"',
  })
  subtotal: string;

  @ApiProperty({ type: String, description: 'Flat shipping fee, e.g. "25.00"' })
  shippingCost: string;

  @ApiProperty({
    type: String,
    description: 'subtotal + shippingCost, e.g. "414.70"',
  })
  total: string;

  @ApiProperty()
  createdAt: Date;
}
