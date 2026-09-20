# Sprint 3 Backlog and User Stories

## KotiSpot Real-Estate Platform

**Course deadline:** 7 October 2026

## Product Backlog Review and Sprint 3 Disposition

The original Product Backlog remains the source of product scope. The table below records how each item is treated in Sprint 3 after reviewing the earlier sprints.

| Priority | Product Backlog ID | Product Backlog Item | Position after Sprint 2 | Sprint 3 decision |
| ---: | --- | --- | --- | --- |
| 1 | PBI-01 | Browse active properties for sale or rent | Mock frontend and backend route exist separately | Commit: integrate in S3-US-01 |
| 2 | PBI-02 | View complete property details | Mock frontend and backend route exist separately | Commit: integrate in S3-US-01 |
| 3 | PBI-03 | Search properties by location or keyword | Implemented separately on both sides | Commit: integrate in S3-US-01 |
| 4 | PBI-04 | Filter and sort properties | Implemented separately on both sides | Commit: integrate in S3-US-01 |
| 5 | PBI-06 | Sign up and log in | Simulation only | Commit: implement securely in S3-US-02 |
| 6 | PBI-07 | User roles and permissions | Data structure and mock views exist | Commit: enforce in S3-US-03 |
| 7 | PBI-13 | Save favourite properties | Local frontend state and persistent backend exist separately | Commit: integrate in S3-US-04 |
| 8 | PBI-05 | Contact a seller or agent, including arranging a viewing | Simulated form and backend route exist separately | Commit: integrate in S3-US-05 |
| 9 | PBI-08 | Create a property listing for sale or rent | Mock form and backend CRUD exist separately | Commit: integrate in S3-US-06 |
| 10 | PBI-10 | Edit, deactivate, and delete property listings | Implemented separately on both sides | Commit: integrate in S3-US-06 |
| 11 | PBI-25 | View rental-specific terms | Data and views exist separately | Commit: integrate in S3-US-01 |
| 12 | PBI-26 | Manage rental-specific terms | Data and forms exist separately | Commit: integrate in S3-US-06 |
| 13 | PBI-11 | Responsive and accessible interface | Partially addressed in Sprint 2 | Commit: verify and improve in S3-US-07 |
| 14 | PBI-12 | Security, validation, and error handling | Partial backend validation exists | Commit: complete for selected flows in S3-US-07 |
| 15 | PBI-27 | Verify seller and agent accounts | Mock workflow and backend routes exist separately | Commit: integrate in S3-US-08 |
| 16 | PBI-16 | Admin listing moderation | MongoDB-backed moderation routes exist; the admin UI uses mock local state | Commit: integrate in S3-US-08 |
| 17 | PBI-09 | Upload and manage property images | Preview and image metadata exist; no upload service | Start with existing image references; expand to file storage if the team chooses |
| 18 | PBI-15 | Display properties on a map | Not implemented | Commit: implement in S3-US-09 |
| 19 | PBI-17 | Report suspicious listings | Partial backend foundation: moderation supports flagged status and reasons, where flagged means under administrator investigation, but no user-report resource or route exists. | Commit: complete and integrate in S3-US-10 |
| 20 | PBI-18 | Inquiry notifications | Not implemented | Commit: implement in S3-US-11 |
| 21 | PBI-19 | Compare selected properties | Not implemented | Commit: implement in S3-US-12 |
| 22 | PBI-20 | Mortgage and affordability calculator | Not implemented | Commit: implement in S3-US-13 |
| 23 | PBI-21 | Listing analytics for sellers and agents | Backend events are available from related features but analytics are not implemented | Commit: implement in S3-US-14 |
| 24 | PBI-22 | Real-estate market dashboard | Not implemented | Commit: implement in S3-US-15 |
| 25 | PBI-23 | AI property-price estimate | Not implemented | Commit: implement in S3-US-16 |
| 26 | PBI-24 | AI future property-price prediction | Not implemented | Commit: implement in S3-US-17 |
| 27 | PBI-28 | Manage account settings | Mock page only | Commit: integrate in S3-US-18 |
| 28 | PBI-29 | Contact KotiSpot support | Mock page only | Commit: integrate in S3-US-19 |
| 29 | PBI-30 | View and update profile information | Mock page and user CRUD exist separately | Commit: integrate in S3-US-20 |
| 30 | PBI-31 | AI-assisted support chatbot | Not implemented | Commit: implement in S3-US-21 |

PBI-14, the separate property-viewing request, has been removed by the team. Arranging a viewing is handled through PBI-05, Contact a seller or agent, instead of being developed as a separate workflow.

The team has selected the original Product Backlog priorities 20 through 31 for Sprint 3: PBI-17 through PBI-24 and PBI-28 through PBI-31. PBI-25, PBI-26, and PBI-27 were already selected earlier and are represented in S3-US-01, S3-US-06, and S3-US-08. PBI-15, Display properties on a map, is also selected. PBI-09 remains available for the team to expand if it chooses.

## Authentication Refinement

