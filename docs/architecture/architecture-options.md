# KotiSpot Sprint 3 Architecture Options

This document compares the main architecture options that remain open for the finalized Sprint 3 scope. React, Node.js with Express.js, and MongoDB are fixed constraints and are not reconsidered here. Backlog requirements constrain the options; unresolved product policy remains a Product Owner clarification rather than an architecture decision. Every preference below is a preliminary planning proposal, not an accepted decision or Architecture Decision Record.

## Decision: API contract and frontend integration boundary

**Related ASRs**

- ASR-01
- ASR-07
- ASR-09

**Decision boundary**

The backlog fixes integrated frontend/backend behavior, authoritative server data, user-visible failure handling, and API documentation. The open choice is how strongly the client boundary and contract are centralized or formalized.

**Options**

1. **Feature-specific API calls and response handling**
   - **Description:** Each frontend feature calls backend endpoints and interprets responses independently.
   - **Advantages:** Low initial coordination and little shared infrastructure; individual features can start quickly.
   - **Disadvantages:** Duplicates request, authentication, loading, and error logic; encourages inconsistent contracts and makes later changes harder to maintain and test.

2. **Shared API client with documented contract conventions**
   - **Description:** Frontend features use a common request layer, while the team documents consistent identifiers, queries, payloads, status codes, and error shapes for Express endpoints.
   - **Advantages:** Centralizes cross-cutting behavior, reduces duplication, supports consistent errors and authentication, and fits the Sprint 3 documentation requirement with moderate effort.
   - **Disadvantages:** Requires early agreement and careful ownership of the shared layer; contract drift remains possible if documentation and implementation are updated separately.

3. **Machine-readable contract with generated or strongly derived client code**
   - **Description:** A machine-readable API description becomes the contract source for documentation, validation, or generated frontend access code.
   - **Advantages:** Provides strong contract visibility, reduces manual client drift, and can improve testability and documentation quality.
   - **Disadvantages:** Adds specification and generation workflow effort; generated code and tooling may be disproportionate for the remaining Sprint 3 time.

**Trade-offs**

Feature-specific calls minimize initial effort but have the highest consistency and maintenance risk. A machine-readable contract offers the strongest formal alignment but introduces the most process and tooling overhead. A shared client plus documented conventions provides substantial consistency without making contract generation a new delivery dependency.

**Preliminary preference (not an accepted decision)**

Use a shared API client with documented contract conventions. It addresses the immediate integration, error-handling, and documentation needs while keeping Sprint 3 effort manageable.

## Decision: Domain data relationships and lifecycle modeling

**Related ASRs**

- ASR-03
- ASR-04
- ASR-05
- ASR-07

**Decision boundary**

The backlog fixes persistence, ownership, privacy, and the distinction between listing status and moderation status. The open choice is how related resources are grouped or referenced in MongoDB.

**Options**

1. **Primarily embedded documents**
   - **Description:** Favourites, inquiries, notifications, settings, and similar state are stored inside their parent user or property documents where possible.
   - **Advantages:** Related data can often be read with one query, and updates within one document can be atomic and straightforward.
   - **Disadvantages:** Parent documents can grow without clear bounds; cross-user workflows, independent permissions, reporting, and lifecycle changes become difficult.

2. **Primarily separate collections with references**
   - **Description:** Each significant domain resource is stored separately and related through user and property identifiers.
   - **Advantages:** Supports independent lifecycle, access checks, indexing, and growth; fits inquiries, reports, notifications, and support requests well.
   - **Disadvantages:** Requires more queries and relationship checks; consistency and cleanup across references need explicit handling.

3. **Hybrid aggregate-oriented model**
   - **Description:** Small, bounded state that belongs exclusively to one aggregate is embedded, while independently secured, cross-user, or potentially growing resources use separate collections and references.
   - **Advantages:** Balances query simplicity with lifecycle independence, document-size safety, and authorization needs.
   - **Disadvantages:** Requires the team to define consistent embedding criteria; mixed relationship patterns add design and testing work.

**Trade-offs**

Embedding favors local simplicity but performs poorly for unbounded or independently protected workflows. Separate collections provide clearer lifecycle and authorization boundaries at the cost of relationship management. A hybrid model offers the best fit for the varied Sprint 3 data, but only if ownership and deletion rules are documented consistently.

