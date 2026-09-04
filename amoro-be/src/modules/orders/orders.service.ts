import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderResponseDto } from './dto/order-response.dto';

const ORDER_INCLUDE = { items: true } satisfies Prisma.OrderInclude;

type OrderWithItems = Prisma.OrderGetPayload<{ include: typeof ORDER_INCLUDE }>;

/**
 * Flat shipping fee for MVP. PRD §8 requires a shipping cost to be shown but
 * doesn't specify a rate calculation — revisit once shipping rules are defined.
 */
const FLAT_SHIPPING_COST = new Prisma.Decimal('25.00');

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateOrderDto): Promise<OrderResponseDto> {
    const productIds = dto.items.map((item) => item.productId);
    const uniqueProductIds = new Set(productIds);
    if (uniqueProductIds.size !== productIds.length) {
      throw new BadRequestException('Duplicate productId in order items');
    }

    const products = await this.prisma.product.findMany({
      where: { id: { in: [...uniqueProductIds] }, isAvailable: true },
    });
    const productById = new Map(
      products.map((product) => [product.id, product]),
    );

    const missingId = productIds.find((id) => !productById.has(id));
    if (missingId) {
      throw new NotFoundException(`Product not found: ${missingId}`);
    }

    let subtotal = new Prisma.Decimal(0);
    const itemsData = dto.items.map((item) => {
      const product = productById.get(item.productId)!;
      const lineTotal = product.price.mul(item.quantity);
      subtotal = subtotal.add(lineTotal);

      return {
        productId: product.id,
        productName: product.name,
        unitPrice: product.price,
        quantity: item.quantity,
        lineTotal,
      };
    });

    const shippingCost = FLAT_SHIPPING_COST;
    const total = subtotal.add(shippingCost);

    const order = await this.prisma.order.create({
      data: {
        customerName: dto.customerName,
        customerPhone: dto.customerPhone,
        customerEmail: dto.customerEmail,
        shippingAddress: dto.shippingAddress,
        shippingCity: dto.shippingCity,
        shippingPostalCode: dto.shippingPostalCode,
        subtotal,
        shippingCost,
        total,
        items: { create: itemsData },
      },
      include: ORDER_INCLUDE,
    });

    return this.toResponse(order);
  }

  async findOne(orderId: string): Promise<OrderResponseDto> {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: ORDER_INCLUDE,
    });
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return this.toResponse(order);
  }

  private toResponse(order: OrderWithItems): OrderResponseDto {
    return {
      id: order.id,
      status: order.status,
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      customerEmail: order.customerEmail,
      shippingAddress: order.shippingAddress,
      shippingCity: order.shippingCity,
      shippingPostalCode: order.shippingPostalCode,
      items: order.items.map((item) => ({
        productId: item.productId,
        name: item.productName,
        unitPrice: item.unitPrice.toFixed(2),
        quantity: item.quantity,
        lineTotal: item.lineTotal.toFixed(2),
      })),
      subtotal: order.subtotal.toFixed(2),
      shippingCost: order.shippingCost.toFixed(2),
      total: order.total.toFixed(2),
      createdAt: order.createdAt,
    };
  }
}