KotiSpot will use passwordless authentication with a one-time code sent to the user's email address, as originally planned in Sprint 1. The same flow supports registration and login: a valid code creates a new account when the email is not registered or authenticates the existing account when it is registered.

Codes must expire, work only once, and be stored safely rather than as readable plain text. Requesting a new code invalidates the previous one. The implementation must also limit repeated requests and verification attempts. After successful verification, the backend establishes the authenticated session using the secure token or session approach agreed by the team.

## Sprint Goal

Deliver a testable, integrated KotiSpot application in which users can discover real properties from the backend, register and log in securely, use protected role-appropriate functionality, save favourites, contact sellers or agents, and manage owned listings. Extend the product with mapping, financial and market information, seller analytics, account and support functionality, and carefully bounded AI assistance. Improve reliability, accessibility, documentation, and deployment readiness while keeping the result aligned with the Sprint 1 prototype.

## Capacity and Commitment

Sprint 2 planned 96 points, but the available records do not identify a reliable count of fully Done stories. That number is therefore not used as velocity. The team has chosen an ambitious Sprint 3 backlog of **130 story points**. This is a scope forecast rather than a promise that unfinished work will be presented as Done.

- **Selected user stories:** 130 points
- **Recommended protected capacity buffer:** approximately 14 points if team capacity is at least 144 points
- **AI estimates:** preliminary and subject to refinement after the data sources and technical approach are confirmed

The team must confirm availability, refine the three AI stories, and review this forecast during Sprint Planning. Story points measure relative team effort, not individual performance. The Sprint Backlog can be adapted during the sprint while the Sprint Goal remains protected.

## Sprint 3 Backlog

| Priority | ID | Related Product Backlog Items | Sprint Backlog Item | Points | Primary owners | Review/support | Commitment |
| ---: | --- | --- | --- | ---: | --- | --- | --- |
| 1 | S3-US-01 | PBI-01, PBI-02, PBI-03, PBI-04, PBI-25 | Integrate property discovery and rental details | 8 | Albaraae (frontend), Eric (backend/API) | Trung (UI), Hung (data/contract) | Selected |
| 2 | S3-US-02 | PBI-06 | Implement one-time email-code registration, login, authentication state, and logout | 8 | Eric (backend auth), Albaraae (frontend auth) | Hung (security/API), Trung (form UX) | Selected |
| 3 | S3-US-03 | PBI-07, PBI-12 | Protect actions and enforce role/ownership permissions | 5 | Hung (authorization), Albaraae (protected UI) | Eric (tests), Trung (role feedback) | Selected |
| 4 | S3-US-04 | PBI-13 | Persist authenticated users' favourites | 3 | Albaraae (frontend), Eric (backend) | Hung (authorization), Trung (UI states) | Selected |
| 5 | S3-US-05 | PBI-05 | Contact a seller or agent and arrange viewings through the API | 3 | Trung (frontend), Hung (backend) | Albaraae (integration), Eric (validation tests) | Selected |
| 6 | S3-US-06 | PBI-08, PBI-10, PBI-26 | Integrate protected listing creation and management | 8 | Trung (frontend), Hung (backend) | Albaraae (state/integration), Eric (authorization/tests) | Selected |
| 7 | S3-US-07 | PBI-11, PBI-12 | Verify quality, accessibility, error handling, and critical flows | 8 | Whole team; Eric coordinates backend testing, Trung coordinates UI review | Hung and Albaraae coordinate end-to-end fixes | Selected |
| 8 | S3-US-08 | PBI-16, PBI-27 | Integrate administrator verification and moderation workflows | 5 | Hung (backend), Trung (frontend) | Eric (authorization/tests), Albaraae (integration) | Selected |
| 9 | S3-US-09 | PBI-15 | Display integrated properties on a map | 8 | Trung (frontend), Eric (location/API) | Albaraae (integration), Hung (privacy review) | Selected |
| 10 | S3-US-10 | PBI-17 | Complete and integrate suspicious-listing reports | 3 | Trung (frontend), Hung (backend) | Eric (authorization/tests), Albaraae (integration) | Selected |
| 11 | S3-US-11 | PBI-18 | Notify users about inquiries | 5 | Eric (backend), Albaraae (frontend) | Hung (privacy review), Trung (notification UX) | Selected |
| 12 | S3-US-12 | PBI-19 | Compare selected properties | 5 | Albaraae (frontend), Eric (data/API) | Trung (comparison UI), Hung (data review) | Selected |
| 13 | S3-US-13 | PBI-20 | Add a mortgage and affordability calculator | 8 | Albaraae (calculation logic), Trung (UI) | Eric (tests), Hung (assumptions review) | Selected |
| 14 | S3-US-14 | PBI-21 | Provide listing analytics to verified sellers and agents | 8 | Hung (backend), Albaraae (frontend) | Eric (authorization/tests), Trung (visualization) | Selected |
| 15 | S3-US-15 | PBI-22 | Provide a real-estate market dashboard | 8 | Eric (data/API), Trung (dashboard UI) | Hung (data review), Albaraae (integration) | Selected |
| 16 | S3-US-16 | PBI-23 | Provide a private AI property-price estimate | 8 | Hung (backend/data), Albaraae (frontend) | Eric (AI review), Trung (result UX) | Selected |
| 17 | S3-US-17 | PBI-24 | Provide a private AI future-price prediction | 8 | Eric (backend/data), Trung (frontend) | Hung (privacy/data review), Albaraae (integration) | Selected |
| 18 | S3-US-18 | PBI-28 | Integrate account settings | 5 | Albaraae (frontend), Hung (backend) | Trung (UX), Eric (authorization/tests) | Selected |
| 19 | S3-US-19 | PBI-29 | Integrate KotiSpot support requests | 3 | Trung (frontend), Eric (backend) | Albaraae (form states), Hung (privacy review) | Selected |
| 20 | S3-US-20 | PBI-30 | Integrate profile viewing and editing | 5 | Albaraae (frontend), Hung (backend) | Trung (UX), Eric (authorization/tests) | Selected |
| 21 | S3-US-21 | PBI-31 | Add an AI-assisted KotiSpot support chatbot | 8 | Eric (AI integration), Trung (frontend) | Hung (privacy/safety review), Albaraae (integration) | Selected |
|  |  |  | **Selected total** | **130** |  |  |  |