**Preliminary preference (not an accepted decision)**

Use a hybrid aggregate-oriented model. Embed only small, bounded state and keep inquiries, notifications, reports, verification records, and support requests independently addressable where their lifecycle or permissions require it.

## Decision: Authenticated session strategy

**Related ASRs**

- ASR-02
- ASR-03
- ASR-05
- ASR-08

**Unresolved backlog dependency**

S3-US-02 requires authenticated-state establishment, refresh behavior, and logout, but intentionally leaves the session mechanism unresolved. The options below compare mechanisms without deciding that backlog clarification.

**Options**

1. **Server-side session with an opaque browser cookie**
   - **Description:** The browser holds only an opaque session identifier in a protected cookie; usable session state and revocation are controlled by the backend.
   - **Advantages:** Supports immediate logout and revocation, avoids exposing usable credentials to frontend code, and keeps authorization state under server control.
   - **Disadvantages:** Requires persistent session storage, expiration cleanup, cookie and cross-origin configuration, and protection against cross-site request abuse.

2. **Short-lived access token with a protected refresh mechanism**
   - **Description:** The backend issues short-lived access credentials and a separately protected way to renew them.
   - **Advantages:** Limits the lifetime of an exposed access credential and can support independently deployed clients and APIs.
   - **Disadvantages:** Adds refresh rotation, reuse detection, expiry coordination, and logout complexity; both frontend and backend state handling become more involved.

3. **Self-contained token stored and managed by frontend code**
   - **Description:** The frontend stores a self-contained authentication token and sends it with protected requests.
   - **Advantages:** Simple stateless request verification and no server-side session lookup.
   - **Disadvantages:** Browser-script access increases credential-exposure impact; reliable revocation and logout are harder, and long-lived tokens conflict with the required session controls.

**Trade-offs**

Server-side sessions add persistence and cookie-security responsibilities but simplify revocation and keep credentials away from frontend code. A refresh-token design offers flexibility but has the greatest lifecycle complexity. Frontend-managed tokens reduce backend state but create the weakest fit for the security, refresh, and logout requirements.

**Preliminary preference (not an accepted decision)**

Use a server-side session identified by a protected browser cookie. It best matches the required logout, invalidation, server-trusted identity, and limited Sprint 3 complexity.

## Decision: One-time-code challenge lifecycle

**Related ASRs**

- ASR-02
- ASR-05
- ASR-07
- ASR-09

**Fixed backlog requirements**

The code is six digits, expires after 10 minutes, is single-use, is superseded by a resend, and is subject to the committed request and verification-attempt limits. Only a non-readable hash may be persisted. Readable or recoverable code storage is therefore not a valid Sprint 3 option.

**Options**

1. **Single active hashed challenge per normalized email**
   - **Description:** Store one challenge record per normalized email with the current hash, expiry, request-window state, last-send time, and failed-attempt count. A resend atomically replaces the prior hash.
   - **Advantages:** Directly represents supersession, keeps lookup simple, and matches the existing authentication implementation.
   - **Disadvantages:** Concurrent request and verification operations require atomic update rules, and replacement removes detailed challenge history.

2. **Versioned hashed challenge records**
   - **Description:** Store a new hashed challenge record for each request and mark earlier records superseded or inactive.
   - **Advantages:** Preserves lifecycle history and makes each challenge transition explicit.
   - **Disadvantages:** Requires a reliable rule for selecting the only active challenge, more cleanup, and protection against concurrent active records.

3. **Hashed challenge plus separate abuse-control state**
   - **Description:** Keep the active hashed challenge separate from request-window and failed-attempt counters, with both stores updated consistently.
   - **Advantages:** Allows abuse controls to outlive an individual challenge and supports independent expiry policies.
   - **Disadvantages:** Adds coordination between records and increases the risk of inconsistent counters or reset behavior.

**Trade-offs**

All valid options preserve hashed storage and the fixed lifecycle behavior. A single active record is simplest; versioned records improve auditability; separate abuse-control state provides more flexible rate tracking at the cost of coordination complexity.

**Preliminary preference (not an accepted decision)**

Use a single active hashed challenge per normalized email, with atomic supersession and attempt updates. This is the smallest model that represents the fixed requirements and aligns with the current implementation.

