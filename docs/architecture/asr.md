# KotiSpot Sprint 3 Architecturally Significant Requirements

This document identifies the Architecturally Significant Requirements (ASRs) in the finalized Sprint 3 scope. The authoritative requirements are in `sprint-3-backlog-and-user-stories.md`. React, Node.js with Express.js, and MongoDB are established delivery constraints. These ASRs describe architectural consequences without selecting an architecture option, implementation technique, or external provider.

| ID | ASR | Main Sources | Priority |
| --- | --- | --- | --- |
| ASR-01 | Integrated application interfaces and contracts | Selected integration stories; PBI-01–PBI-05, PBI-08, PBI-10, PBI-13, PBI-18, PBI-28–PBI-30; DoD 1 and 9 | Critical |
| ASR-02 | Passwordless authentication and session lifecycle | Authentication Planning Decision; PBI-06; S3-US-02; S3-US-20; DoD 2–4 and 10 | Critical |
| ASR-03 | Role, permission, and ownership enforcement | PBI-07 and PBI-12; S3-US-03 and protected-resource stories; DoD 2 and 4 | Critical |
| ASR-04 | Durable domain state and data integrity | Persistence requirements in S3-US-01, S3-US-04–S3-US-06, S3-US-08, S3-US-10, S3-US-11, and S3-US-18–S3-US-20; DoD 1–2 | High |
| ASR-05 | Privacy and sensitive-data protection | PBI-12; privacy requirements across S3-US-02, S3-US-05, S3-US-08–S3-US-11, and S3-US-15–S3-US-20; DoD 2–3 and 10 | Critical |
| ASR-06 | External-service and external-data resilience | S3-US-02, S3-US-09, and S3-US-15–S3-US-17; related product clarifications; DoD 3–4 and 9–10 | High |
| ASR-07 | Validation, failure handling, and recoverability | PBI-12; validation and failure-state requirements across the selected stories; DoD 2–4 and 7 | High |
| ASR-08 | Deployable and safely configurable system | Sprint Goal; external-service stories; DoD 8–10 | High |
| ASR-09 | Testability, accessibility, and responsive quality | PBI-11 and PBI-12; user-visible state requirements; DoD 1 and 4–8 | High |

### ASR-01: Integrated application interfaces and contracts

**Requirement**

The system must support complete client-to-server journeys through consistent, documented application interfaces. Interface contracts must define identifiers, queries, request and response data, authentication expectations, validation behavior, errors, and environment-specific connection information. Completed journeys must use authoritative server data rather than client-only mock state.

**Source**

- PBI-01–PBI-05, PBI-08, PBI-10, PBI-13, PBI-18, and PBI-28–PBI-30
- S3-US-01, S3-US-04–S3-US-06, S3-US-08–S3-US-11, S3-US-15, and S3-US-18–S3-US-20
- Definition of Done 1 and 9

**Why architecturally significant**

The contract is the boundary between the frontend, backend, persistence, and external integrations. Inconsistency at this boundary would affect most selected user journeys and make independent development, integration, testing, and deployment unreliable.

**Architectural concerns**

- Client-server boundaries
- API contracts and documentation
- Resource identifiers and query semantics
- Request and response validation
- Authentication and error semantics
- Compatibility across environments

**Priority**

Critical

**Dependencies**

- ASR-02 authentication state
- ASR-03 authorization rules
- ASR-04 persistent domain state
- Agreed environment configuration

### ASR-02: Passwordless authentication and session lifecycle

**Requirement**

The system must support registration and login using a one-time email code. It must normalize the email identity, deliver a six-digit code, persist only a hash of the code, enforce the committed expiry, resend, supersession, single-use, and attempt-limit behavior, create or retrieve the account, establish authenticated state, preserve that state according to the selected session strategy, and invalidate or clear it on logout.

**Source**

- Planning Decision: passwordless authentication by expiring, single-use email code
- PBI-06 and S3-US-02
- S3-US-20 email-change verification requirement
- S3-US-02 session-strategy product clarification
- Definition of Done 2–4 and 10

**Why architecturally significant**

Authentication establishes the trusted user identity used by every protected feature. Its lifecycle crosses the frontend, backend, persistence, email delivery, security boundaries, and runtime configuration.

**Architectural concerns**

- Hashed authentication-challenge lifecycle and abuse resistance
- Session state, persistence, refresh, and invalidation
- Client authentication state
- Credential and secret protection
- Authentication failure behavior

