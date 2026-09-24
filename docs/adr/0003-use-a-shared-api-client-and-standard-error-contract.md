# Use a shared API client and standard error contract

**Status:** Accepted

## Context

Sprint 3 requires integrated React-to-Express journeys and documented API behavior. The frontend currently has no shared API access layer, while backend controllers return independently constructed responses, usually with only a `message` property. Continuing feature by feature would duplicate request handling and prevent the client from reliably distinguishing validation, authentication, authorization, conflict, missing-resource, external-service, and unexpected failures.

## Decision Drivers and ASRs

- Frontend and backend interfaces must use consistent identifiers, payloads, authentication expectations, and errors (ASR-01).
- Recoverable validation and failure states must remain distinguishable and actionable (ASR-07).
- Authentication and authorization failures must not be confused with ordinary validation or missing data (ASR-02 and ASR-03).
- The boundary must remain testable without adding a disproportionate contract-generation workflow during Sprint 3 (ASR-09).

## Considered Options

1. Feature-specific frontend requests, validation, and response handling.
2. A shared frontend API client, maintained endpoint documentation, backend-authoritative validation, and a standard error envelope.
3. A machine-readable contract with shared or generated client and validation code.

## Decision

Frontend features will use a shared API client for base-URL configuration, authenticated request behavior, JSON handling, and normalized failures. Express endpoints will follow documented conventions for resource identifiers, queries, request and response bodies, HTTP status codes, and error behavior.

Errors with a response body will use this conceptual envelope:

```json
{
  "error": {
    "code": "stable_machine_readable_code",
    "message": "Safe user-facing summary",
    "fieldErrors": {
      "fieldName": "Field-specific explanation"
    }
  }
}
```

`fieldErrors` is optional and is used only when failures apply to specific fields. Error codes are stable contract values; messages may be improved without becoming control-flow identifiers. The backend remains authoritative for security, authorization, persistence, and data-validity rules. Frontend validation may duplicate safe structural checks to give immediate feedback but cannot replace server validation.

The maintained API documentation is the Sprint 3 contract record. OpenAPI, client generation, and shared executable schemas are not required by this decision.

## Rationale

A shared client and standard envelope provide most of the consistency and recovery benefits needed by the selected stories without introducing a shared-package or generation pipeline. Feature-specific handling would entrench incompatible behavior across a large integration surface. A machine-readable contract remains possible later but is additional tooling rather than a current requirement.

## Consequences

- Existing `{ message }` responses must migrate to the standard envelope as their endpoints are integrated.
- The shared client must preserve HTTP status and normalized error details rather than reduce every failure to a generic message.
- API documentation must be updated when an interface changes.
- Frontend features must present explicit loading, empty, validation, unauthenticated, forbidden, not-found, external-service, and unexpected-error states where their stories require them.
- Successful resource payloads may remain resource-specific; this ADR standardizes cross-cutting request and error behavior rather than forcing all success responses into one envelope.
- Adding OpenAPI or shared schemas later would be a separate tooling decision, not a contradiction of this ADR.

## Traceability

- PBI-01–PBI-08, PBI-10, PBI-13, PBI-15–PBI-20, and PBI-22–PBI-30
- S3-US-01–S3-US-06, S3-US-08–S3-US-20
- Definition of Done 1–4 and 9

