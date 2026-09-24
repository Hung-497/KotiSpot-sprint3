# Sprint 3 Backlog and User Stories

**Product:** KotiSpot Real-Estate Platform<br>
**Course deadline:** 7 October 2026

## Sprint Goal

Deliver an integrated KotiSpot application that uses persisted backend data for secure authentication, core property discovery, user interaction, and seller or agent listing-management workflows. The result should support reliable end-to-end use across the React frontend, Express API, and MongoDB database.

## Planning Decisions

- Authentication is passwordless. A visitor registers or logs in with an expiring, single-use code sent to their email address.
- Arranging a property viewing is part of an inquiry to the seller or agent; it is not a separate workflow.
- Property images use the existing image references and metadata in the committed Sprint 3 scope. File upload and storage remain optional future work under PBI-09.
- Listing analytics (PBI-21) and the AI-assisted support chatbot (PBI-31) remain in the Product Backlog and are not selected for Sprint 3.
- Suspicious-listing moderation has an existing foundation: the backend already supports flagged listings and moderation reasons. User report submission and frontend integration remain in Sprint 3.
- S3-US-07 is no longer a standalone user story. PBI-11 and the cross-cutting quality requirements from PBI-12 are covered by the Definition of Done; S3-US-03 retains the role, permission, and ownership requirements from PBI-12.

## Product Backlog Reference

This reference lists Product Backlog Items selected for, deferred from, or otherwise relevant to Sprint 3.

| PBI | Product Backlog Item | Sprint 3 Status |
| --- | --- | --- |
| PBI-01 | Browse active properties for sale or rent | Selected |
| PBI-02 | View complete property details | Selected |
| PBI-03 | Search properties by location or keyword | Selected |
| PBI-04 | Filter and sort properties | Selected |
| PBI-05 | Contact a seller or agent, including arranging a viewing | Selected |
| PBI-06 | Sign up and log in | Selected |
| PBI-07 | User roles and permissions | Selected |
| PBI-08 | Create a property listing for sale or rent | Selected |
| PBI-09 | Upload and manage property images | Optional future work |
| PBI-10 | Edit, deactivate, and delete property listings | Selected |
| PBI-11 | Responsive and accessible interface | Selected — cross-cutting through Definition of Done |
| PBI-12 | Security, validation, and error handling | Selected — cross-cutting and S3-US-03 |
| PBI-13 | Save favourite properties | Selected |
| PBI-15 | Display properties on a map | Selected |
| PBI-16 | Admin listing moderation | Selected |
| PBI-17 | Report suspicious listings | Selected |
| PBI-18 | Inquiry notifications | Selected |
| PBI-19 | Compare selected properties | Selected |
| PBI-20 | Mortgage and affordability calculator | Selected |
| PBI-21 | Listing analytics for sellers and agents | Deferred |
| PBI-22 | Real-estate market dashboard | Selected |
| PBI-23 | AI property-price estimate | Selected |
| PBI-24 | AI future property-price prediction | Selected |
| PBI-25 | View rental-specific terms | Selected |
| PBI-26 | Manage rental-specific terms | Selected |
| PBI-27 | Verify seller and agent accounts | Selected |
| PBI-28 | Manage account settings | Selected |
| PBI-29 | Contact KotiSpot support | Selected |
| PBI-30 | View and update profile information | Selected |
| PBI-31 | AI-assisted support chatbot | Deferred |

## Sprint Summary

| Category | Stories | Points |
| --- | ---: | ---: |
| Identity & Account Management | 4 | 23 |
| Property Discovery & Decision Tools | 5 | 37 |
| Engagement & Communication | 4 | 14 |
| Listing Management & Platform Safety | 3 | 16 |
| AI Property Intelligence | 2 | 16 |
| **Total** | **18** | **106** |

The total excludes the removed 8-point S3-US-07 and deferred PBI-21 and PBI-31. The estimates for S3-US-16 and S3-US-17 remain preliminary until the team confirms the data sources and technical approach.

## 1. Identity & Account Management

### S3-US-02: Register and log in with a one-time email code

**Related PBI:** PBI-06<br>
**Story points:** 8<br>
**Primary owners:** Eric (backend auth) and Albaraae (frontend auth)

As a visitor,<br>
I want to register or log in with a one-time code sent to my email,<br>
so that I can access my account without a password.

**Acceptance Criteria**

