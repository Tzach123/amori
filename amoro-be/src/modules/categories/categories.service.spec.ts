import { describe, expect, it, vi } from 'vitest';
import { CategoriesService } from './categories.service';

function createService(findMany = vi.fn().mockResolvedValue([])) {
  const prisma = { category: { findMany } } as any;
  return { service: new CategoriesService(prisma), findMany };
}

describe('CategoriesService', () => {
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
