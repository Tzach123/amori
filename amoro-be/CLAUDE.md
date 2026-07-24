# amoro-be (Backend)

Node.js + TypeScript backend for Amori — the **storefront API** (guest-facing e-commerce). Package manager: yarn.

Admin (product/order management) is a separate system, not part of this project. Do not build admin endpoints, admin auth, or an `admin` module here.

## Status
- [x] Web framework — **NestJS**
- [x] Database / ORM — **PostgreSQL + Prisma**
- [x] Testing framework — **Vitest**
- [x] API style — **REST**
- [x] Auth approach — **guest checkout for MVP**, no customer auth

## Architecture
Modular monolith. No microservices.

Each business domain is a separate module under `modules/`, e.g.:
```
modules/
  products
  categories
  inventory
  cart
  orders
  payments
  users
```

Each module contains:
- controller
- service
- dto
- entities/types
- repository layer (when needed)

### Layer responsibilities
- **Controllers**: HTTP only. No business logic.
- **Services**: Business logic lives here.
- **Database access**: Only through the Prisma service — no direct Prisma Client use outside it.

### Cross-cutting concerns
- **Guards** for authorization.
- **Pipes** for validation.
- **Interceptors** for cross-cutting concerns.
- **Swagger** for API documentation.

Do not over-engineer. Do not introduce microservices.

## API Style
RESTful API.

Rules:
- Resource-oriented endpoints.
- Plural resource names.
- Use proper HTTP methods.
- Version the API using `/api/v1`.
- Consistent response objects.
- Consistent error objects.
- Support pagination for collections.
- Support filtering and sorting through query parameters.
- Use HTTP status codes correctly.
- Protect write operations with authentication and authorization.

## Authentication

Current phase (MVP):
- Customer authentication is **not required**.
- All storefront operations are available to guests.
- Orders are created as guest orders.
- Do not implement customer login, registration, password reset, or JWT auth in the initial version.

Future-ready architecture:
- Design the system to support authenticated customers later.
- Avoid coupling orders to users — the `Customer`/`User` relationship on an order should be optional.

Admin authentication is out of scope for this project entirely — it belongs to the separate admin system (see root `CLAUDE.md`).

## Testing
Stack: **Vitest** for unit and integration tests.

Principles:
- Test business logic.
- Test behavior, not implementation.
- Prefer integration tests over excessive unit tests.
- Do not test framework code.
- Do not test DTOs or simple getters/setters.

Unit tests:
- Services
- Utilities
- Domain logic

Integration tests:
- Controllers
- Database interactions
- Prisma
- Validation
- Authorization

## Error Handling

Goal: a consistent, predictable error mechanism so the frontend can identify the HTTP error type, identify the business error reason, and display the right UX.

Principles:
- Controllers must not manually create error responses.
- Services are responsible for business logic and should throw exceptions.
- A global exception filter handles all exceptions.
- All API errors must follow the same response structure.
- Never expose internal implementation details to clients — no stack traces, database errors, SQL queries, internal service names, or other sensitive information.

Error response contract — all errors return:
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": []
  }
}
```

## Conventions
- Folder/module structure: see Architecture above.

## Env vars
Never read actual `.env*` files. Check `.env.example` for the required variable names/shape.