## Decision: Email-delivery integration

**Related ASRs**

- ASR-02
- ASR-05
- ASR-06
- ASR-08

**Decision boundary**

The backlog fixes delivery of the one-time code to the submitted email address. Provider selection and synchronous, in-process asynchronous, or durable delivery remain architecture choices.

**Options**

1. **Direct backend delivery through a provider-neutral adapter**
   - **Description:** The authentication request calls an email adapter and reports success only after the external delivery request is accepted.
   - **Advantages:** Small operational footprint, clear request outcome, easy local substitution, and limited Sprint 3 infrastructure.
   - **Disadvantages:** Authentication requests inherit provider latency and availability; retry behavior must avoid sending multiple usable codes.

2. **Asynchronous in-process delivery**
   - **Description:** The backend returns after creating the challenge and initiates email delivery outside the immediate response path within the same running process.
   - **Advantages:** Reduces response latency and avoids additional queue infrastructure.
   - **Disadvantages:** Work can be lost if the process stops; failure reporting and retry visibility are weak, and users may receive a success response before delivery fails.

3. **Durable queued or outbox delivery**
   - **Description:** The backend records a delivery job durably, and a worker or polling process sends and retries email independently.
   - **Advantages:** Provides reliable retry, isolates provider latency, and preserves delivery intent across process restarts.
   - **Disadvantages:** Adds worker lifecycle, job-state, retry, and monitoring complexity that may be excessive for Sprint 3.

**Trade-offs**

Direct delivery has the lowest implementation and operating cost but couples login-request latency to the provider. An in-process background task improves latency without providing durable reliability. A queued or outbox approach is most resilient but introduces a second execution flow and operational burden.

**Preliminary preference (not an accepted decision)**

Use direct backend delivery behind a provider-neutral adapter, with explicit timeout and failure handling. It satisfies the Sprint 3 flow with the least new infrastructure and keeps a future move to durable delivery possible.

## Decision: Authorization policy structure

**Related ASRs**

- ASR-02
- ASR-03
- ASR-04
- ASR-05
- ASR-09

**Decision boundary**

The backlog fixes server-side identity, role, verification, ownership, and administrator enforcement. The open choice is how those policies are organized and reused inside Express.

**Options**

1. **Inline checks in route handlers or controllers**
   - **Description:** Each endpoint performs its own authentication, role, verification, and ownership checks.
   - **Advantages:** Fast to add for a small number of endpoints and keeps the complete flow visible in one function.
   - **Disadvantages:** Duplicates security logic, produces inconsistent responses, makes omissions likely, and is difficult to test comprehensively.

2. **Layered middleware and reusable resource policies**
   - **Description:** Shared middleware establishes identity and broad role requirements, while reusable policies evaluate verification state, ownership, and resource-specific permissions.
   - **Advantages:** Centralizes trust rules, supports consistent denial behavior, remains understandable in Express, and enables focused policy testing.
   - **Disadvantages:** Requires clear separation between route, resource-loading, and policy responsibilities; poorly ordered middleware can be confusing.

3. **Central policy engine or authorization service**
   - **Description:** All permission decisions are expressed in and evaluated by a dedicated policy subsystem.
   - **Advantages:** Provides a single policy model and can scale to complex permissions and auditing.
   - **Disadvantages:** Adds a new abstraction, policy language or data model, and integration boundary beyond the complexity of the current Sprint scope.

**Trade-offs**

Inline checks minimize setup but maximize security inconsistency and maintenance risk. A dedicated policy engine provides the strongest centralization but has high development and learning cost. Layered middleware and reusable policies balance consistent server enforcement with the current application's scale.

**Preliminary preference (not an accepted decision)**

Use layered middleware and reusable resource policies. This keeps server-side identity, roles, verification, ownership, and administrative checks consistent without introducing a separate authorization subsystem.

## Decision: Validation and error contract

**Related ASRs**

- ASR-01
- ASR-03
- ASR-04
- ASR-07
- ASR-09

**Decision boundary**

The backlog fixes backend enforcement of validation and safe, user-visible failure behavior. The open choice is the degree of error-envelope standardization and schema sharing across frontend and backend.

**Options**

