# Amori — Kids' Clothing Brand Monorepo

## Structure
- `amoro-fe/` — React + TypeScript frontend. See `amoro-fe/CLAUDE.md`.
- `amoro-be/` — Node.js + TypeScript backend. See `amoro-be/CLAUDE.md`.

Each project is developed and run independently unless noted otherwise (no confirmed workspace linkage yet).

## Conventions
- Package manager: **yarn** in both projects (not npm/pnpm).
- Language: TypeScript everywhere.
- Env vars: never read or assume the contents of real `.env*` files. Use each project's `.env.example` to see the required variable names/shape, and ask the user for actual values when needed.
- Commit messages: use Conventional Commits format (`feat:`, `fix:`, `chore:`, `refactor:`, `docs:`, `test:`, etc.).

## Working style
- This project is developed "vibe coding" style: prefer small, direct changes.
- Avoid premature abstraction or inventing framework/architecture decisions that haven't been made yet.
- Frontend stack is settled — see `amoro-fe/CLAUDE.md`. Backend framework/testing/styling are not yet made — check the relevant sub-project CLAUDE.md before assuming a stack.

## Open decisions
Update the relevant sub-project CLAUDE.md as these are settled:
- ~~Frontend build tool, styling, testing, state management, routing~~ → settled (see `amoro-fe/CLAUDE.md`)
- Backend framework (Express / Fastify / NestJS / other)
- Testing framework(s) for backend
- Whether the repo uses yarn workspaces or two independent yarn projects
