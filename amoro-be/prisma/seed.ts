import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // sortOrder is set so that, in the RTL grid, "בנות" renders in the right
  // column and "בנים" in the left column — matching docs/mockups/homepage.jpeg.
  const girls = await prisma.category.upsert({
    where: { slug: 'girls' },
    update: { sortOrder: 2 },
    create: {
      name: 'בנות',
      slug: 'girls',
      sortOrder: 2,
    },
  });

  const boys = await prisma.category.upsert({
    where: { slug: 'boys' },
    update: { sortOrder: 1 },
    create: {
      name: 'בנים',
      slug: 'boys',
      sortOrder: 1,
    },
  });

  // sortOrder ascends right-to-left (rule above) so the featured-products
  // row reads, left-to-right, in the same order as the mockup: girls items
  // first, then boys items.
  const products = [
    {
      name: 'שמלת בלון',
      slug: 'girls-balloon-dress',
      price: 129.9,
      categoryId: girls.id,
      isFeatured: true,
      sortOrder: 9,
    },
    {
      name: 'מכנס בלון משובץ',
      slug: 'girls-checked-balloon-shorts',
      price: 79.9,
      categoryId: girls.id,
      isFeatured: true,
      sortOrder: 8,
    },
    {
      name: 'גופיית כתף אחת',
      slug: 'girls-one-shoulder-top',
      price: 69.9,
      categoryId: girls.id,
      isFeatured: true,
      sortOrder: 7,
    },
    {
      name: 'אוברול ג׳ינס פסים עם לבבות',
      slug: 'girls-striped-denim-overall',
      price: 149.9,
      categoryId: girls.id,
      isFeatured: true,
      sortOrder: 6,
    },
    {
      name: 'מכנס כנים',
      slug: 'boys-striped-pants',
      price: 89.9,
      categoryId: boys.id,
      isFeatured: true,
      sortOrder: 5,
    },
    {
      name: 'חולצת רגל',
      slug: 'boys-raglan-shirt',
      price: 69.9,
      categoryId: boys.id,
      isFeatured: true,
      sortOrder: 4,
    },
    {
      name: 'סט פולו ירוק',
      slug: 'boys-green-polo-set',
      price: 119.9,
      categoryId: boys.id,
      isFeatured: true,
      sortOrder: 3,
    },
    {
      name: 'סט פולו פסים תכלת ולבן',
      slug: 'boys-blue-striped-polo-set',
      price: 119.9,
      categoryId: boys.id,
      isFeatured: true,
      sortOrder: 2,
    },
    {
      name: 'מכנס ג׳ינס בלון',
      slug: 'boys-denim-balloon-shorts',
      price: 84.9,
      categoryId: boys.id,
      isFeatured: true,
      sortOrder: 1,
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: { sortOrder: product.sortOrder },
      create: product,
    });
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
