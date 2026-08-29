import { NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { describe, expect, it, vi } from 'vitest';
import { PrismaService } from '../../common/prisma/prisma.service';
import { ProductsService } from './products.service';

function createService(products: unknown[] = [], total = products.length) {
  const findMany = vi.fn().mockResolvedValue(products);
  const count = vi.fn().mockResolvedValue(total);
  const findFirst = vi.fn().mockResolvedValue(products[0] ?? null);
  const prisma = {
    product: { findMany, count, findFirst },
  } as unknown as PrismaService;
  return { service: new ProductsService(prisma), findMany, count, findFirst };
}

describe('ProductsService', () => {
  describe('findAll', () => {
    it('only returns available products by default, paginated from page 1', async () => {
      const { service, findMany, count } = createService([], 0);

      await service.findAll({ limit: 20, page: 1 });

      expect(findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { isAvailable: true },
          orderBy: { sortOrder: 'asc' },
          skip: 0,
          take: 20,
        }),
      );
      expect(count).toHaveBeenCalledWith({ where: { isAvailable: true } });
    });

    it('filters by featured and category slug when provided', async () => {
      const { service, findMany } = createService();

      await service.findAll({
        featured: true,
        categorySlug: 'girls',
        limit: 8,
        page: 1,
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

    it('sorts by the requested field and direction', async () => {
      const { service, findMany } = createService();

      await service.findAll({
        limit: 20,
        page: 1,
        sortBy: 'price',
        sortDir: 'desc',
      });

      expect(findMany).toHaveBeenCalledWith(
        expect.objectContaining({ orderBy: { price: 'desc' } }),
      );
    });

    it('skips to the correct offset for subsequent pages', async () => {
      const { service, findMany } = createService();

      await service.findAll({ limit: 10, page: 3 });

      expect(findMany).toHaveBeenCalledWith(
        expect.objectContaining({ skip: 20, take: 10 }),
      );
    });

    it('returns pagination meta derived from the total count', async () => {
      const { service } = createService([], 45);

      const { meta } = await service.findAll({ limit: 20, page: 2 });

      expect(meta).toEqual({
        total: 45,
        page: 2,
        pageSize: 20,
        totalPages: 3,
      });
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

      const { data } = await service.findAll({ limit: 20, page: 1 });

      expect(data[0].price).toBe('129.90');
    });
  });

  describe('findBySlug', () => {
    it('returns the available product matching the slug', async () => {
      const { service, findFirst } = createService([
        {
          id: '1',
          name: 'Dress',
          slug: 'dress',
          description: 'A dress',
          price: new Prisma.Decimal('129.9'),
          imageUrl: null,
          categoryId: 'cat-1',
        },
      ]);

      const product = await service.findBySlug('dress');

      expect(findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { slug: 'dress', isAvailable: true },
        }),
      );
      expect(product.slug).toBe('dress');
      expect(product.price).toBe('129.90');
    });

    it('throws NotFoundException when no product matches', async () => {
      const { service } = createService([]);

      await expect(service.findBySlug('missing')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
