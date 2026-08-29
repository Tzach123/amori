import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { CartResponseDto } from './dto/cart-response.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@ApiTags('carts')
@Controller('carts')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  @ApiOkResponse({ type: CartResponseDto })
  async create(): Promise<{ data: CartResponseDto }> {
    const data = await this.cartService.create();
    return { data };
  }

  @Get(':cartId')
  @ApiOkResponse({ type: CartResponseDto })
  async findOne(
    @Param('cartId', ParseUUIDPipe) cartId: string,
  ): Promise<{ data: CartResponseDto }> {
    const data = await this.cartService.findOne(cartId);
    return { data };
  }

  @Post(':cartId/items')
  @ApiOkResponse({ type: CartResponseDto })
  async addItem(
    @Param('cartId', ParseUUIDPipe) cartId: string,
    @Body() dto: AddCartItemDto,
  ): Promise<{ data: CartResponseDto }> {
    const data = await this.cartService.addItem(cartId, dto);
    return { data };
  }

  @Patch(':cartId/items/:productId')
  @ApiOkResponse({ type: CartResponseDto })
  async updateItem(
    @Param('cartId', ParseUUIDPipe) cartId: string,
    @Param('productId', ParseUUIDPipe) productId: string,
    @Body() dto: UpdateCartItemDto,
  ): Promise<{ data: CartResponseDto }> {
    const data = await this.cartService.updateItemQuantity(
      cartId,
      productId,
      dto,
    );
    return { data };
  }

  @Delete(':cartId/items/:productId')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: CartResponseDto })
  async removeItem(
    @Param('cartId', ParseUUIDPipe) cartId: string,
    @Param('productId', ParseUUIDPipe) productId: string,
  ): Promise<{ data: CartResponseDto }> {
    const data = await this.cartService.removeItem(cartId, productId);
    return { data };
  }
}
