import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsUUID, Max, Min } from 'class-validator';

export class OrderItemInputDto {
  @ApiProperty({ description: 'ID of the product being ordered.' })
  @IsUUID()
  productId: string;

  @ApiProperty({ description: 'Quantity ordered.', default: 1 })
  @IsInt()
  @Min(1)
  @Max(20)
  quantity: number;
}