1. **Independent feature-level validation and error formats**
   - **Description:** Each frontend form and backend endpoint defines its own validation rules and error response shape.
   - **Advantages:** Minimal shared setup and maximum local flexibility.
   - **Disadvantages:** Rules and messages drift, client handling becomes repetitive, and access, validation, and unexpected failures are difficult to distinguish consistently.

2. **Backend-authoritative validation with a standard error envelope**
   - **Description:** The backend owns security and data-validity rules, frontend validation provides immediate usability feedback, and all endpoints return a documented error structure.
   - **Advantages:** Preserves the server trust boundary, gives the frontend predictable failure data, supports field errors and recovery, and needs moderate coordination.
   - **Disadvantages:** Some rules are represented twice for user experience; keeping client hints aligned with backend rules still requires discipline.

3. **Shared validation schemas across frontend and backend**
   - **Description:** Common schemas define compatible request validation for both sides, with backend-only rules layered on top.
   - **Advantages:** Reduces duplicated structural rules and can improve contract consistency and test reuse.
   - **Disadvantages:** Couples client and server release structure, adds shared-package or generation workflow, and cannot eliminate server-only authorization and persistence validation.

**Trade-offs**

Independent validation is cheapest initially but conflicts with the cross-cutting consistency requirement. Shared schemas reduce structural drift but introduce tighter build and release coupling. Backend-authoritative validation with a standard envelope maintains the security boundary and gives predictable client behavior without requiring shared-code infrastructure.

**Preliminary preference (not an accepted decision)**

Use backend-authoritative validation with a documented standard error envelope and focused frontend validation for usability. This provides consistent recovery and error handling while keeping the backend authoritative.

## Decision: Map integration boundary

**Related ASRs**

- ASR-01
- ASR-05
- ASR-06
- ASR-07
- ASR-08

**Fixed backlog requirements and unresolved input**

S3-US-09 requires an interactive property map synchronized with discovery results, safe behavior when coordinates are absent, and protection against unnecessarily precise public locations. The backlog does not yet decide how coordinates are obtained, where they are persisted, how public precision is derived, or the exact API shape by which the frontend receives them.

**Options**

1. **Persist supplied coordinates and expose a public map projection**
   - **Description:** Coordinates enter with imported or managed property data, are validated and persisted with the property, and are converted to an approved public precision in backend responses. The React map renders those public coordinates.
   - **Advantages:** Avoids runtime geocoding, makes map results deterministic, and gives the backend an explicit privacy boundary.
   - **Disadvantages:** Requires a trusted coordinate source and a workflow for correcting missing or inaccurate coordinates.

2. **Backend geocoding during property creation or update**
   - **Description:** The backend sends the property address to an approved geocoding service, persists normalized coordinates, derives a public-precision value, and returns only that public value to the frontend map.
   - **Advantages:** Centralizes credentials, quota control, normalization, persistence, and privacy transformation while keeping map reads fast.
   - **Disadvantages:** Listing changes inherit geocoding latency and failure modes; address disclosure, retry behavior, and coordinate corrections require explicit rules.

3. **Backend geocoding on demand with bounded caching**
   - **Description:** The backend resolves coordinates when map data is requested, caches or persists a privacy-safe result, and returns that result through the property-map API.
   - **Advantages:** Avoids blocking listing creation and can fill coordinates for existing records without a separate migration.
   - **Disadvantages:** Map requests inherit geocoding latency and availability until cached; concurrent requests, quota use, cache freshness, and persistent ownership of the derived data become more complex.

**Trade-offs**

All three options keep the interactive map in React and send map-ready coordinates through the KotiSpot backend. They differ in coordinate source, time of acquisition, persistence, and failure behavior. Public-precision transformation is required in every option but its exact rule remains unresolved.

**Preliminary preference (not an accepted decision)**

Use a client-rendered interactive map with backend-supplied, privacy-reviewed coordinates. Prefer acquisition and persistence during property creation or update if the approved data source supports it; otherwise evaluate on-demand geocoding. The coordinate source and public-precision rule remain unresolved.

## Decision: Market-data acquisition and caching

**Related ASRs**

- ASR-01
- ASR-04
- ASR-05
- ASR-06
- ASR-07
- ASR-08

**Unresolved product dependency**

The approved market-data source, supported regions, property types, and time periods remain product clarifications in S3-US-15. The options below compare integration architecture only after those inputs are approved.