- A visitor can request a code by submitting a valid email address; the system trims the address, normalizes it to lowercase, and sends the code only to that address.
- The code contains six digits, expires after 10 minutes, works once, and is stored as a hash rather than readable text.
- Requesting a new code invalidates the earlier unused code for the same email address.
- The system enforces a 60-second resend cooldown, permits no more than five code requests per 10-minute window, and rejects a code after five failed verification attempts.
- A valid code creates a basic account when the email is new or authenticates the existing account when the email is already registered.
- Invalid, expired, used, or superseded codes return an error that does not reveal whether an account exists.
- Successful verification establishes the authenticated state; refresh and logout follow the documented session design without creating a false authenticated state.

**Needs product clarification:** Which authenticated-session mechanism will Sprint 3 use, and what persistence and invalidation behavior must it provide?

### S3-US-03: Enforce role, permission, and ownership rules

**Related PBIs:** PBI-07, PBI-12<br>
**Story points:** 5<br>
**Primary owners:** Hung (authorization) and Albaraae (protected UI)

As an authenticated user,<br>
I want access to be limited by my role and ownership,<br>
so that protected data and actions are available only to authorized users.

**Acceptance Criteria**

- The backend derives the acting user and role from verified authentication data rather than a client-supplied user ID or role.
- Protected endpoints reject missing or invalid authentication, and reject authenticated users who lack the required role.
- Listing-management actions require a verified seller or agent, and a seller or agent can change only listings they own.
- Verification and moderation actions require the administrator role.
- The interface hides unavailable actions and presents clear login-required and forbidden states, while backend authorization remains the security boundary.

### S3-US-18: Manage application preferences

**Related PBI:** PBI-28<br>
**Story points:** 5<br>
**Primary owners:** Albaraae (frontend) and Hung (backend)

As an authenticated user,<br>
I want to manage my application preferences,<br>
so that KotiSpot behaves according to my choices.

**Acceptance Criteria**

- A user can retrieve and update their theme preference as light, dark, or system.
- A user can enable or disable email notifications, marketing emails, and SMS notifications.
- Saved preferences persist in MongoDB and remain active after refresh and later login.
- Invalid preference names or values are rejected without changing the last saved preferences.
- A successful update returns and displays the saved values.
- A user cannot retrieve or change another user's preferences.
- Account information and profile fields are not edited through settings.

### S3-US-20: View and update profile information

**Related PBI:** PBI-30<br>
**Story points:** 5<br>
**Primary owners:** Albaraae (frontend) and Hung (backend)

As an authenticated user,<br>
I want to view and update my profile information,<br>
so that my account details remain accurate.

**Acceptance Criteria**

- A user can retrieve only their own private profile unless an explicitly authorized role is granted access.
- The profile displays the persisted email, first name, last name, phone number, biography, role, and verification status.
- A user can update first name, last name, phone number, and biography; successful changes persist in MongoDB and remain visible after refresh.
- Validation errors identify the affected field and leave the previously saved profile unchanged.
- Role and verification status are visible but cannot be changed by the user.
- A new email address does not become active until it has been verified through the one-time email-code process.
- Theme and communication preferences are managed only through S3-US-18.

**Needs product clarification:** Should postal code, location, and profile image from the frontend prototype become persisted profile fields? The persisted user data does not define them; conversely, biography is persisted but is not shown in the prototype.

## 2. Property Discovery & Decision Tools

### S3-US-01: Discover sale and rental properties

**Related PBIs:** PBI-01, PBI-02, PBI-03, PBI-04, PBI-25<br>
**Story points:** 8<br>
**Primary owners:** Albaraae (frontend) and Eric (backend/API)

As a buyer or renter,<br>
I want to browse, search, filter, sort, and inspect current properties,<br>
so that I can find a suitable home.

**Acceptance Criteria**

**Browse and search**

- Property discovery uses properties with an active listing status and approved moderation status from the backend instead of the static frontend dataset.
- Users can browse sale and rental listings and open the matching details page by its backend property identifier.
- Keyword search trims input, ignores letter case, searches title, description, city, and address, and can be limited to sale or rental listings.

**Filter and sort**

- Users can combine filters for listing type, property type and subtype, city, currency, price, rooms, bedrooms, bathrooms, size, balcony, elevator, parking, furnished status, pet allowance, and sauna.
- Users can sort results by ascending price, descending price, or newest listing, and can clear all active filters.
- Invalid search, filter, or sort values produce a visible validation error rather than an unfiltered result presented as valid.

**Property details and states**

- Property details display the available title, description, listing purpose, property type and subtype, price and currency, city, address, postal code, room counts, size, features, and image-reference data without failing when an optional field is absent.
- Rental listings show monthly rent, availability date, minimum rental period, and available optional rental terms; sale listings do not show rental-only fields.
- Loading, empty-result, unavailable-property, invalid-identifier, not-found, and server-error states each produce a distinct user-facing state.

