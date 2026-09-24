# Use MongoDB ObjectIds for user relationships

**Status:** Accepted

## Context

KotiSpot currently has two incompatible user-identity schemes. Authentication creates and returns users by MongoDB `_id`, while listing ownership, favourites, and verification records use optional numeric `userId`, `ownerId`, and `reviewedBy` values. A newly authenticated account is not guaranteed to have a numeric ID, so it cannot reliably participate in those relationships without a second identity-allocation mechanism.

## Decision Drivers and ASRs

- Authenticated identity, ownership, and roles must be derived and enforced by the backend (ASR-02 and ASR-03).
- Persisted relationships must remain coherent across user, listing, favourite, and verification workflows (ASR-04).
- API identifiers must be consistent and documented (ASR-01).
- The design should not add a race-sensitive sequential-ID allocator without a requirement for externally meaningful numeric IDs.

## Considered Options

1. Standardize user relationships on MongoDB ObjectIds.
2. Retain numeric user IDs and add race-safe allocation for every new account.
3. Use ObjectIds internally while preserving numeric IDs as legacy aliases.

## Decision

MongoDB ObjectIds are the canonical identifiers for users and user relationships. Models, persisted references, API contracts, fixtures, and tests that currently use numeric user IDs will migrate to ObjectId references.

Protected operations will normally derive the acting user's ObjectId from the authenticated server-side session rather than accept an acting user ID from the client. Endpoints that legitimately identify another user, such as an authorized administrative operation, will use the canonical ObjectId explicitly.

## Rationale

ObjectIds already identify authenticated users and properties. Standardizing user references removes an unnecessary translation layer, avoids introducing a new ID-allocation subsystem, and makes ownership checks align directly with authenticated identity. No finalized Sprint 3 requirement or documented external consumer requires numeric user IDs.

## Consequences

- `userId`, `ownerId`, and reviewer relationships that identify users must become ObjectId references to the user collection.
- Existing development data, fixtures, tests, routes, and response contracts using numeric IDs require migration or replacement.
- Client-supplied acting-user IDs must be removed from protected workflows; this ADR does not remove legitimate target-resource identifiers.
- Numeric user IDs are not maintained as compatibility aliases unless a later external requirement creates a new decision.
- Property identifiers remain MongoDB ObjectIds, so property links and user links follow the same identifier representation even though they reference different collections.

## Traceability

- PBI-06, PBI-07, PBI-08, PBI-10, PBI-13, PBI-27, PBI-28, and PBI-30
- S3-US-02, S3-US-03, S3-US-04, S3-US-06, S3-US-08, S3-US-18, and S3-US-20
- Definition of Done 1, 2, 3, and 9