Ownership identifies coordination responsibility, not exclusive work. Every story crosses frontend and backend boundaries, so owners must agree on the API contract before implementation and request review from the listed teammates.

## User Stories

### S3-US-01: Integrate property discovery and rental details

- **Related Product Backlog items:** PBI-01, PBI-02, PBI-03, PBI-04, and PBI-25
- **Priority:** Must have
- **Story points:** 8

**User story**

As a buyer or renter, I want property pages to use current backend data so that I can browse, search, filter, sort, and inspect genuinely available homes.

**Acceptance criteria**

1. The React application retrieves active, approved properties from the backend instead of using the static property dataset for the completed journey.
2. Loading, empty, success, and recoverable error states are visible and understandable.
3. A user can browse sale and rental properties and open the correct property by its backend identifier.
4. Search trims input, works without case sensitivity, and respects sale or rental purpose.
5. Supported filters and sorting are sent using the documented API query parameters and can be cleared.
6. Property details show the relevant price and available data without breaking when optional fields are absent.
7. Rental listings show monthly rent and available rental terms; sale listings do not show rental-only fields.
8. Unavailable, removed, or unknown properties produce an appropriate user-facing state.
9. The main discovery journey remains visually and functionally aligned with the Sprint 1 prototype.
10. Representative success, empty, invalid, and server-failure cases are tested.

---

### S3-US-02: Register and log in with a one-time email code

- **Related Product Backlog item:** PBI-06
- **Priority:** Must have
- **Story points:** 8

**User story**

As a visitor, I want to register or log in with a one-time code sent to my email so that I can safely use account features without managing a password.

**Acceptance criteria**

1. A visitor can submit a valid, normalized email address to request a one-time authentication code.
2. The backend sends the code only to that email address using the team's configured email service.
3. A code has a short documented expiry time, can be used only once, and is not stored or logged as readable plain text.
4. Requesting a new code invalidates any earlier unused code for the same email address.
5. Repeated code requests and failed verification attempts are limited to reduce abuse and guessing.
6. Entering a valid code authenticates an existing user or creates a new basic account when the email is not yet registered.
7. Invalid, expired, already-used, or superseded codes produce a safe and helpful error without revealing sensitive account information.
8. Successful verification establishes an authenticated session using the secure token or session approach agreed by the team.
9. The frontend exposes the current authentication state through a shared mechanism such as Context and a custom hook where this improves clarity.
10. Refresh behavior follows the documented session design and does not create a false logged-in state.
11. Logout invalidates or clears the usable authentication state and returns the interface to its public state.
12. Email-service credentials, authentication secrets, and database credentials are read from ignored environment files and are not committed.
13. Code request, first registration, returning-user login, resend, expiry, single use, failed-attempt limiting, authenticated-session, and logout behavior are tested.

---

### S3-US-03: Use protected features according to role and ownership

- **Related Product Backlog items:** PBI-07 and PBI-12
- **Priority:** Must have
- **Story points:** 5
- **Dependency:** S3-US-02

**User story**

As an authenticated user, I want KotiSpot to permit only actions allowed for my role and resources so that private and administrative functionality is protected.

**Acceptance criteria**

1. The backend derives the acting user from verified authentication data rather than trusting a user ID or role supplied by the client.
2. Protected backend routes reject missing or invalid authentication with an appropriate status and safe error response.
3. Seller and agent listing actions require the agreed verified role.
4. A seller or agent can change only listings they own unless an administrator performs an explicitly administrative action.
5. Administrator verification and moderation routes require the administrator role if those workflows enter the sprint.
6. Protected frontend routes or actions redirect unauthenticated users to login or clearly explain that login is required.
7. The interface hides unavailable actions for the current role, but backend authorization remains the source of security.
8. Forbidden-role and wrong-owner cases are included in automated or documented integration tests.