**Priority**

Critical

**Dependencies**

- External email-delivery capability
- Persistent user and authentication-challenge state
- Unresolved authenticated-session strategy
- ASR-01 application contracts
- ASR-08 secure runtime configuration

### ASR-03: Role, permission, and ownership enforcement

**Requirement**

The system must authorize protected operations using a verified server-side identity and enforce role, verification status, resource ownership, and administrative permissions at the server boundary. Client-visible controls must reflect permissions without becoming the source of authorization.

**Source**

- PBI-07 and the authorization portion of PBI-12
- S3-US-03
- Ownership and privacy rules in S3-US-04, S3-US-06, S3-US-08, S3-US-10, S3-US-11, and S3-US-16–S3-US-20
- Definition of Done 2 and 4

**Why architecturally significant**

Authorization applies across listings, administration, verification, reports, notifications, AI results, settings, support requests, and profiles. It determines trust boundaries and must be enforced consistently across interfaces and stored resources.

**Architectural concerns**

- Trust boundaries
- Role and verification-state rules
- Resource ownership
- Administrative access
- Protected client journeys
- Forbidden and unauthenticated responses

**Priority**

Critical

**Dependencies**

- ASR-02 verified identity and session state
- ASR-04 ownership and role data
- ASR-01 authenticated interface contracts

### ASR-04: Durable domain state and data integrity

**Requirement**

The system must persist and consistently relate the domain state required by the selected Sprint 3 journeys, including users, properties, sale and rental details, favourites, inquiries, listing ownership and listing status, verification decisions, moderation status and reports, notifications, application preferences, support requests, and profiles. State changes must survive refresh and later sessions, preserve valid relationships, prevent invalid duplicates where specified, and handle unavailable or removed related data without corrupting the owning workflow.

**Source**

- S3-US-01, S3-US-04–S3-US-06, S3-US-08, S3-US-10, S3-US-11, and S3-US-18–S3-US-20
- Planning Decision distinguishing committed image references and metadata from optional PBI-09 file storage
- Definition of Done 1–2

**Why architecturally significant**

These journeys share identities, ownership, resource references, lifecycle states, and privacy rules. Their correctness depends on coherent data boundaries and durable state transitions rather than isolated page behavior.

**Architectural concerns**

- Domain data boundaries
- Persistent relationships and identifiers
- Ownership and lifecycle state
- Separate listing-status and moderation-status lifecycles
- Data validation and integrity
- Duplicate prevention
- Removed or unavailable related resources

**Priority**

High

**Dependencies**

- MongoDB persistence capability
- ASR-01 application contracts
- ASR-02 authenticated identity
- ASR-03 authorization rules

### ASR-05: Privacy and sensitive-data protection

**Requirement**

The system must protect private user, authentication, inquiry, verification, report, notification, support, profile, listing, location, and AI-related data throughout storage, logging, application interfaces, public views, and transfers to external capabilities. Only necessary data may cross a trust boundary, and secrets or private data must not appear in public responses or diagnostic output.

**Source**

- PBI-12
- Privacy requirements in S3-US-02, S3-US-05, S3-US-08–S3-US-11, and S3-US-15–S3-US-20
- S3-US-09 coordinate-source, persistence, and public-precision clarification
- Definition of Done 2–3 and 10

**Why architecturally significant**

Private data crosses multiple system and external-service boundaries. Its classification and permitted flows constrain interfaces, storage access, logging, authorization, configuration, and failure handling across the application.

**Architectural concerns**

- Data classification and minimization
- Public and private response boundaries
- Secret and credential handling
- Logging and diagnostic output
- External data transfer
- Location and personal-data exposure

**Priority**

Critical

**Dependencies**

- ASR-02 authentication
- ASR-03 authorization
- ASR-04 persistent data boundaries
- External-service privacy constraints
- ASR-08 secure configuration

### ASR-06: External-service and external-data resilience

**Requirement**

The system must integrate with the external capabilities required for email delivery, property mapping, approved market data, AI-assisted price estimation, and AI-assisted future-price prediction. Each integration must protect private data and provide safe, user-visible behavior for unavailability, insufficient data, invalid output, and applicable rate limits. Market and AI results must expose the source, limitations, or uncertainty required by their stories.

**Source**

- S3-US-02, S3-US-09, and S3-US-15–S3-US-17
- Product clarifications for map coordinates, market data, AI services, permitted inputs, retention, and rate limits
- Definition of Done 3–4 and 9–10

