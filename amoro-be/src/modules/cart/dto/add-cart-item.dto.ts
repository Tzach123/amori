import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsUUID, Max, Min } from 'class-validator';

export class AddCartItemDto {
  @ApiProperty({ description: 'ID of the product to add to the cart.' })
  @IsUUID()
  productId: string;

  @ApiProperty({ description: 'Quantity to add.', default: 1 })
  @IsInt()
  @Min(1)
  @Max(20)
  quantity: number;
}