---

### S3-US-04: Save favourite properties across sessions

- **Related Product Backlog item:** PBI-13
- **Priority:** Must have
- **Story points:** 3
- **Dependencies:** S3-US-01, S3-US-02, and S3-US-03

**User story**

As a logged-in buyer or renter, I want my favourite properties to be stored in my account so that I can return to them later.

**Acceptance criteria**

1. The favourite action uses the authenticated user identity and a backend property identifier.
2. A user can add a property once, view their own favourites, and remove a favourite.
3. Favourite changes persist in MongoDB and remain visible after a refresh or later login.
4. One user's favourites are not visible or changeable by another user.
5. Duplicate favourites are prevented and produce a clear interface state rather than duplicate cards.
6. Deleted or unavailable properties are handled without breaking the favourites page.
7. Unauthenticated users are invited to log in before saving a favourite.
8. Add, list, remove, duplicate, unauthenticated, and unavailable-property cases are tested.

---

### S3-US-05: Contact a seller or agent about a property

- **Related Product Backlog item:** PBI-05
- **Priority:** Must have
- **Story points:** 3
- **Dependency:** S3-US-01

**User story**

As an interested buyer or renter, I want to contact the responsible seller or agent so that I can ask questions or arrange a property viewing.

**Acceptance criteria**

1. The inquiry form is associated with the selected backend property identifier.
2. Name, valid email, and a non-empty message within the agreed length are required.
3. Submitting valid data calls the backend and stores the property reference and server-generated submission time.
4. A successful submission shows confirmation and prevents accidental duplicate submission while the request is pending.
5. Validation and server errors preserve the user's message where practical and explain how to recover.
6. An unknown or unavailable property cannot receive a new inquiry.
7. The API does not expose private inquiry information through public property responses.
8. The message can be used to request and arrange a property viewing without requiring a separate viewing workflow.
9. Success, validation, missing-property, and server-error cases are tested.

---

### S3-US-06: Create and manage owned property listings

- **Related Product Backlog items:** PBI-08, PBI-10, and PBI-26
- **Priority:** Must have
- **Story points:** 8
- **Dependency:** S3-US-03

**User story**

As a verified seller or agent, I want to create and manage my sale or rental listings through the integrated application so that public property information stays accurate.

**Acceptance criteria**

1. Only an authenticated user with the agreed verified seller or agent role can open and successfully submit the listing workflow.
2. Creating a valid listing sends the frontend form to the backend and associates ownership with the authenticated user.
3. Required common fields and positive price and size values are validated consistently on both sides.
4. Rental listings require monthly rent and an available-from date and support the agreed optional rental terms.
5. Sale listings do not send or display misleading rental-only values.
6. The owner's dashboard retrieves their persisted listings rather than relying on local-only state.
7. An owner can edit a listing and change its availability status, with the updated data visible after refresh.
8. Deletion requires confirmation and removes the listing from normal public results.
9. Image references and metadata supported by the existing API can be managed; the team may expand this to file storage if it chooses to add that work to the story.
10. A user cannot update or delete another user's listing.
11. Create, edit, status-change, delete, invalid-data, wrong-owner, and unknown-listing cases are tested.

---

### S3-US-07: Use a reliable, accessible integrated application

- **Related Product Backlog items:** PBI-11 and PBI-12
- **Priority:** Must have
- **Story points:** 8
- **Dependencies:** All other committed Sprint 3 stories

**User story**

As a KotiSpot user, I want the integrated application to be responsive, accessible, and clear when something goes wrong so that I can complete important journeys confidently.

**Acceptance criteria**

1. The committed end-to-end journeys are tested at representative mobile, tablet, and desktop widths without unnecessary horizontal scrolling.
2. Forms have associated labels, understandable instructions, field-level errors, and preserved input where practical.
3. Keyboard users can reach and operate the main navigation, forms, cards, dialogs, and controls with a visible focus indicator.
4. Meaningful images have alternative text, controls have accessible names, and text and controls have readable contrast.
5. API requests visibly distinguish loading, empty, validation, unauthorized, forbidden, not-found, and unexpected-error states where relevant.
6. The backend validates route parameters, query values, and request bodies and does not expose stack traces, credentials, one-time codes, authentication tokens, or private user data.
7. Automated backend tests cover the critical success and failure paths required by the course instructions; frontend checks cover the main integrated flows at the level agreed in class.
8. The frontend build and lint checks pass, and no known release-blocking errors remain.
9. Required API documentation describes the implemented endpoints, authentication, request data, responses, and representative errors.
10. The application is deployed or meets the deployment-readiness instructions provided in class, with production configuration documented safely.
11. The team reviews the result against the Sprint 1 prototype and records reasons for any important design or functional differences.

---

### S3-US-08: Review verification applications and moderate listings