**Options**

1. **Direct frontend access to the market-data source**
   - **Description:** The dashboard queries the external data source from the browser.
   - **Advantages:** Lowest backend development effort and potentially current data with no KotiSpot cache.
   - **Disadvantages:** Exposes source details or client credentials, inherits browser cross-origin limits, weakens normalization and quota control, and couples the UI directly to the source contract.

2. **Backend gateway with normalization and bounded caching**
   - **Description:** The backend queries the approved source, converts responses into a KotiSpot contract, and temporarily caches reusable results.
   - **Advantages:** Protects credentials, stabilizes the frontend contract, centralizes provenance and error handling, reduces repeated external requests, and supports both dashboard and AI-related consumers.
   - **Disadvantages:** Adds cache-expiry decisions, backend load, and the possibility of serving slightly stale data.

3. **Scheduled ingestion into MongoDB**
   - **Description:** Market data is imported on a schedule and the application reads a locally stored historical dataset.
   - **Advantages:** Provides predictable availability and query behavior, reduces runtime dependence on the source, and supports repeatable AI inputs.
   - **Disadvantages:** Requires ingestion jobs, source-change handling, storage planning, freshness monitoring, and potentially broader data-use rights.

**Trade-offs**

Direct browser access has the lowest server effort but the weakest privacy, contract stability, and quota control. Scheduled ingestion provides the strongest runtime independence but creates a data pipeline beyond the dashboard itself. A backend gateway with bounded caching balances freshness, resilience, source protection, and Sprint 3 effort.

**Preliminary preference (not an accepted decision)**

Use a backend gateway that normalizes approved market data and applies bounded caching. It gives the dashboard and AI features a stable internal contract without requiring a full ingestion pipeline during Sprint 3.

## Decision: AI integration boundary and execution model

**Related ASRs**

- ASR-01
- ASR-03
- ASR-05
- ASR-06
- ASR-07
- ASR-08
- ASR-09

**Unresolved product dependencies**

The permitted property fields, market and historical data sources, AI capability, prediction horizon, data-retention policy, and exact rate limits remain clarifications in S3-US-16 and S3-US-17. The options below do not decide those policies.

**Options**

1. **Synchronous backend gateway to an approved AI capability**
   - **Description:** An authenticated backend operation verifies role and ownership, selects the permitted input, calls the approved AI capability, validates the response, and returns a bounded result.
   - **Advantages:** Centralizes authorization, privacy, input minimization, rate control, fallback behavior, and output validation; fits a request-response user journey.
   - **Disadvantages:** Requests inherit external latency and timeouts; long inference can consume backend capacity and require careful user-facing pending states.

2. **Asynchronous backend AI job workflow**
   - **Description:** The backend creates a protected job, performs inference separately, stores status and result, and lets the frontend poll or receive completion later.
   - **Advantages:** Handles slow or retryable work reliably, avoids long HTTP requests, and provides explicit job status.
   - **Disadvantages:** Adds job persistence, worker execution, polling or notification behavior, cleanup, and more complex authorization over stored results.

3. **Backend-hosted inference**
   - **Description:** KotiSpot runs an approved model within the backend runtime or behind a separately controlled internal inference service; the backend still enforces authorization and minimizes inputs.
   - **Advantages:** Provides greater control over data exposure, model versioning, and availability than an external provider.
   - **Disadvantages:** Adds model packaging, compute, operational monitoring, update, and validation responsibilities that may exceed Sprint 3 capacity.

**Trade-offs**

All valid options keep authorization, ownership checks, input minimization, and output validation behind the backend. An asynchronous workflow is strongest for long-running or retryable inference but has significant operational complexity. Backend-hosted inference gives more data and model control but creates an operational model-serving responsibility. A synchronous gateway provides the required control with fewer new moving parts if response time remains acceptable after the service is selected.

**Preliminary preference (not an accepted decision)**

Use a synchronous backend AI gateway with strict authorization, input minimization, output validation, timeout handling, and safe fallback. Revisit asynchronous jobs only if evaluation of the approved service shows that inference duration or retry needs make request-response execution unreliable.

## Decision: Deployment topology and runtime configuration

**Related ASRs**

- ASR-01
- ASR-02
- ASR-05
- ASR-06
- ASR-08

