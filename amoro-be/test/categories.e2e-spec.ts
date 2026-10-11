import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { AppModule } from '../src/app.module';
import { AllExceptionsFilter } from '../src/common/filters/all-exceptions.filter';
import type { CategoryResponseDto } from '../src/modules/categories/dto/category-response.dto';

interface CategoriesListBody {
  data: CategoryResponseDto[];
}

interface ApiErrorBody {
  error: { code: string; message: string; details: unknown[] };
}

describe('Categories (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );
    app.useGlobalFilters(new AllExceptionsFilter());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api/v1/categories returns all seeded categories, boys before girls by sortOrder', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/v1/categories')
      .expect(200);
    const body = response.body as CategoriesListBody;

    expect(body.data.length).toBeGreaterThanOrEqual(2);
    const slugs = body.data.map((category) => category.slug);
    expect(slugs).toEqual(expect.arrayContaining(['boys', 'girls']));
    // seed.ts sets boys.sortOrder=1, girls.sortOrder=2 — asc order puts boys first.
    expect(slugs.indexOf('boys')).toBeLessThan(slugs.indexOf('girls'));
  });

  it('GET /api/v1/categories?topLevel=true returns only categories without a parent', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/v1/categories')
      .query({ topLevel: true })
      .expect(200);
    const body = response.body as CategoriesListBody;

    expect(body.data.length).toBeGreaterThan(0);
    for (const category of body.data) {
      expect(category.parentId).toBeNull();
    }
  });

  it('GET /api/v1/categories rejects an unknown query param', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/v1/categories')
      .query({ notARealFilter: 'x' })
      .expect(400);
    const body = response.body as ApiErrorBody;

    expect(body.error.code).toBeDefined();
    expect(body.error).not.toHaveProperty('stack');
  });
});
