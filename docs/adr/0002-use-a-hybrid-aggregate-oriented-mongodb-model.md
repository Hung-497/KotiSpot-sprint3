# Use a hybrid aggregate-oriented MongoDB model

**Status:** Accepted

## Context

Sprint 3 introduces domain state with different ownership, access, growth, query, and lifecycle characteristics. KotiSpot already embeds property-owned values such as features, rental details, image metadata, and current moderation state, while favourites, inquiries, and verification applications use separate collections. A general preference for a “hybrid” model is insufficient unless the boundary between embedding and referencing is explicit.

## Decision Drivers and ASRs

- Domain state and relationships must remain durable and internally consistent (ASR-04).
- Independently protected or cross-user resources require clear authorization and privacy boundaries (ASR-03 and ASR-05).
- Duplicate prevention, deletion behavior, and unavailable related resources must be enforceable (ASR-04 and ASR-07).
- The model must support the API access patterns required by integrated journeys without allowing parent documents to grow without a defined bound (ASR-01).

## Considered Options

1. Model relationships case by case without a documented rule.
2. Use a defined hybrid, aggregate-oriented rule.
3. Store nearly all domain resources in separate collections.

## Decision

KotiSpot will use a hybrid, aggregate-oriented MongoDB model:

- Embed state only when it is bounded, owned exclusively by the parent aggregate, normally read and changed with that parent, and does not require an independent authorization or retention lifecycle.
- Use a separate collection with references when a resource is cross-user, independently authorized, independently queried, potentially unbounded, or has its own lifecycle, audit, retention, or deletion behavior.

Under this rule, property features, rental terms, image-reference metadata, and the listing's current moderation state may remain embedded. Favourites, inquiries, notifications, suspicious-listing reports, verification applications, and support requests are separate referenced resources. Small application preferences may be embedded in the owning user because they are bounded and have no independent access lifecycle.

Storage of AI results and external market data is not decided here because their sources, retention policies, and approved uses remain Product Owner clarifications.

## Rationale

Embedding all Sprint 3 state would make cross-user workflows and independent access control difficult and could create unbounded user or property documents. Separating every value would add queries and relationship management without improving lifecycle control. The explicit hybrid rule retains local atomicity for true aggregate state while giving protected, growing, and independently managed resources clear boundaries.

## Consequences

- Each new persistent resource must be evaluated against the embedding criteria rather than added wherever it is easiest initially.
- Referenced resources need indexes, ownership checks, duplicate rules where applicable, and defined behavior when the related user or property becomes unavailable.
- Cross-document operations may require ordered writes, idempotency, compensation, or transactions when a story requires atomic behavior.
- Current embedded property values and separate favourite, inquiry, and verification collections are directionally consistent with the decision, but their user references must also follow ADR 0001.
- Listing lifecycle status and moderation status remain separate concepts even when the current moderation state is embedded in the listing.

## Traceability

- PBI-05, PBI-08, PBI-10, PBI-13, PBI-16–PBI-18, and PBI-25–PBI-30
- S3-US-04–S3-US-06, S3-US-08, S3-US-10, S3-US-11, and S3-US-18–S3-US-20
- Definition of Done 1–4 and 9