- **Related Product Backlog items:** PBI-16 and PBI-27
- **Priority:** Should have
- **Story points:** 5
- **Dependencies:** S3-US-02 and S3-US-03

**User story**

As an administrator, I want to review seller or agent verification applications and moderate listings so that privileged publishing and public content can be controlled.

**Acceptance criteria**

1. An authenticated administrator can retrieve pending verification applications from the backend.
2. The administrator can approve or reject an application with the required reason, and the decision persists.
3. Approval updates the user's permitted role or verification state through a server-controlled operation.
4. An authenticated administrator can retrieve moderation candidates and change moderation status with a reason.
5. A flagged listing means an administrator has placed the listing under further investigation; flagged and removed listings do not appear in public results.
6. Non-administrators receive a forbidden response and cannot perform either workflow by calling the API directly.
7. Private verification information is not exposed through public responses.
8. Approval, rejection, moderation, invalid input, unauthenticated, and forbidden-role cases are tested.

---

### S3-US-09: Display properties on a map

- **Related Product Backlog item:** PBI-15
- **Priority:** Should have
- **Story points:** 8
- **Dependency:** S3-US-01

**User story**

As a buyer or renter, I want to see available properties on a map so that I can understand their locations and explore suitable areas.

**Acceptance criteria**

1. Active, approved properties with valid coordinates appear as map markers using backend property data.
2. Selecting a marker identifies the corresponding property and provides a route to its details page.
3. Selecting or focusing a property card highlights its marker when the card and map are shown together.
4. Marker information clearly distinguishes sale prices from monthly rent.
5. Search and filter results update the properties shown on the map.
6. Properties without valid coordinates do not break the page and remain accessible through the list when applicable.
7. The map works with keyboard interaction where supported and remains usable on mobile and desktop screens.
8. Public map data does not expose private or unnecessarily precise location information.
9. Loading, map-service failure, no-result, and invalid-coordinate states are tested.

---

### S3-US-10: Report a suspicious listing

- **Related Product Backlog item:** PBI-17
- **Priority:** Should have
- **Story points:** 3
- **Dependencies:** S3-US-01, S3-US-02, and S3-US-08

**Current implementation note**

The backend already supports administrator moderation statuses and reasons through `GET /api/moderation/properties` and `PATCH /api/moderation/properties/:propertyId`. The frontend admin panel represents moderation with mock local state, and the public Contact page includes a generic report subject. A dedicated authenticated user-report model, submission route, persistence, property-details action, and frontend/backend integration still need to be completed. The existing moderation workflow should be reused where appropriate rather than duplicated.

**User story**

As a logged-in user, I want to report a suspicious listing so that an administrator can investigate it.

**Acceptance criteria**

1. An authenticated user can start a report from the selected property's details page.
2. The report is associated with the authenticated user and the correct backend property identifier.
3. The user must select or describe a valid reason, and empty or excessively long reports are rejected.
4. Successful submission displays confirmation without automatically removing the listing.
5. Authorized administrators can retrieve unresolved reports and their related listing information.
6. The reporter's private information is not exposed publicly or to the listing owner without permission.
7. Duplicate or abusive reporting is limited according to the team's documented rules.
8. Success, invalid input, duplicate, unauthenticated, missing-property, and administrator-access cases are tested.

---

### S3-US-11: Receive inquiry notifications

- **Related Product Backlog item:** PBI-18
- **Priority:** Should have
- **Story points:** 5
- **Dependencies:** S3-US-02, S3-US-05, and S3-US-06

**User story**

As a KotiSpot user, I want to receive notifications about relevant property inquiries so that I can respond to important activity.

**Acceptance criteria**

1. A new property inquiry creates a notification for the responsible seller or agent.
2. Notifications identify the related property and inquiry without exposing information to unrelated users.
3. An authenticated user can retrieve only their own notifications.
4. A user can distinguish unread and read notifications and mark a notification as read.
5. Notification state persists after refresh or later login.
6. Deleted or unavailable related content is handled with a clear fallback state.
7. The interface provides an accessible empty state when there are no notifications.
8. Creation, retrieval, read-state, wrong-user, and unavailable-content cases are tested.

---

### S3-US-12: Compare selected properties

- **Related Product Backlog item:** PBI-19
- **Priority:** Should have
- **Story points:** 5
- **Dependency:** S3-US-01

**User story**

As a buyer or renter, I want to compare selected properties so that I can understand their important differences.

**Acceptance criteria**

1. A user can select multiple available properties for comparison up to the team's documented limit.
2. The same property cannot be added more than once, and a selected property can be removed.
3. The comparison presents price, listing purpose, location, property type, size, and bedrooms side by side.
4. Sale prices and monthly rents are clearly distinguished and are not presented as directly equivalent.
5. Relevant rental terms appear for rental listings when available.
6. Missing optional values use an understandable placeholder rather than breaking the layout.
7. Deleted, removed, or unavailable properties are identified and handled safely.
8. The comparison remains usable on mobile and desktop and supports keyboard interaction.
9. Selection, duplicate prevention, removal, mixed listing types, missing data, and unavailable properties are tested.

