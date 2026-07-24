# amoro-fe (Frontend)

React + TypeScript frontend for Amori. Package manager: yarn.

## Status
- [x] Build tool / framework: **Next.js**
- [ ] Styling approach (CSS Modules, Tailwind, styled-components, etc.)
- [ ] Testing framework
- [ ] State management (if any)
- [ ] Routing library (Next.js App Router, unless decided otherwise)

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

## Conventions (fill in once decided)
- File/folder naming: TBD

## Env vars
Never read actual `.env*` files. Check `.env.example` for the required variable names/shape.
