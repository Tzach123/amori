import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { OrderItemInputDto } from './order-item-input.dto';

export class CreateOrderDto {
  @ApiProperty({ description: 'Customer full name.' })
  @IsString()
  @MaxLength(100)
  customerName: string;

  @ApiProperty({ description: 'Customer phone number.' })
  @IsString()
  @Matches(/^[0-9+\-\s()]{7,20}$/, {
    message: 'customerPhone must be a valid phone number',
  })
  customerPhone: string;

  @ApiProperty({ description: 'Customer email address.' })
  @IsEmail()
  customerEmail: string;

  @ApiProperty({ description: 'Shipping street address.' })
  @IsString()
  @MaxLength(200)
  shippingAddress: string;

  @ApiProperty({ description: 'Shipping city.' })
  @IsString()
  @MaxLength(100)
  shippingCity: string;

  @ApiProperty({ description: 'Shipping postal code.' })
  @IsString()
  @MaxLength(20)
  shippingPostalCode: string;

  @ApiProperty({
    description: 'Line items for the order.',
    type: OrderItemInputDto,
    isArray: true,
  })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(50)
  @ValidateNested({ each: true })
  @Type(() => OrderItemInputDto)
  items: OrderItemInputDto[];
}