---

### S3-US-13: Estimate mortgage costs and affordability

- **Related Product Backlog item:** PBI-20
- **Priority:** Could have
- **Story points:** 8
- **Dependency:** S3-US-01

**User story**

As a buyer, I want to estimate mortgage costs for a sale property so that I can understand whether it may be affordable.

**Acceptance criteria**

1. The calculator can start with the selected sale property's current price.
2. A user can enter a down payment, annual interest rate, and loan duration.
3. Invalid, missing, negative, or impossible values display clear validation errors.
4. The calculator displays the estimated loan amount and monthly payment in euros.
5. Results update when valid input values change and use a documented calculation formula.
6. The assumptions used by the calculation are visible and understandable.
7. The result is clearly described as an estimate rather than financial advice or a loan offer.
8. Rental listings do not present the mortgage calculator as applicable.
9. Representative calculations, boundary values, and invalid inputs are tested.

---

### S3-US-14: View listing analytics

- **Related Product Backlog item:** PBI-21
- **Priority:** Could have
- **Story points:** 8
- **Dependencies:** S3-US-03, S3-US-04, S3-US-05, and S3-US-06

**User story**

As a verified seller or agent, I want to view analytics for listings I manage so that I can understand interest in those properties.

**Acceptance criteria**

1. Only authenticated, verified sellers and agents can access listing analytics.
2. A user can access analytics only for a listing they own or manage.
3. The backend records or derives listing views, favourites, and inquiries using documented rules.
4. Analytics can be viewed per listing and identify the measured time period.
5. Counts remain consistent with the underlying application events and do not expose another user's private information.
6. A suitable empty state appears when a listing has no analytics yet.
7. The analytics interface is understandable on mobile and desktop screens.
8. Authorized, wrong-owner, empty-data, and unavailable-listing cases are tested.

---

### S3-US-15: View a real-estate market dashboard

- **Related Product Backlog item:** PBI-22
- **Priority:** Could have
- **Story points:** 8
- **Dependency:** An approved and documented market-data source

**User story**

As a user, I want to view regional property-market information so that I can understand general market conditions.

**Acceptance criteria**

1. The dashboard uses an approved source of aggregated property-market data.
2. Users can select a supported location or region, property type, and time period.
3. Values and charts have clear titles, units, labels, and accessible text alternatives or summaries.
4. The data source and covered time period are displayed.
5. Loading, unavailable-source, insufficient-data, and no-result states are explained clearly.
6. The dashboard does not expose private user information or private listing information.
7. A disclaimer explains that historical market data does not guarantee future results.
8. Representative filters, data responses, and failure states are tested.

---

### S3-US-16: Receive a private AI property-price estimate

- **Related Product Backlog item:** PBI-23
- **Priority:** Could have
- **Story points:** 8, preliminary
- **Dependencies:** S3-US-03, S3-US-06, and an approved AI and market-data approach

**User story**

As a verified seller or agent, I want an AI-assisted price estimate for a property I manage so that I can choose a realistic asking price.

**Acceptance criteria**

1. Only a verified seller or agent can request an estimate for a property they own or manage.
2. The estimate uses documented property fields and an approved market-data source.
3. The result provides a price range rather than presenting an unsupported exact valuation.
4. The interface identifies the result as AI-generated and explains important inputs, limitations, and uncertainty.
5. The estimate remains private unless the owner explicitly uses it to update the listing price.
6. Missing data, unavailable AI service, invalid output, and rate-limit states display a safe fallback.
7. No secret, private account data, or unnecessary personal data is sent to the AI service.
8. Authorization, representative input, failure, and privacy cases are tested.

---

### S3-US-17: Receive a private AI future-price prediction

- **Related Product Backlog item:** PBI-24
- **Priority:** Could have
- **Story points:** 8, preliminary
- **Dependencies:** S3-US-16 and an approved historical market-data source

**User story**

As a verified seller or agent, I want an AI-assisted future-price prediction for a property I manage so that I can understand its possible price direction.

**Acceptance criteria**

1. Only a verified seller or agent can request a prediction for a property they own or manage.
2. The prediction uses an approved source of historical regional property-price data.
3. The result shows a time horizon, expected direction, and possible price range.
4. The interface identifies the result as AI-generated and clearly explains that actual prices may differ.
5. The prediction remains private to authorized users.
6. Insufficient historical data, unavailable services, invalid output, and rate limits produce safe and understandable states.
7. The feature does not present the prediction as financial or professional property advice.
8. Authorization, data sufficiency, representative input, and failure cases are tested.

---

### S3-US-18: Manage account settings

- **Related Product Backlog item:** PBI-28
- **Priority:** Could have
- **Story points:** 5
- **Dependency:** S3-US-02

**User story**

As a logged-in user, I want to manage my account settings so that KotiSpot works according to my preferences.

**Acceptance criteria**

