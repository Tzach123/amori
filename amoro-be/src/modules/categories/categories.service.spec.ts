import { NotFoundException } from '@nestjs/common';
import { describe, expect, it, vi } from 'vitest';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CategoriesService } from './categories.service';

function createService(categories: unknown[] = []) {
  const findMany = vi.fn().mockResolvedValue(categories);
  const findUnique = vi.fn().mockResolvedValue(categories[0] ?? null);
  const prisma = {
    category: { findMany, findUnique },
  } as unknown as PrismaService;
  return { service: new CategoriesService(prisma), findMany, findUnique };
}

describe('CategoriesService', () => {
  describe('findAll', () => {
    it('lists all categories ordered by sortOrder when no filter is given', async () => {
      const { service, findMany } = createService();

      await service.findAll({});

      expect(findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: undefined,
          orderBy: { sortOrder: 'asc' },
        }),
      );
    });

    it('filters to top-level categories when topLevel is true', async () => {
      const { service, findMany } = createService();

      await service.findAll({ topLevel: true });

      expect(findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { parentId: null },
          orderBy: { sortOrder: 'asc' },
        }),
      );
    });
  });

  describe('findBySlug', () => {
    it('returns the category with its subcategories', async () => {
      const boys = {
        id: '1',
        name: 'Boys',
        slug: 'boys',
        imageUrl: null,
        parentId: null,
      };
      const { service, findUnique } = createService([boys]);

      const category = await service.findBySlug('boys');

      expect(findUnique).toHaveBeenCalledWith(
        expect.objectContaining({ where: { slug: 'boys' } }),
      );
      expect(category.slug).toBe('boys');
    });

    it('throws NotFoundException when no category matches', async () => {
      const { service } = createService([]);

      await expect(service.findBySlug('missing')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
