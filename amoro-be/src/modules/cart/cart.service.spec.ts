import { NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CartService } from './cart.service';

function decimal(value: string) {
  return new Prisma.Decimal(value);
}

function createProduct(overrides: Partial<Record<string, unknown>> = {}) {
  return {
    id: 'product-1',
    name: 'Dress',
    slug: 'dress',
    imageUrl: null,
    price: decimal('129.90'),
    isAvailable: true,
    ...overrides,
  };
}

function createPrismaMock() {
  return {
    cart: {
      create: vi.fn(),
      findUnique: vi.fn(),
    },
    cartItem: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      upsert: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    product: {
      findFirst: vi.fn(),
    },
  };
}

describe('CartService', () => {
  let prisma: ReturnType<typeof createPrismaMock>;
  let service: CartService;

  beforeEach(() => {
    prisma = createPrismaMock();
    service = new CartService(prisma as unknown as PrismaService);
  });

  it('creates an empty cart', async () => {
    prisma.cart.create.mockResolvedValue({ id: 'cart-1' });

    const cart = await service.create();

    expect(cart).toEqual({
      id: 'cart-1',
      items: [],
      itemCount: 0,
      subtotal: '0.00',
    });
  });

  it('throws when reading a cart that does not exist', async () => {
    prisma.cart.findUnique.mockResolvedValue(null);

    await expect(service.findOne('missing-cart')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('computes item count and subtotal across items', async () => {
    prisma.cart.findUnique.mockResolvedValue({ id: 'cart-1' });
    prisma.cartItem.findMany.mockResolvedValue([
      { productId: 'p1', quantity: 2, product: createProduct({ id: 'p1' }) },
      {
        productId: 'p2',
        quantity: 1,
        product: createProduct({ id: 'p2', price: decimal('50.00') }),
      },
    ]);

    const cart = await service.findOne('cart-1');

    expect(cart.itemCount).toBe(3);
    expect(cart.subtotal).toBe('309.80');
    expect(cart.items[0].lineTotal).toBe('259.80');
  });

  it('rejects adding a product that does not exist or is unavailable', async () => {
    prisma.cart.findUnique.mockResolvedValue({ id: 'cart-1' });
    prisma.product.findFirst.mockResolvedValue(null);

    await expect(
      service.addItem('cart-1', { productId: 'missing', quantity: 1 }),
    ).rejects.toThrow(NotFoundException);
    expect(prisma.cartItem.upsert).not.toHaveBeenCalled();
  });

  it('merges quantity with an existing line item, capped at the max', async () => {
    prisma.cart.findUnique.mockResolvedValue({ id: 'cart-1' });
    prisma.product.findFirst.mockResolvedValue(createProduct());
    prisma.cartItem.findUnique.mockResolvedValue({ quantity: 15 });
    prisma.cartItem.findMany.mockResolvedValue([]);

    await service.addItem('cart-1', { productId: 'product-1', quantity: 10 });

    expect(prisma.cartItem.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        create: { cartId: 'cart-1', productId: 'product-1', quantity: 20 },
        update: { quantity: 20 },
      }),
    );
  });

  it('throws when updating a line item that does not exist', async () => {
    prisma.cart.findUnique.mockResolvedValue({ id: 'cart-1' });
    prisma.cartItem.findUnique.mockResolvedValue(null);

    await expect(
      service.updateItemQuantity('cart-1', 'missing-product', { quantity: 2 }),
    ).rejects.toThrow(NotFoundException);
  });

  it('removes a line item', async () => {
    prisma.cart.findUnique.mockResolvedValue({ id: 'cart-1' });
    prisma.cartItem.findUnique.mockResolvedValue({ quantity: 1 });
    prisma.cartItem.findMany.mockResolvedValue([]);

    await service.removeItem('cart-1', 'product-1');

    expect(prisma.cartItem.delete).toHaveBeenCalledWith({
      where: { cartId_productId: { cartId: 'cart-1', productId: 'product-1' } },
    });
  });
});
