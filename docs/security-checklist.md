# Security Checklist (MVP)

Concrete, checkable criteria derived from `prd.md` §11 (Security). Scope: `amoro-be` (NestJS storefront API) and `amoro-fe`. Admin is a separate system — out of scope here (see root `CLAUDE.md`).

## Payment / PCI scope

- No raw card data (PAN, CVV, expiry) ever touches `amoro-fe` or `amoro-be` — payment is handled entirely by the external processor (PRD §8, §11: "תשלומים יעברו דרך ספק סליקה מאובטח").
- Backend only stores/handles the processor's reference/token (e.g. payment intent ID), never raw payment details.
- Webhook endpoints from the payment processor (if used) verify signatures — reject unsigned/invalid callbacks.

## Input validation & API surface

- Every DTO uses `class-validator` decorators; global `ValidationPipe` rejects unknown/malformed fields (`whitelist: true`, `forbidNonWhitelisted: true`).
- All write endpoints (cart, checkout, order creation) validate quantities, product/variant IDs, and prices are re-derived server-side — client-submitted prices are never trusted.
- Pagination/filter query params on list endpoints are bounded (no unbounded `limit`, no injection via `sort`/`filter` params passed directly to Prisma).

## API hardening

- `helmet` (or equivalent secure headers) enabled globally.
- CORS restricted to the known `amoro-fe` origin(s) — not `*`.
- Rate limiting on write endpoints exposed to guests without auth (cart mutations, checkout, order creation) — guest checkout means no account-based throttling, so IP/session-based limits matter more here than in a typical authed API.
- API versioned under `/api/v1` (already an `amoro-be` convention) — no breaking changes without a version bump.

## Error handling (already partly defined in `amoro-be/CLAUDE.md`)

- Global exception filter is the only place that shapes error responses — no controller/service leaks raw errors to the client.
- Error responses never include stack traces, SQL, Prisma error internals, or internal service/module names.
- Errors follow the documented contract (`{ error: { code, message, details } }`) consistently across all modules.

## Data handling

- Guest orders store only what checkout needs (name, phone, email, shipping address) — no unnecessary PII retention.
- `Customer`/`User` relation on `Order` stays optional (per `amoro-be/CLAUDE.md` — future-ready for auth, not required now).
- No secrets, API keys, or DB credentials committed to the repo — only `.env.example` with placeholder shape (already a repo-wide convention).

## Admin boundary

- No admin-capable endpoint (product create/update, order status change) exists in `amoro-be` — admin is PRD §10 but belongs to the separate, not-yet-built admin system. Flag any admin-shaped endpoint that leaks into the storefront API as a scope violation, not just a security gap.

## Out of scope for MVP (do not flag as missing)

- Customer authentication/authorization (JWT, sessions, login) — explicitly deferred (PRD §12, `amoro-be/CLAUDE.md`).
- Advanced fraud detection, WAF, bot protection — not in MVP scope.

## How to use

Run this checklist against each module/endpoint as it's built. A finding is only valid if it points to a specific violated item above — not a general "could be more secure" note.
