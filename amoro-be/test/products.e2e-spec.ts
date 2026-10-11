import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { AppModule } from '../src/app.module';
import { AllExceptionsFilter } from '../src/common/filters/all-exceptions.filter';
import type { CategoryResponseDto } from '../src/modules/categories/dto/category-response.dto';
import type { ProductResponseDto } from '../src/modules/products/dto/product-response.dto';

interface CategoriesListBody {
  data: CategoryResponseDto[];
}

interface ProductsListBody {
  data: ProductResponseDto[];
}

interface ApiErrorBody {
  error: { code: string; message: string; details: unknown[] };
}

describe('Products (e2e)', () => {
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

  it('GET /api/v1/products returns seeded products, defaulting the limit to 20', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/v1/products')
      .expect(200);
    const body = response.body as ProductsListBody;

    expect(body.data.length).toBeGreaterThan(0);
    expect(body.data.length).toBeLessThanOrEqual(20);
  });

  it('GET /api/v1/products?limit=1 caps the number of results returned', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/v1/products')
      .query({ limit: 1 })
      .expect(200);
    const body = response.body as ProductsListBody;

    expect(body.data).toHaveLength(1);
  });

  it('GET /api/v1/products?categorySlug=boys only returns products in that category', async () => {
    const categoriesResponse = await request(app.getHttpServer())
      .get('/api/v1/categories')
      .expect(200);
    const categoriesBody = categoriesResponse.body as CategoriesListBody;
    const boysCategory = categoriesBody.data.find(
      (category) => category.slug === 'boys',
    );
    expect(boysCategory).toBeDefined();

    const response = await request(app.getHttpServer())
      .get('/api/v1/products')
      .query({ categorySlug: 'boys' })
      .expect(200);
    const body = response.body as ProductsListBody;

    expect(body.data.length).toBeGreaterThan(0);
    for (const product of body.data) {
      expect(product.categoryId).toBe(boysCategory?.id);
    }
  });

  it('GET /api/v1/products rejects a limit above the allowed maximum', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/v1/products')
      .query({ limit: 101 })
      .expect(400);
    const body = response.body as ApiErrorBody;

    expect(body.error.code).toBeDefined();
    expect(body.error).not.toHaveProperty('stack');
  });
});
