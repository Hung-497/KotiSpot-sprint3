# Isolate external services behind backend adapters

**Status:** Accepted

## Context

Sprint 3 depends on email delivery, mapping, approved market data, and approved AI capabilities. These integrations have different credentials, data contracts, privacy exposure, availability, latency, quotas, and failure modes. Direct feature-level provider integration would couple KotiSpot contracts to external services and could expose secrets or private inputs in the browser.

## Decision Drivers and ASRs

- External interfaces must expose stable KotiSpot contracts and safe degraded behavior (ASR-01, ASR-06, and ASR-07).
- Credentials, private user data, exact locations, and unnecessary AI inputs must remain protected (ASR-05).
- External configuration and secrets must remain environment-specific and outside committed source (ASR-08).
- Providers and unresolved product policies must be replaceable without restructuring feature controllers or frontend journeys.

## Considered Options

1. Integrate providers directly from individual frontend features.
2. Place secret-bearing and private-data integrations behind provider-neutral backend adapters, while permitting a constrained browser map renderer.
3. Build a generalized external-integration or background-job platform.

## Decision

Email delivery, geocoding when required, market-data acquisition, and AI inference will be invoked through provider-neutral backend adapters. Application services or controllers will depend on KotiSpot-owned interfaces and normalized results rather than provider response formats.

The React map may contact an approved browser map or tile service when client-side rendering requires it, but it may receive only public, restricted configuration and backend-supplied privacy-safe map data. Secret credentials, private coordinates, private account data, and unapproved property inputs must not be exposed to the browser or provider.

Each adapter boundary must define timeout behavior, safe error mapping, configuration, and any approved input minimization. Caching, retries, durable queues, retention, and provider-specific rate handling are decided only when required by the approved source and product policy.

## Rationale

Backend adapters centralize credential protection, privacy controls, normalization, and failure behavior while avoiding a generalized integration platform that Sprint 3 has not justified. The constrained map exception recognizes that interactive tile rendering normally occurs in the browser without allowing the frontend to become the authority for private property location data.

## Consequences

- Frontend components consume KotiSpot API contracts rather than email, market-data, geocoding, or AI provider contracts.
- Provider replacement is localized, but adapters require explicit contract tests or controlled test doubles.
- Public browser map keys, if required, must be restricted according to the approved provider and documented as non-secret configuration.
- This decision does not authorize a provider, data source, property field, coordinate precision, retention rule, rate limit, prediction horizon, or caching period.
- Direct email delivery, bounded caching, or synchronous AI calls may be chosen later if supported by approved service characteristics; durable jobs remain an option if those characteristics require them.

## Traceability

- PBI-06, PBI-15, and PBI-22–PBI-24
- S3-US-02, S3-US-09, and S3-US-15–S3-US-17
- Definition of Done 3, 4, 9, and 10