### S3-US-09: Explore properties on a map

**Related PBI:** PBI-15<br>
**Story points:** 8<br>
**Primary owners:** Trung (frontend) and Eric (location/API)

As a buyer or renter,<br>
I want to view available properties on a map,<br>
so that I can understand their locations and explore suitable areas.

**Acceptance Criteria**

- Properties with an active listing status, approved moderation status, and valid coordinates appear as markers using backend property data.
- Selecting a marker identifies the property, distinguishes a sale price from monthly rent, and links to the matching property details page.
- When the list and map appear together, selecting or focusing a property card highlights its marker.
- Search and filter changes update both the result list and displayed markers.
- A property with missing or invalid coordinates remains available in the result list and does not prevent the map from loading.
- Public map data does not expose private or unnecessarily precise location information.
- Map-service failure and no-result states leave the property list usable and explain why the map is unavailable or empty.

**Needs product clarification:** How will property coordinates be obtained, persisted, and reduced to an approved public precision? Persisted property records do not yet define coordinate fields.

### S3-US-12: Compare selected properties

**Related PBI:** PBI-19<br>
**Story points:** 5<br>
**Primary owners:** Albaraae (frontend) and Eric (data/API)

As a buyer or renter,<br>
I want to compare selected properties,<br>
so that I can understand their important differences.

**Acceptance Criteria**

- A user can add available properties to a comparison up to a documented maximum and remove any selected property.
- The same property cannot appear more than once.
- The comparison displays price, listing purpose, location, property type, size, bedrooms, and available rental terms side by side.
- Sale prices and monthly rents use distinct labels and are not presented as equivalent values.
- Missing optional values use a consistent placeholder, while deleted or unavailable properties are identified without breaking the comparison.

**Needs product clarification:** What is the maximum number of properties that a user may compare at once?

### S3-US-13: Estimate mortgage costs and affordability

**Related PBI:** PBI-20<br>
**Story points:** 8<br>
**Primary owners:** Albaraae (calculation logic) and Trung (UI)

As a buyer,<br>
I want to estimate mortgage costs for a sale property,<br>
so that I can assess whether it may be affordable.

**Acceptance Criteria**

- The calculator can start with the selected sale property's current price and accepts down payment, annual interest rate, and loan duration.
- Missing, negative, or impossible values produce field-specific validation errors.
- Valid inputs produce the estimated loan amount and monthly payment in euros using a documented formula.
- Results update when valid inputs change, and the assumptions used by the calculation remain visible.
- The result is labelled as an estimate rather than financial advice or a loan offer.
- Rental listings do not present the mortgage calculator as applicable.

**Needs product clarification:** Which repayment formula, payment frequency, and rounding rules should the calculator use?

### S3-US-15: View regional property-market information

**Related PBI:** PBI-22<br>
**Story points:** 8<br>
**Primary owners:** Eric (data/API) and Trung (dashboard UI)

As a user,<br>
I want to view regional property-market information,<br>
so that I can understand general market conditions.

**Acceptance Criteria**

- The dashboard uses an approved, identified source of aggregated property-market data.
- Users can filter the data by the regions, property types, and time periods selected before implementation.
- Every value and chart identifies its title, unit, data source, and covered time period, and each chart has an accessible text summary.
- Loading, unavailable-source, insufficient-data, and no-result states provide distinct explanations.
- The dashboard does not expose private user or listing information.
- A disclaimer states that historical market data does not guarantee future results.

**Needs product clarification:** Which market-data source, regions, property types, and time periods are approved for Sprint 3?

## 3. Engagement & Communication

### S3-US-04: Save favourite properties

**Related PBI:** PBI-13<br>
**Story points:** 3<br>
**Primary owners:** Albaraae (frontend) and Eric (backend)

As an authenticated buyer or renter,<br>
I want to save favourite properties,<br>
so that I can return to them later.

**Acceptance Criteria**

- A user can add an available property to their favourites, view their favourites, and remove a favourite.
- Favourite changes use the authenticated user identity and backend property identifier, persist in MongoDB, and remain visible after refresh and later login.
- Adding the same property again does not create a duplicate.
- A user cannot view or change another user's favourites.
- An unauthenticated visitor is directed to log in before saving a favourite.
- Deleted or unavailable properties display a fallback state without breaking the favourites view.

### S3-US-05: Contact a seller or agent

**Related PBI:** PBI-05<br>
**Story points:** 3<br>
**Primary owners:** Trung (frontend) and Hung (backend)