**Why architecturally significant**

These capabilities cross system ownership boundaries and introduce independent data contracts, availability, latency, privacy, cost, and failure characteristics. Their behavior affects user journeys and deployment configuration.

**Architectural concerns**

- External interface boundaries
- Source approval and provenance
- Availability and degraded behavior
- Invalid or insufficient data
- Rate limits and cost constraints
- Privacy and data minimization
- User-visible uncertainty and disclaimers

**Priority**

High

**Dependencies**

- Email-delivery capability
- Mapping capability and coordinate policy
- Approved aggregated and historical market-data sources
- Approved AI inference capabilities
- ASR-05 privacy controls
- ASR-08 external-service configuration

### ASR-07: Validation, failure handling, and recoverability

**Requirement**

The system must validate inputs at trust boundaries and provide consistent, safe, and understandable handling for loading, empty, invalid, unauthenticated, forbidden, missing-resource, duplicate, unavailable-service, and unexpected-failure conditions. When a story requires preservation of entered data, a recoverable failure must not discard that data. Failures must not expose sensitive technical information.

**Source**

- PBI-12
- Validation and failure-state requirements in S3-US-01, S3-US-02, S3-US-04–S3-US-06, and S3-US-08–S3-US-20
- Definition of Done 2–4 and 7

**Why architecturally significant**

Validation and failure behavior span the frontend, backend, persistence, and external capabilities. A consistent model is necessary to avoid contradictory state, unsafe disclosure, lost user input, and brittle feature-specific handling.

**Architectural concerns**

- Validation boundaries
- Error classification and propagation
- Client request and view state
- Duplicate and repeated submissions
- Degraded external-service behavior
- Safe diagnostic responses
- Recovery and preservation of user input

**Priority**

High

**Dependencies**

- ASR-01 error contracts
- ASR-02 and ASR-03 access-failure semantics
- ASR-04 integrity rules
- ASR-06 external-service failure conditions

### ASR-08: Deployable and safely configurable system

**Requirement**

The system must be deployable or deployment-ready with documented, environment-specific configuration for application interfaces, allowed origins, data access, authentication, email, maps, market data, and AI capabilities. Sensitive configuration must remain outside committed source, and the frontend production build, frontend lint checks, and applicable backend tests must pass before release.

**Source**

- Sprint Goal
- Configuration consequences of S3-US-02, S3-US-09, and S3-US-15–S3-US-17
- Definition of Done 8–10

**Why architecturally significant**

Runtime configuration connects every application and external boundary. Deployment readiness constrains how configuration, secrets, origins, builds, documentation, and environment differences are handled across the system.

**Architectural concerns**

- Environment-specific configuration
- Secret separation
- Cross-origin policy
- External-service configuration
- Build and release verification
- Deployment and operational documentation

**Priority**

High

**Dependencies**

- Runtime hosting environment
- MongoDB connectivity
- External capabilities in ASR-06
- ASR-01 environment-specific interface information
- ASR-05 secret-protection requirements

### ASR-09: Testability, accessibility, and responsive quality

**Requirement**

The system must support repeatable verification of important success, validation, access-control, persistence, integration, and failure paths. Applicable backend tests must pass, and frontend lint and production-build checks must pass. The implemented journeys must remain usable across representative mobile, tablet, and desktop widths and through the keyboard and accessible interface semantics defined by the Definition of Done. The backlog does not require a frontend automated-test runner or browser end-to-end suite unless the team or course requirements explicitly add one.

**Source**

- PBI-11 and the quality portion of PBI-12, both cross-cutting through the Definition of Done
- User-visible state requirements across the selected stories
- Definition of Done 1 and 4–8

**Why architecturally significant**

Testability and inclusive client behavior constrain system boundaries, state visibility, interface consistency, and frontend composition. They determine whether integrated behavior and release readiness can be verified rather than inferred.

**Architectural concerns**

- Automated backend and integration verification
- Manual or optionally automated frontend-flow verification
- Deterministic success and failure behavior
- Test data and state isolation
- Responsive layout behavior
- Keyboard operation and focus behavior
- Accessible names, labels, contrast, and alternatives

**Priority**

High

**Dependencies**

- Existing backend test configuration and representative test data
- Stable contracts from ASR-01
- Observable access outcomes from ASR-02 and ASR-03
- Predictable state and failure behavior from ASR-04 and ASR-07
