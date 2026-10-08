import { test, expect, type Page } from "@playwright/test";

const CATEGORIES = [
  { id: "cat-1", name: "קולקציית בנות", slug: "girls", imageUrl: null, parentId: null },
  { id: "cat-2", name: "קולקציית בנים", slug: "boys", imageUrl: null, parentId: null },
];

const PRODUCTS = [
  {
    id: "prod-1",
    name: "חולצת קיץ",
    slug: "summer-shirt",
    description: null,
    price: "89",
    imageUrl: null,
    categoryId: "cat-1",
  },
  {
    id: "prod-2",
    name: "מכנסי דנים",
    slug: "denim-pants",
    description: null,
    price: "129",
    imageUrl: null,
    categoryId: "cat-2",
  },
];

async function mockStorefrontApi(page: Page) {
  await page.route("**/api/v1/categories**", (route) =>
    route.fulfill({ json: { data: CATEGORIES } })
  );
  await page.route("**/api/v1/products**", (route) =>
    route.fulfill({ json: { data: PRODUCTS } })
  );
}

test.describe("Homepage browse flow", () => {
  test("shows hero, collections, and featured products", async ({ page }) => {
    await mockStorefrontApi(page);
    await page.goto("/");

    await expect(
      page.getByRole("heading", { level: 1, name: /שטופי שמש/ })
    ).toBeVisible();

    const collections = page.getByTestId("collections-section");
    for (const category of CATEGORIES) {
      const link = collections.getByRole("link", { name: new RegExp(category.name) });
      await expect(link).toBeVisible();
      await expect(link).toHaveAttribute("href", `/collections/${category.slug}`);
    }

    const featured = page.getByTestId("featured-products-section");
    for (const product of PRODUCTS) {
      await expect(featured.getByText(product.name)).toBeVisible();
      const expectedPrice = new Intl.NumberFormat("he-IL", {
        style: "currency",
        currency: "ILS",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(Number(product.price));
      await expect(featured.getByText(expectedPrice)).toBeVisible();
    }

    await expect(page.getByText("AMORI © כל הזכויות שמורות")).toBeVisible();
  });

  test("renders no collections/featured sections when the API returns none", async ({
    page,
  }) => {
    await page.route("**/api/v1/categories**", (route) =>
      route.fulfill({ json: { data: [] } })
    );
    await page.route("**/api/v1/products**", (route) =>
      route.fulfill({ json: { data: [] } })
    );
    await page.goto("/");

    await expect(
      page.getByRole("heading", { level: 1, name: /שטופי שמש/ })
    ).toBeVisible();
    await expect(page.getByTestId("collections-section")).not.toBeAttached();
    await expect(page.getByTestId("featured-products-section")).not.toBeAttached();
  });

  test("mobile menu toggles the navigation links", async ({ page }) => {
    await mockStorefrontApi(page);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    const mobileNav = page.getByTestId("mobile-nav");
    await expect(mobileNav).not.toBeAttached();

    await page.getByRole("button", { name: "פתיחת תפריט" }).click();
    await expect(mobileNav.getByRole("link", { name: "אודות" })).toBeVisible();

    await page.getByRole("button", { name: "סגירת תפריט" }).click();
    await expect(mobileNav).not.toBeAttached();
  });
});
