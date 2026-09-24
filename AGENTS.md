## Agent skills

### Issue tracker

Issues are tracked as local Markdown files under `.scratch/`. See `docs/agents/issue-tracker.md`.

### Domain docs

This repository uses a single-context domain documentation layout. See `docs/agents/domain.md`.

### Skill routing

Use the installed repository skills for their named workflows: `grill-with-docs` for unresolved requirements, `to-spec` for a settled local specification, `to-tickets` for approved ticket decomposition, `implement` for a well-specified ticket, `tdd` when test-first work is requested, and `code-review` for a diff against a user-supplied fixed point. Follow each skill's own instructions; do not reproduce its workflow in project files.

## Project

KotiSpot is a Sprint 3 real-estate application with two independently managed JavaScript packages:

- `frontend/`: React 19, Vite, React Router with `HashRouter`, and CSS/Tailwind tooling.
- `backend/`: Express 5, Mongoose, MongoDB, and Vitest/Supertest. Backend modules use CommonJS.

There is no root package script or workspace runner. Run commands from the package they belong to and preserve each package's existing module style and lockfile.

## Sprint 3 source of truth

`sprint-3-backlog-and-user-stories.md` is authoritative for Sprint 3 scope, acceptance criteria, planning decisions, deferred or optional PBIs, and the Definition of Done.

Before changing Sprint 3 behavior:

1. Read the relevant story, related PBIs, acceptance criteria, product clarifications, and applicable Definition of Done items.
2. Read the local spec or ticket under `.scratch/` when the work originated there.
3. Inspect only the relevant implementation, tests, and supporting documentation.

Do not implement a deferred or optional PBI as committed Sprint scope. Do not resolve a `Needs product clarification` item by guessing; use the applicable planning skill or ask for the missing decision. Preserve story IDs, owners, and estimates unless the task is explicitly to revise the backlog.

Existing code shows the starting point, not the intended final behavior. The frontend's `frontend/data.js` imports and state held only in `App.jsx` are prototype remnants; a feature is not integrated merely because it works with that data or survives client-side navigation. Completed integrated stories must use the backend and MongoDB where the backlog requires persistence.

Files under `docs/architecture/` are supporting analysis. In particular, preferred options in `architecture-options.md` are proposals, not accepted decisions or additional requirements. If supporting documentation conflicts with the finalized backlog, follow the backlog and surface the conflict.

## Repository boundaries

- Keep frontend UI and view state in `frontend/`; keep API, authorization, validation, persistence, and external-service boundaries in `backend/`.
- Reuse the existing route/controller/model organization and existing React page/component conventions unless an approved spec requires a change.
- Treat the backend as authoritative for authenticated identity, roles, verification state, ownership, protected data, and persisted validation. Hiding a frontend control is not authorization.
- Do not trust client-supplied user IDs, roles, ownership, or verification status when they can be derived from authenticated server state.
- Property identifiers are currently MongoDB object IDs, while existing user-related records use numeric `userId` values. Inspect all consumers before changing identifier shapes or relationships.
- Keep listing lifecycle status (`active`, `inactive`, `sold`, `rented`) separate from moderation status (`unreviewed`, `flagged`, `approved`, `removed`).
- Preserve explicit loading, empty, unauthenticated, forbidden, validation, not-found, and server-error states required by the story being implemented.
- Prefer the smallest focused change that satisfies the current ticket or story. Avoid unrelated refactors, new dependencies, and speculative abstractions.

## Verification

Use the narrowest checks that cover the change:

- Backend tests: `cd backend && npm test`
- Frontend lint: `cd frontend && npm run lint`
- Frontend production build: `cd frontend && npm run build`

The frontend currently has no test script. Do not claim frontend automated-test coverage unless a test runner and relevant tests actually exist. Add or update focused tests for important backend success, validation, authentication, authorization, ownership, and failure behavior when the change warrants regression coverage.

Before reporting completion, check the relevant acceptance criteria and Definition of Done items, state which checks ran, and disclose any check that could not run.

## Safety and documentation

Use `backend/.env.example` to document configuration names. Never commit, print, or copy values from `.env`; do not commit dependency directories, build output, or generated artifacts.

Update API, runtime-configuration, or project documentation when the implemented interface or setup changes. Keep detailed requirements in the backlog, specifications, and tickets rather than duplicating them in this file.