As an interested buyer or renter,<br>
I want to contact the responsible seller or agent,<br>
so that I can ask a question or arrange a property viewing.

**Acceptance Criteria**

- The inquiry is associated with the selected backend property identifier and its responsible seller or agent.
- Name, a valid email address, and a non-empty message of no more than 1,000 characters are required; names may contain no more than 100 characters.
- A valid inquiry stores the property reference and a server-generated submission time.
- The interface prevents an accidental duplicate submission while a request is pending and confirms a successful submission.
- Validation and server errors retain the user's entered information and explain how to retry.
- An unknown or unavailable property cannot receive a new inquiry.
- Private inquiry information is not included in public property responses.
- The same inquiry workflow supports requests to arrange a property viewing.

### S3-US-11: Receive inquiry notifications

**Related PBI:** PBI-18<br>
**Story points:** 5<br>
**Primary owners:** Eric (backend) and Albaraae (frontend)

As a seller or agent,<br>
I want to receive notifications about inquiries for my properties,<br>
so that I can respond to interested users.

**Acceptance Criteria**

- A new property inquiry creates a notification for the responsible seller or agent.
- The notification identifies the related property and inquiry without exposing information to unrelated users.
- An authenticated user can retrieve only their own notifications.
- A user can distinguish unread and read notifications and mark a notification as read.
- Read state persists after refresh and later login.
- Deleted or unavailable related content produces a fallback state, and an account with no notifications sees an empty state.

### S3-US-19: Contact KotiSpot support

**Related PBI:** PBI-29<br>
**Story points:** 3<br>
**Primary owners:** Trung (frontend) and Eric (backend)

As a visitor or authenticated user,<br>
I want to contact KotiSpot support,<br>
so that I can ask for help or provide feedback.

**Acceptance Criteria**

- A public support form requires a name, valid email address, subject, and non-empty message within the documented length limit.
- A valid request is stored with a server-generated date and initial status.
- The interface prevents an accidental duplicate submission while a request is pending and confirms a successful submission.
- Validation and server errors retain the entered information and explain how to retry.
- Request details are available only to an authorized support user or administrator.
- The form explains how the submitted personal information will be used.

**Needs product clarification:** What message-length limit, initial status, and support role apply to support requests?

## 4. Listing Management & Platform Safety

### S3-US-06: Create and manage owned listings

**Related PBIs:** PBI-08, PBI-10, PBI-26<br>
**Story points:** 8<br>
**Primary owners:** Trung (frontend) and Hung (backend)

As a verified seller or agent,<br>
I want to create and manage my sale or rental listings,<br>
so that public property information remains accurate.

**Acceptance Criteria**

**Create and validate**

- Only an authenticated, verified seller or agent can access the listing-management interface and successfully create a listing.
- A new listing is owned by the authenticated user; a client-supplied owner identity cannot override that ownership.
- Title, description, listing type, property type and subtype, price, currency, city, address, postal code, rooms, bedrooms, bathrooms, size, and listing status are required and validated.
- Prices and sizes must be greater than zero; room counts must be positive integers; bedroom and bathroom counts must be non-negative integers.
- Rental listings require availability date and a positive-integer minimum rental period, and may include deposit and additional costs. Sale listings reject rental-only data.

**Manage and persist**

- The seller or agent dashboard retrieves the authenticated owner's persisted listings.
- An owner can edit a listing and change its listing status among active, inactive, sold, and rented; changes remain visible after refresh.
- Deletion requires confirmation and removes the listing from public discovery.
- A user cannot update or delete a listing owned by another user.
- Existing image references and metadata can be managed without adding file upload or storage to the committed scope.

### S3-US-08: Review verification applications and moderate listings

**Related PBIs:** PBI-16, PBI-27<br>
**Story points:** 5<br>
**Primary owners:** Hung (backend) and Trung (frontend)

As an administrator,<br>
I want to review verification applications and moderate listings,<br>
so that privileged publishing and public content remain controlled.

**Acceptance Criteria**

**Verification**

- An authenticated administrator can retrieve pending seller and agent verification applications.
- The administrator can approve or reject an application with a required reason, and the decision persists.
- Approval updates the user's role or verification state through a server-controlled operation.
- Private verification information is not included in public responses.

**Moderation**

- An authenticated administrator can retrieve moderation candidates, including listings with an unreviewed moderation status, and set the moderation status to flagged, approved, or removed with a required reason.
- A flagged moderation status means that a listing is under administrator investigation; listings with a flagged or removed moderation status do not appear in public discovery.
- Non-administrators cannot retrieve private review data or perform verification or moderation actions.

