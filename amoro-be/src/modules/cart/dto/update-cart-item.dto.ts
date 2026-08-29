import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Max, Min } from 'class-validator';

export class UpdateCartItemDto {
  @ApiProperty({ description: 'New quantity for the item.' })
  @IsInt()
  @Min(1)
  @Max(20)
  quantity: number;
}
