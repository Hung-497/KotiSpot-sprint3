# Enforce authorization with layered middleware and resource policies

**Status:** Accepted

## Context

The current Express routes do not establish authenticated identity or consistently enforce roles, verification state, ownership, or administrator permissions. Several endpoints accept acting-user or ownership identifiers from URL parameters or request data. Sprint 3 expands these rules across listings, favourites, profiles, preferences, notifications, verification, moderation, reports, support data, and private AI operations.

## Decision Drivers and ASRs

- The backend must derive acting identity and role from verified authentication state (ASR-02 and ASR-03).
- Role, verification, ownership, and administrator rules must be applied consistently at the server boundary (ASR-03).
- Private data and resource existence must not leak through inconsistent access behavior (ASR-05 and ASR-07).
- Important access outcomes must be independently testable (ASR-09).

## Considered Options

1. Implement authentication and permission checks independently inside each controller.
2. Use layered authentication middleware, broad permission gates, and reusable resource policies.
3. Introduce a dedicated authorization service or policy engine.

## Decision

Express will use layered middleware and reusable resource policies:

1. Authentication middleware validates the session and establishes the acting user from server-controlled state.
2. Broad gates enforce requirements such as administrator role or verified seller/agent status where they do not depend on a particular resource.
3. Resource loading resolves the target using canonical identifiers.
4. A reusable resource policy evaluates ownership and resource-specific permissions before the controller performs the operation.

Controllers may coordinate authorized application behavior, but they must not re-create identity, role, verification, or ownership rules ad hoc. The frontend may hide unavailable controls and render access states, but it is not an authorization boundary.

## Rationale

Inline checks have low initial setup cost but make omissions and inconsistent denial behavior likely across the Sprint 3 surface. A policy engine would add a new policy model and integration boundary without corresponding permission complexity. Layered middleware and resource policies retain normal Express composition while making trust rules reusable and testable.

## Consequences

- Routes must declare their authentication and broad permission requirements explicitly.
- Acting-user IDs supplied by clients must not override authenticated identity; ADR 0001 supplies the canonical user identifier.
- Ownership checks must use loaded persistent resources rather than untrusted request data.
- Middleware ordering and the choice between forbidden and not-found responses must be documented and tested so protected resource existence is not exposed accidentally.
- Shared policies require focused tests for unauthenticated, forbidden, verification, ownership, and administrator paths.
- The session mechanism is intentionally not fixed by this ADR; it remains a provisional decision pending the separate session policy and possible course guidance.

## Traceability

- PBI-07, PBI-08, PBI-10, PBI-12, PBI-13, PBI-16–PBI-18, and PBI-23–PBI-30
- S3-US-03, S3-US-04, S3-US-06, S3-US-08, S3-US-10, S3-US-11, and S3-US-16–S3-US-20
- Definition of Done 2–4

