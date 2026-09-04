import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { RateLimitGuard } from '../../common/guards/rate-limit.guard';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderResponseDto } from './dto/order-response.dto';
import { OrdersService } from './orders.service';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseGuards(RateLimitGuard)
  @ApiCreatedResponse({ type: OrderResponseDto })
  async create(
    @Body() dto: CreateOrderDto,
  ): Promise<{ data: OrderResponseDto }> {
    const data = await this.ordersService.create(dto);
    return { data };
  }

  @Get(':orderId')
  @ApiOkResponse({ type: OrderResponseDto })
  async findOne(
    @Param('orderId', ParseUUIDPipe) orderId: string,
  ): Promise<{ data: OrderResponseDto }> {
    const data = await this.ordersService.findOne(orderId);
    return { data };
  }
}
