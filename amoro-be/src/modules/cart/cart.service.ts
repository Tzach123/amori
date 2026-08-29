import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../common/prisma/prisma.service';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { CartResponseDto } from './dto/cart-response.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

const CART_ITEM_INCLUDE = { product: true } satisfies Prisma.CartItemInclude;

type CartItemWithProduct = Prisma.CartItemGetPayload<{
  include: typeof CART_ITEM_INCLUDE;
}>;

const MAX_ITEM_QUANTITY = 20;

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  async create(): Promise<CartResponseDto> {
    const cart = await this.prisma.cart.create({ data: {} });
    return this.toResponse(cart.id, []);
  }

  async findOne(cartId: string): Promise<CartResponseDto> {
    const items = await this.findCartItemsOrThrow(cartId);
    return this.toResponse(cartId, items);
  }

  async addItem(cartId: string, dto: AddCartItemDto): Promise<CartResponseDto> {
    await this.findCartOrThrow(cartId);

    const product = await this.prisma.product.findFirst({
      where: { id: dto.productId, isAvailable: true },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const existing = await this.prisma.cartItem.findUnique({
      where: { cartId_productId: { cartId, productId: dto.productId } },
    });

    const quantity = Math.min(
      (existing?.quantity ?? 0) + dto.quantity,
      MAX_ITEM_QUANTITY,
    );

    await this.prisma.cartItem.upsert({
      where: { cartId_productId: { cartId, productId: dto.productId } },
      create: { cartId, productId: dto.productId, quantity },
      update: { quantity },
    });

    return this.findOne(cartId);
  }

  async updateItemQuantity(
    cartId: string,
    productId: string,
    dto: UpdateCartItemDto,
  ): Promise<CartResponseDto> {
    await this.findCartItemOrThrow(cartId, productId);

    await this.prisma.cartItem.update({
      where: { cartId_productId: { cartId, productId } },
      data: { quantity: dto.quantity },
    });

    return this.findOne(cartId);
  }

  async removeItem(
    cartId: string,
    productId: string,
  ): Promise<CartResponseDto> {
    await this.findCartItemOrThrow(cartId, productId);

    await this.prisma.cartItem.delete({
      where: { cartId_productId: { cartId, productId } },
    });

    return this.findOne(cartId);
  }

  private async findCartOrThrow(cartId: string) {
    const cart = await this.prisma.cart.findUnique({ where: { id: cartId } });
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }
    return cart;
  }

  private async findCartItemsOrThrow(
    cartId: string,
  ): Promise<CartItemWithProduct[]> {
    await this.findCartOrThrow(cartId);
    return this.prisma.cartItem.findMany({
      where: { cartId },
      include: CART_ITEM_INCLUDE,
      orderBy: { createdAt: 'asc' },
    });
  }

  private async findCartItemOrThrow(cartId: string, productId: string) {
    await this.findCartOrThrow(cartId);
    const item = await this.prisma.cartItem.findUnique({
      where: { cartId_productId: { cartId, productId } },
    });
    if (!item) {
      throw new NotFoundException('Cart item not found');
    }
    return item;
  }

  private toResponse(
    cartId: string,
    items: CartItemWithProduct[],
  ): CartResponseDto {
    let subtotal = new Prisma.Decimal(0);

    const mappedItems = items.map((item) => {
      const lineTotal = item.product.price.mul(item.quantity);
      subtotal = subtotal.add(lineTotal);

      return {
        productId: item.productId,
        name: item.product.name,
        slug: item.product.slug,
        imageUrl: item.product.imageUrl,
        price: item.product.price.toFixed(2),
        quantity: item.quantity,
        lineTotal: lineTotal.toFixed(2),
      };
    });

    return {
      id: cartId,
      items: mappedItems,
      itemCount: mappedItems.reduce((sum, item) => sum + item.quantity, 0),
      subtotal: subtotal.toFixed(2),
    };
  }
}
