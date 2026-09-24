# Use logical deletion for listings

**Status:** Accepted

## Context

The current backend physically deletes property documents. Sprint 3 also requires favourites, inquiries, notifications, suspicious-listing reports, and moderation workflows to retain safe fallback behavior when related content is deleted or unavailable. Physical deletion would either leave dangling references without context or require identifying listing data to be copied into every related resource.

## Decision Drivers and ASRs

- Deleted listings must disappear from public discovery and listing management while related workflows remain coherent (ASR-04 and ASR-07).
- Inquiry, report, moderation, and notification information has independent authorization and lifecycle requirements (ASR-03 and ASR-05).
- Related resources must handle unavailable content without corrupting their owning workflow (ASR-04).
- The decision must align with the separate-collection boundaries established by ADR 0002.

## Considered Options

1. Physically delete listings and tolerate or clean up related references.
2. Logically delete listings and retain a restricted tombstone.
3. Physically delete listings while copying identifying snapshots into every related resource.

## Decision

Deleting a listing will logically delete it by recording a server-controlled deletion timestamp. A logically deleted listing is excluded from public discovery and ordinary owner listing-management results and cannot receive new inquiries, favourites, reports, or other new activity.

Existing authorized workflows that reference the listing may resolve only the minimum retained context needed to display an unavailable-listing fallback or complete an administrative responsibility. Logical deletion must not make the listing publicly accessible or grant broader access to its retained data.

Physical purge timing and any legally or operationally required retention period remain a Product Owner and deployment-policy clarification. This ADR does not authorize indefinite retention.

## Rationale

A restricted tombstone preserves referential context for independently stored Sprint 3 workflows while immediately removing the listing from active use. Hard deletion would make the required fallback behavior and safety review harder, whereas copying snapshots into every related collection would duplicate private data and create consistency problems.

## Consequences

- The property model requires a deletion marker such as `deletedAt`, controlled only by the backend.
- Every public, owner, map, comparison, favourite, inquiry, and reporting query must apply the appropriate deletion scope; omission could expose deleted content.
- New activity against a logically deleted listing must be rejected.
- Administrative access to retained context must be explicit, minimized, and authorized.
- Existing related resources remain independently governed; deleting a listing does not automatically delete inquiries, notifications, reports, or moderation evidence.
- A later purge policy must define what is removed or anonymized and how dependent records behave afterward.

## Traceability

- PBI-05, PBI-10, PBI-13, and PBI-16–PBI-19
- S3-US-04–S3-US-06 and S3-US-08–S3-US-12
- Definition of Done 1–4