1. An authenticated user can retrieve their currently supported settings from the backend.
2. The user can update available communication, notification, display, or privacy preferences implemented by the team.
3. Saved settings persist in MongoDB and remain available after refresh or later login.
4. Invalid values display a clear error without discarding other entered changes where practical.
5. A successful update displays confirmation and the current saved values.
6. A user cannot retrieve or change another user's settings.
7. Options not supported by the application are not presented as working settings.
8. Retrieval, update, invalid-value, unauthenticated, and wrong-user cases are tested.

---

### S3-US-19: Contact KotiSpot support

- **Related Product Backlog item:** PBI-29
- **Priority:** Could have
- **Story points:** 3

**User story**

As a visitor or user, I want to contact KotiSpot support so that I can ask for help or provide feedback about the platform.

**Acceptance criteria**

1. A support form is available from the public website.
2. Name, valid email, subject, and a non-empty message within the agreed length are required.
3. A valid submission is stored with a server-generated date and initial status.
4. Successful submission displays confirmation and prevents accidental duplicate submission while pending.
5. Validation or server failure preserves entered information where practical and explains how to recover.
6. Support-request details are visible only to an authorized support or administrator role.
7. The form explains how the submitted personal information will be used.
8. Success, validation, unauthorized-access, and server-error cases are tested.

---

### S3-US-20: View and update profile information

- **Related Product Backlog item:** PBI-30
- **Priority:** Should have
- **Story points:** 5
- **Dependencies:** S3-US-02 and S3-US-03

**User story**

As a logged-in user, I want to view and update my profile information so that my account details remain accurate.

**Acceptance criteria**

1. An authenticated user can retrieve their own private profile from the backend.
2. The profile displays the user's email, supported personal fields, role, and verification status.
3. The user can update editable fields such as name, phone number, and biography.
4. Role and verification status are visible but cannot be directly changed by the user.
5. Invalid values display field-level errors, while successful updates persist and display confirmation.
6. Changing the account email requires verification through the one-time email-code process before the new address becomes active.
7. A user cannot retrieve or modify another user's private profile without explicit permission.
8. Retrieval, update, invalid-value, email-change, unauthenticated, and wrong-user cases are tested.

---

### S3-US-21: Use an AI-assisted support chatbot

- **Related Product Backlog item:** PBI-31
- **Priority:** Could have
- **Story points:** 8, preliminary
- **Dependencies:** S3-US-19 and an approved AI approach and support knowledge source

**User story**

As a visitor or user, I want to ask a chatbot questions about KotiSpot so that I can quickly find relevant help and guidance.

**Acceptance criteria**

1. The chatbot answers questions only within the agreed KotiSpot product-support scope and uses an approved knowledge source.
2. The interface clearly identifies chatbot responses as AI-generated.
3. The chatbot does not present legal, financial, or property guidance as professional advice.
4. Private account, inquiry, verification, listing, or application data is unavailable without appropriate authentication and authorization.
5. User messages and conversation data follow the team's documented privacy and retention rules.
6. When the chatbot cannot answer reliably, it explains the limitation and links the user to KotiSpot support.
7. AI-service failures, invalid output, and rate limits produce a safe fallback without exposing technical information.
8. Supported questions, unsupported questions, privacy boundaries, prompt-injection attempts, and service failures are tested.

## Shared Sprint Tasks and Responsibilities

| Task ID | Task | Accountable owner | Main collaborators | Supports |
| --- | --- | --- | --- | --- |
| S3-T01 | Confirm capacity, estimates, Sprint Goal, role assignments, and 10% buffer | Hung, Product Owner | Whole team | Sprint Planning |
| S3-T02 | Agree and document API base URL, CORS policy, identifiers, payloads, errors, and environment variables | Eric | Hung, Albaraae | All integrated stories |
| S3-T03 | Add a reusable frontend API layer and consistent loading/error handling | Albaraae | Trung | S3-US-01 to S3-US-21 |
| S3-T04 | Design the one-time-code request and verification contract, email delivery, code expiry and attempt limits, authenticated-session lifecycle, and authorization middleware | Eric | Hung | S3-US-02 and S3-US-03 |
| S3-T05 | Add shared frontend authentication state and protected-route behavior | Albaraae | Trung | S3-US-02 and S3-US-03 |
| S3-T06 | Add backend automated tests and test configuration required by class | Eric | Hung | S3-US-02 to S3-US-21 |
| S3-T07 | Test the main frontend flows and run lint/build checks | Trung | Albaraae | S3-US-01 to S3-US-21 |
| S3-T08 | Perform responsive, keyboard, focus, label, contrast, and alternative-text review | Trung | Albaraae | S3-US-07 |
| S3-T09 | Produce the required API documentation after class guidance is confirmed | Hung | Eric | Sprint deliverable |
| S3-T10 | Prepare deployment configuration and a safe environment-variable guide | Hung | Eric, Albaraae | Sprint deliverable |
| S3-T11 | Record Daily Scrum decisions, blockers, burndown or WIP observations, and plan changes | Albaraae | Whole team | Scrum evidence |
| S3-T12 | Record Sprint Review results and complete a 4Ls Retrospective with metrics and team-satisfaction reflection | Albaraae | Whole team | Scrum evidence |
| S3-T13 | Maintain individual contribution evidence and complete required self-assessments | Each team member | Whole team | Assessment evidence |
| S3-T14 | Prepare and rehearse the 10–12-minute presentation, starting with the Sprint 1 prototype | Eric | Whole team | Group presentation |
| S3-T15 | Approve and document map, market-data, email, and AI services, including privacy, cost, and fallback decisions | Hung, Product Owner | Eric | S3-US-02, S3-US-09, S3-US-15, S3-US-16, S3-US-17, and S3-US-21 |
| S3-T16 | Refine AI story estimates after a technical spike and representative data check | Eric | Hung, Trung, Albaraae | S3-US-16, S3-US-17, and S3-US-21 |

