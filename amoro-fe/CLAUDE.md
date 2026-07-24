# amoro-fe (Frontend)

React + TypeScript frontend for Amori. Package manager: yarn.

## Status
- [x] Build tool / framework: **Next.js**
- [x] Styling approach: **Tailwind CSS + shadcn/ui**, design tokens as CSS variables
- [x] Testing framework: **Playwright** (E2E), **Vitest** (unit), **React Testing Library** (component)
- [x] State management: **TanStack Query** (server state), **Zustand** (global client state), React local state (component-only) — no Redux
- [x] Routing library: **Next.js App Router** (no separate routing library)

## Folder structure

Guiding principle: **routing belongs to `app`, page composition belongs to `screens`, business domain belongs to `features`, reusable UI belongs to `components`, business logic belongs to `services`, HTTP communication belongs to `api`.**

| Layer | Responsibility |
|---|---|
| `app` | Navigation |
| `screens` | Page composition |
| `features` | Business domain |
| `components` | Reusable UI |
| `services` | Business logic |
| `api` | HTTP communication |

Feature-based architecture. `app/` is routing only (App Router) — no business logic there. Each feature under `features/<feature-name>/` is self-contained; top-level `components/`, `hooks/`, `services/`, etc. are for generic, cross-feature code only.

Create folders/files only when there's an actual need for them — do not scaffold empty directories ahead of time.

```
src/
│
├── app/                        # Next.js routing only
│   ├── (public)/
│   │   ├── page.tsx
│   │   └── ...
│   │
│   ├── (private)/
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   └── ...
│   │
│   ├── layout.tsx
│   ├── loading.tsx
│   ├── error.tsx
│   └── not-found.tsx
│
├── features/
│   ├── <feature-name>/
│   │   ├── screens/
│   │   │   ├── ListScreen.tsx
│   │   │   ├── DetailsScreen.tsx
│   │   │   └── EditScreen.tsx
│   │   │
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── api/
│   │   ├── services/
│   │   ├── types/
│   │   ├── schemas/
│   │   ├── constants/
│   │   ├── utils/
│   │   └── index.ts
│   │
│   └── ...
│
├── components/                 # generic UI only
├── hooks/                      # generic hooks only
├── providers/
├── lib/
├── services/                   # global services
├── utils/
├── constants/
├── config/
├── types/
├── styles/
│
└── middleware.ts
```

## Design system

- **Tailwind CSS** for styling.
- **shadcn/ui** for components.
- Design tokens (colors, spacing, radius, typography) live as **CSS variables** and are the only source of these values.
- No random/magic values — no arbitrary Tailwind values (e.g. `mt-[13px]`, `text-[#1a2b3c]`) and no hardcoded hex/px outside the token set. Always reference a token.

## Testing

Goal: make sure users can complete critical flows, catch UI breakage, and avoid spending time on tests that don't add value. Not aiming for coverage numbers.

Stack:
- **Playwright** → E2E
- **Vitest** → unit tests
- **React Testing Library** → component tests

Principles:
- Test user behavior, not implementation details.
- Prioritize business-critical flows.
- Do not create tests only for coverage.

### Mandatory E2E flows

Store:
- Browse products
- View product details
- Add product to cart
- Checkout flow

Admin:
- Login
- Create product
- Edit product
- Publish product

### Component tests

Use for: forms, interactive components, components with complex state.
Avoid testing simple presentational components.

### Unit tests

Use for: pure functions, calculations, data transformations.

## State management

- **TanStack Query** for all server state.
- **Zustand** only for global client state.
- React local state for component-only state.
- **React Hook Form** for forms.

Do not use Redux. Do not duplicate server data inside client stores.

Examples:
- Products → TanStack Query
- Orders → TanStack Query
- Modal visibility → local state
- Forms → React Hook Form

## Conventions (fill in once decided)
- File/folder naming: TBD

## Env vars
Never read actual `.env*` files. Check `.env.example` for the required variable names/shape.
