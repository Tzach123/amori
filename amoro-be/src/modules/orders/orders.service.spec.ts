import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrdersService } from './orders.service';

function decimal(value: string) {
  return new Prisma.Decimal(value);
}

function createProduct(overrides: Partial<Record<string, unknown>> = {}) {
  return {
    id: 'product-1',
    name: 'Dress',
    slug: 'dress',
    price: decimal('129.90'),
    isAvailable: true,
    ...overrides,
  };
}

function createOrderDto(
  overrides: Partial<CreateOrderDto> = {},
): CreateOrderDto {
  return {
    customerName: 'Dana Cohen',
    customerPhone: '050-1234567',
    customerEmail: 'dana@example.com',
    shippingAddress: 'Herzl 1',
    shippingCity: 'Tel Aviv',
    shippingPostalCode: '6100000',
    items: [{ productId: 'product-1', quantity: 2 }],
    ...overrides,
  };
}

function createPrismaMock() {
  return {
    order: {
      create: vi.fn(),
      findUnique: vi.fn(),
    },
    product: {
      findMany: vi.fn(),
    },
  };
}

describe('OrdersService', () => {
  let prisma: ReturnType<typeof createPrismaMock>;
  let service: OrdersService;

  beforeEach(() => {
    prisma = createPrismaMock();
    service = new OrdersService(prisma as unknown as PrismaService);
  });

  it('rejects duplicate productIds in the same order', async () => {
    const dto = createOrderDto({
      items: [
        { productId: 'product-1', quantity: 1 },
        { productId: 'product-1', quantity: 2 },
      ],
    });

    await expect(service.create(dto)).rejects.toThrow(BadRequestException);
    expect(prisma.product.findMany).not.toHaveBeenCalled();
  });

  it('rejects when a product does not exist or is unavailable', async () => {
    prisma.product.findMany.mockResolvedValue([]);

    await expect(service.create(createOrderDto())).rejects.toThrow(
      NotFoundException,
    );
    expect(prisma.order.create).not.toHaveBeenCalled();
  });

  it('re-derives prices from the product record and computes totals', async () => {
    prisma.product.findMany.mockResolvedValue([createProduct()]);
    prisma.order.create.mockResolvedValue({
      id: 'order-1',
      status: 'PENDING_PAYMENT',
      customerName: 'Dana Cohen',
      customerPhone: '050-1234567',
      customerEmail: 'dana@example.com',
      shippingAddress: 'Herzl 1',
      shippingCity: 'Tel Aviv',
      shippingPostalCode: '6100000',
      subtotal: decimal('259.80'),
      shippingCost: decimal('25.00'),
      total: decimal('284.80'),
      createdAt: new Date('2026-01-01'),
      items: [
        {
          productId: 'product-1',
          productName: 'Dress',
          unitPrice: decimal('129.90'),
          quantity: 2,
          lineTotal: decimal('259.80'),
        },
      ],
    });

    const order = await service.create(createOrderDto());

    const [createArgs] = prisma.order.create.mock.calls[0] as [
      { data: Record<string, unknown> },
    ];
    const createdData = createArgs.data;
    expect(createdData.subtotal).toBeInstanceOf(Prisma.Decimal);
    expect((createdData.subtotal as Prisma.Decimal).toFixed(2)).toBe('259.80');
    expect(createdData.items).toEqual({
      create: [
        expect.objectContaining({
          productId: 'product-1',
          unitPrice: decimal('129.90'),
          quantity: 2,
        }),
      ],
    });
    expect(order.subtotal).toBe('259.80');
    expect(order.shippingCost).toBe('25.00');
    expect(order.total).toBe('284.80');
    expect(order.status).toBe('PENDING_PAYMENT');
  });

  it('throws when reading an order that does not exist', async () => {
    prisma.order.findUnique.mockResolvedValue(null);

    await expect(service.findOne('missing-order')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('returns a found order formatted for the API', async () => {
    prisma.order.findUnique.mockResolvedValue({
      id: 'order-1',
      status: 'PENDING_PAYMENT',
      customerName: 'Dana Cohen',
      customerPhone: '050-1234567',
      customerEmail: 'dana@example.com',
      shippingAddress: 'Herzl 1',
      shippingCity: 'Tel Aviv',
      shippingPostalCode: '6100000',
      subtotal: decimal('129.90'),
      shippingCost: decimal('25.00'),
      total: decimal('154.90'),
      createdAt: new Date('2026-01-01'),
      items: [
        {
          productId: 'product-1',
          productName: 'Dress',
          unitPrice: decimal('129.90'),
          quantity: 1,
          lineTotal: decimal('129.90'),
        },
      ],
    });

    const order = await service.findOne('order-1');

    expect(order.id).toBe('order-1');
    expect(order.items[0]).toEqual({
      productId: 'product-1',
      name: 'Dress',
      unitPrice: '129.90',
      quantity: 1,
      lineTotal: '129.90',
    });
  });
});