### S3-US-10: Report a suspicious listing

**Related PBI:** PBI-17<br>
**Story points:** 3<br>
**Primary owners:** Trung (frontend) and Hung (backend)

As an authenticated user,<br>
I want to report a suspicious listing,<br>
so that an administrator can investigate it.

**Acceptance Criteria**

- An authenticated user can start a report from the selected property's details page.
- The report records the authenticated user, backend property identifier, valid reason, and submission time.
- Empty or over-limit reasons are rejected without creating a report.
- Successful submission displays confirmation and does not automatically hide or remove the listing.
- An authorized administrator can retrieve unresolved reports and the related listing information.
- Reporter information is not exposed publicly or to the listing owner unless an explicitly authorized workflow permits it.
- The system rejects duplicate reports and rate-limits repeated submissions according to thresholds documented before implementation.

**Needs product clarification:** What report-reason length, duplicate-report rule, and submission rate limit apply?

## 5. AI Property Intelligence

### S3-US-16: Generate a private AI property-price estimate

**Related PBI:** PBI-23<br>
**Story points:** 8 (preliminary)<br>
**Primary owners:** Hung (backend/data) and Albaraae (frontend)

As a verified seller or agent,<br>
I want an AI-assisted price estimate for a property I manage,<br>
so that I can choose a realistic asking price.

**Acceptance Criteria**

- Only a verified seller or agent can request an estimate for a property they own or manage.
- The estimate uses the property fields and market-data source approved before implementation.
- The result provides a price range, is labelled as AI-generated, and explains its inputs, limitations, and uncertainty.
- The estimate remains private unless the owner explicitly applies it to the listing price.
- Missing input data, an unavailable AI service, an invalid response, or a rate limit produces a fallback state without changing the listing.
- No secret, private account data, or personal data unnecessary for the estimate is sent to the AI service.

**Needs product clarification:** Which property fields, market-data source, AI service, retention rules, and rate limits are approved for the estimate?

### S3-US-17: Generate a private AI future-price prediction

**Related PBI:** PBI-24<br>
**Story points:** 8 (preliminary)<br>
**Primary owners:** Eric (backend/data) and Trung (frontend)

As a verified seller or agent,<br>
I want an AI-assisted future-price prediction for a property I manage,<br>
so that I can understand its possible price direction.

**Acceptance Criteria**

- Only a verified seller or agent can request a prediction for a property they own or manage.
- The prediction uses the historical regional market-data source approved before implementation.
- The result shows its time horizon, expected direction, possible price range, and uncertainty, and is labelled as AI-generated.
- The prediction remains private to authorized users and is not presented as financial or professional property advice.
- Insufficient data, an unavailable service, an invalid response, or a rate limit produces a fallback state without changing the listing.
- No secret, private account data, or personal data unnecessary for the prediction is sent to the AI service.

**Needs product clarification:** Which historical data source, prediction horizon, AI service, retention rules, and rate limits are approved for the prediction?

## Definition of Done

A Sprint 3 user story is Done when all applicable conditions are met:

1. Its acceptance criteria are demonstrable through integrated frontend and backend behavior; mock data is not presented as completed integration.
2. Backend authentication, role authorization, ownership checks, input validation, and privacy boundaries are enforced for every applicable endpoint.
3. API responses and logs do not expose stack traces, credentials, one-time codes, authentication tokens, or private user data.
4. Important success, validation, unauthenticated, forbidden, not-found, external-service failure, and unexpected-error paths are tested at the level required by the course.
5. Another team member has reviewed the work, and release-blocking defects are resolved or recorded transparently.
6. The implemented flow works at representative mobile, tablet, and desktop widths without unnecessary horizontal scrolling.
7. Forms and controls have labels or accessible names, keyboard operation, visible focus, readable contrast, field-level errors, and alternative text for meaningful images where applicable.
8. Frontend lint and production-build checks pass, and backend tests for the implemented behavior pass.
9. API documentation is updated when an interface changes; deployment and configuration documentation is updated when a story introduces or changes runtime configuration.
10. No secrets, `.env` files, dependency directories, generated files, or sensitive user data are committed.

## Deferred and Optional Product Backlog Items

| PBI | Item | Decision |
| --- | --- | --- |
| PBI-21 | Listing analytics for sellers and agents | Deferred; not selected for Sprint 3 and excluded from the Sprint point total |
| PBI-31 | AI-assisted support chatbot | Deferred; not selected for Sprint 3 and excluded from the Sprint point total |
| PBI-09 | Upload and manage property images | Optional future expansion; current Sprint scope uses existing image references and metadata |