**Decision boundary**

The backlog fixes deployment readiness, safe runtime configuration, documentation, and secret separation. The open choice is the deployment topology and its cross-origin and release boundaries.

**Options**

1. **Single application origin for built frontend and API**
   - **Description:** One deployed backend runtime serves the production frontend assets and the API from the same origin, while MongoDB and external services remain separately configured dependencies.
   - **Advantages:** Simplifies cookie behavior, cross-origin policy, API base configuration, deployment coordination, and local reproduction.
   - **Disadvantages:** Couples frontend and backend releases and scaling; a backend outage also prevents delivery of frontend assets.

2. **Separate frontend and backend deployments**
   - **Description:** The frontend is deployed as static assets and connects to a separately deployed API through environment-specific configuration.
   - **Advantages:** Allows independent deployment, caching, and scaling, and matches common static-frontend hosting models.
   - **Disadvantages:** Requires explicit cross-origin, cookie, API URL, and coordinated environment configuration; failures can arise from mismatched deployments.

3. **Containerized multi-service deployment**
   - **Description:** Frontend delivery, backend API, and any workers are packaged and deployed as separate managed services with explicit networking and configuration.
   - **Advantages:** Provides reproducible service boundaries and room for independent scaling or background work.
   - **Disadvantages:** Adds packaging, networking, orchestration, operational documentation, and troubleshooting effort beyond current needs.

**Trade-offs**

A single origin minimizes configuration and authentication integration risk but couples releases. Separate deployments improve independence while increasing cross-origin and environment complexity. A multi-service topology is the most extensible but has the highest operational cost and is unnecessary without confirmed worker or scaling needs.

**Preliminary preference (not an accepted decision)**

Use a single application origin for the built frontend and API for Sprint 3. It reduces authentication and configuration risk and provides the shortest path to a demonstrable deployment; environment variables must still isolate all secrets and external settings.

## Decision: Verification and testing strategy

**Related ASRs**

- ASR-01
- ASR-02
- ASR-03
- ASR-04
- ASR-05
- ASR-06
- ASR-07
- ASR-08
- ASR-09

**Fixed requirements and current baseline**

The Definition of Done requires testing of important success and failure paths, passing applicable backend tests, frontend linting, and a production build, plus responsive and accessibility checks. The repository has backend automated tests but no frontend test runner. Neither frontend automated tests nor browser end-to-end tests are committed Sprint requirements unless the course or team explicitly adds them.

**Options**

1. **Existing automated backend tests with manual integrated frontend checks**
   - **Description:** Extend the existing backend tests for critical API behavior, use frontend lint and production-build checks, and verify integrated browser journeys, accessibility, and responsive behavior manually.
   - **Advantages:** Satisfies the documented baseline without introducing a new frontend test toolchain and concentrates automation on server trust boundaries.
   - **Disadvantages:** Manual frontend checks are less repeatable and provide weaker regression protection for interaction behavior.

2. **Add focused frontend behavior tests**
   - **Description:** Keep the baseline and introduce a frontend test runner for selected forms, states, and interactions without adding full browser automation.
   - **Advantages:** Improves repeatability for client behavior and failure states while remaining faster and more focused than browser end-to-end tests.
   - **Disadvantages:** Adds an uncommitted toolchain, setup effort, test-environment decisions, and maintenance work.

3. **Add focused browser end-to-end smoke tests**
   - **Description:** Keep the baseline and add a small automated browser suite for a few critical integrated journeys such as authentication and protected listing management.
   - **Advantages:** Exercises frontend, API, persistence, and authentication together through realistic user paths.
   - **Disadvantages:** Adds browser tooling, environment orchestration, test-data isolation, runtime cost, and maintenance beyond the current committed requirements.

**Trade-offs**

The existing baseline has the lowest adoption cost and matches the current repository and Definition of Done, but it leaves frontend regression coverage manual. Frontend behavior tests or browser smoke tests may improve repeatability, but either would be an explicit additional tooling and scope decision.

**Preliminary preference (not an accepted decision)**

Retain the existing backend-test, frontend-lint/build, and manual integrated-check baseline for committed Sprint work. Consider focused frontend behavior tests or browser smoke tests only if the course or team explicitly adopts the added tooling and maintenance scope.
