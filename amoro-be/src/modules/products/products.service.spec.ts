import { Prisma } from '@prisma/client';
import { describe, expect, it, vi } from 'vitest';
import { ProductsService } from './products.service';

function createService(products: unknown[] = []) {
  const findMany = vi.fn().mockResolvedValue(products);
  const prisma = { product: { findMany } } as any;
  return { service: new ProductsService(prisma), findMany };
}

describe('ProductsService', () => {
  it('only returns available products by default', async () => {
    const { service, findMany } = createService();

    await service.findAll({ limit: 20 });

    expect(findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { isAvailable: true },
        orderBy: { sortOrder: 'asc' },
        take: 20,
      }),
    );
  });

  it('filters by featured and category slug when provided', async () => {
    const { service, findMany } = createService();

    await service.findAll({
      featured: true,
      categorySlug: 'girls',
      limit: 8,
    });

    expect(findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          isAvailable: true,
          isFeatured: true,
          category: { slug: 'girls' },
        },
        orderBy: { sortOrder: 'asc' },
        take: 8,
      }),
    );
  });

  it('formats the decimal price as a fixed 2-decimal string', async () => {
    const { service } = createService([
      {
        id: '1',
        name: 'Dress',
        slug: 'dress',
        description: null,
        price: new Prisma.Decimal('129.9'),
        imageUrl: null,
        categoryId: 'cat-1',
      },
    ]);

    const [product] = await service.findAll({ limit: 20 });

    expect(product.price).toBe('129.90');
  });
});