## Suggested Delivery Sequence

### Week 5: Contract and first integration

1. Confirm planning assumptions, capacity, ownership, and Definition of Done.
2. Agree the shared API contract, CORS, identifiers, and environment configuration.
3. Complete S3-US-01 before expanding integration into account-only features.
4. Begin the backend and frontend foundations for S3-US-02.
5. Run technical spikes for the map, market-data sources, email delivery, and AI approach so external dependencies are discovered early.

### Week 6: Authentication and protected features

1. Complete registration, login, shared authentication state, and logout.
2. Add authorization and ownership checks before connecting protected forms.
3. Integrate favourites and inquiries.
4. Begin protected listing management.
5. Develop the map and mortgage calculator in parallel after the property API contract is stable.
6. Begin listing reports, inquiry notifications, property comparison, account, profile, support, analytics, and approved data-source work.

### Week 7: Completion and quality

1. Complete listing-management integration.
2. Complete administration, account, profile, support, analytics, and market-dashboard integration.
3. Implement the refined AI price, prediction, and support stories using the approved services and privacy rules.
4. Add and run the required automated and manual tests continuously as each flow becomes integrated.
5. Fix integration defects and improve responsiveness, accessibility, and usability.
6. Complete API documentation and deployment work based on the latest class guidance.

### Beginning of Week 8: Final preparation

1. Review every selected story transparently and stop starting new work when doing so would prevent integrated stories from reaching Done.
2. Resolve release-blocking defects and verify the deployed or deployment-ready application.
3. Complete self-assessments, contribution evidence, ceremony reflections, and presentation material.
4. Rehearse the 10–12-minute presentation and verify the complete submission as a team.

## Definition of Done

A Sprint 3 story is Done only when all relevant conditions below are satisfied:

1. Every acceptance criterion has been checked and the story is demonstrable through the integrated application.
2. Frontend and backend use an agreed, documented API contract; mock data is not presented as integrated functionality.
3. Authentication, authorization, ownership, validation, and private-data rules are enforced on the backend where relevant.
4. Relevant success, validation, unauthenticated, forbidden, not-found, and unexpected-error paths have been tested at the level required by class.
5. The interface includes usable loading, empty, success, and error states and works at the agreed responsive widths.
6. Relevant keyboard, focus, label, accessible-name, contrast, and alternative-text checks have been completed.
7. Another team member has reviewed the work and important defects are resolved or transparently recorded.
8. Frontend lint and production build checks pass; relevant backend tests pass.
9. API documentation and deployment notes are updated when the story changes an interface or configuration.
10. No secrets, `.env` files, dependencies, generated junk, or sensitive user data are committed.
11. The work is visible on the team's Scrum board and its contribution evidence is recorded.
12. The result remains aligned with the Sprint 1 prototype, or the team has documented and can explain the reason for a change.

## Remaining Product Backlog Flexibility

The original Product Backlog priorities 20 through 31 and PBI-15 are now included in the Sprint 3 Backlog. The Product Backlog still belongs to the team, and the selected scope does not prohibit further KotiSpot features. If capacity becomes available, the Product Owner and Developers may refine and add other valuable items.

The remaining identified opportunity is expanding PBI-09 from image references and metadata to a complete file-upload and storage service. The team may also create and refine new Product Backlog items when they support the product direction.

When the team adds work, it should:

1. describe the user value and acceptance criteria;
2. estimate the work and assign ownership;
3. identify dependencies and testing needs;
4. update this Sprint Backlog and the team's board; and
5. remain explainable in relation to the Sprint Goal, course requirements, and Sprint 1 product direction.

## Sprint Control Rules

- Review progress and blockers during each Daily Scrum.
- Keep work in progress small enough that frontend and backend integration happens continuously rather than at the end.
- Use metrics to inspect the team's flow and forecast, never to score individuals.
- Record scope, estimate, assignment, or acceptance-criteria changes in the Sprint Backlog.
- Escalate hidden dependencies and integration failures early.
- Preserve approximately 10% of confirmed team capacity as a buffer unless the team agrees that release risk is under control.
- Treat partially integrated or untested work as not Done during the Sprint Review.
