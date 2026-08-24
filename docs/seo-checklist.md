# SEO Checklist (MVP)

Concrete, checkable criteria derived from `prd.md` §11 (SEO). Scope: `amoro-fe` (Next.js App Router) storefront pages only — no admin.

## Per-page metadata

Every page type below must set (via Next.js Metadata API — `generateMetadata` for dynamic routes):

| Page | Title | Description | OG image | Canonical |
|---|---|---|---|---|
| Homepage | ✅ brand + tagline | ✅ | ✅ hero image | `/` |
| Collection (e.g. Boys/Girls) | ✅ collection name + brand | ✅ dynamic, from collection data | ✅ collection cover | `/collections/[slug]` |
| Product Listing (category) | ✅ category name + brand | ✅ | ✅ category/first product image | `/categories/[slug]` |
| Product Page | ✅ product name + brand | ✅ from product description | ✅ primary product image | `/products/[slug]` |
| Cart / Checkout | `noindex` (not indexable — no SEO value) | — | — | — |

Rules:
- No duplicate `<title>` across pages — each dynamic page's title must include the entity name (product/collection), not a generic template alone.
- No missing/empty `description` on any indexable page.
- Every indexable page sets a canonical `<link>` pointing to itself (prevents duplicate-content issues from query params like `?sort=` or `?filter=`).

## Structured data (JSON-LD)

- **Product pages**: `Product` schema — name, image, description, offers (price, currency, availability).
- **Homepage**: `Organization` schema (brand name, logo, social links).
- Validate with a structured-data testing tool before considering a page type "done."

## Technical SEO

- `robots.txt` present at root, allows crawling of storefront routes, disallows cart/checkout.
- `sitemap.xml` auto-generated (Next.js `sitemap.ts`), includes all published products/collections, excludes cart/checkout.
- URLs are human-readable slugs (`/products/kids-summer-dress`, not `/products/123`) — per PRD "URLs ידידותיים."
- No orphan pages: every product/collection reachable via on-site navigation (not sitemap-only).
- Images use `next/image` with descriptive `alt` text (product name at minimum) — also an accessibility requirement.

## Performance (Core Web Vitals — feeds both SEO and PRD §11 Performance)

- LCP (homepage hero, product images) — target < 2.5s.
- Images optimized/served via `next/image` (already required by fe conventions).
- No layout shift from unsized images/fonts (CLS target < 0.1).

## Out of scope for MVP (do not flag as missing)

- Multi-language / hreflang (single-locale Hebrew site for MVP).
- Blog/content marketing pages (not in PRD scope).
- AI-driven search or personalized SEO (explicitly out of scope, PRD §12).

## How to use

Run this checklist against each page type once its route exists. A finding is only valid if it points to a specific missing/wrong item above — not a general "could be better" note.
