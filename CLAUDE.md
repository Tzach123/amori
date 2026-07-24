# Amori — Kids' Clothing Brand Monorepo

## Structure
- `amoro-fe/` — React + TypeScript frontend (storefront). See `amoro-fe/CLAUDE.md`.
- `amoro-be/` — Node.js + TypeScript backend (storefront API). See `amoro-be/CLAUDE.md`.
- `docs/prd.md` — Product Requirements Document (MVP scope, out-of-scope, future roadmap).

Admin (product/order management, per PRD §10) is its own separate system — a distinct project/service from `amoro-be`'s storefront API, with its own auth. Not yet built; folder/name TBD when work starts.

Each project is developed and run independently — two separate yarn projects, no yarn workspaces or shared root `package.json`.

## Conventions
- Package manager: **yarn** in both projects (not npm/pnpm).
- Language: TypeScript everywhere.
- Env vars: never read or assume the contents of real `.env*` files. Use each project's `.env.example` to see the required variable names/shape, and ask the user for actual values when needed.
- Commit messages: use Conventional Commits format (`feat:`, `fix:`, `chore:`, `refactor:`, `docs:`, `test:`, etc.).

## Working style
- This project is developed "vibe coding" style: prefer small, direct changes.
- Avoid premature abstraction or inventing framework/architecture decisions that haven't been made yet.
- Frontend and backend stacks are both settled — see `amoro-fe/CLAUDE.md` and `amoro-be/CLAUDE.md`.

## Open decisions
None currently — all structural decisions are settled.
