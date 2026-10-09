# 6. Team Contributions

The KotiSpot team has four members: Hung, Albaraae, Eric, and Trung. Each member was responsible for specific user stories, and work was regularly brought together through pull requests. The contributions of each member are described below.

## Hung: Backend, Authentication and Integration

Hung was responsible for authentication and for integrating everyone's work.

- **Authentication:** He built the secure passwordless login system, in which users sign in with a one-time code sent by email. It includes code expiry, hashing, rate limiting, and a styled login email.
- **Backend:** He implemented the role and permission rules, account preference settings, and management of listing statuses. He also moved nearby-place lookups for the map to the backend, with caching and fallback servers, and added validation to the price-estimation API.
- **Integration:** He managed most of the merging. He combined the team's branches through integration branches and pull requests, including the reporting feature and the final redesign, and fixed the problems that came up after each merge.
- **Testing:** He wrote backend tests for the property API and nearby places. He also created and extended the seed data for development, including showcase properties near the Metropolia campuses, so that every team member tested against the same users and properties.
- **Code Quality:** He refactored the frontend by moving authentication, properties, and favourites into reusable React hooks.
- **Documentation:** He wrote and maintained the Sprint 3 backlog and user stories, updated progress throughout the sprint, and finalized the backlog at the end.

## Albaraae: Frontend Development and Frontend–Backend Integration

Albaraae was responsible for connecting the React frontend to the backend, so that the application uses real data instead of mock data.

- **Integration:** This covered loading properties and favourites, creating and editing listings, verification applications, and inquiries.
- **Features:** Albaraae developed the notifications system with replies, the upload and management of multiple photos per listing, and the role-upgrade flow for sellers and agents. Albaraae also built the contact form and its backend.
- **Reporting Suspicious Listings:** Albaraae built the full reporting feature, including the report model and API, the report action on the property page, duplicate-report prevention, and the administrator's review of reports.
- **Search:** Albaraae connected property filtering and sorting to the backend, added a city search field, and changed the property categories to subtypes.
- **User Experience and Debugging:** Albaraae replaced the browser's pop-up alerts and confirmations with a shared in-page dialog, fixed the property details layout, improved error handling across the application, and fixed a number of bugs during the sprint.
- **Testing:** Albaraae wrote and extended backend tests for properties, property images, inquiries, notifications, contact messages, verifications, and listing reports.

## Eric: AI Price Estimation and Location Services

Eric worked on the AI property intelligence features and on location data.

- **Estimation Model:** He developed the property-price estimation model, which gives an estimated price range, and a second model that predicts how a property's price may change over five years. He also built the Python service that runs the models and the backend API that connects them to the application.
- **Location:** He implemented geocoding, which converts property addresses into map coordinates. This made the map feature possible, since property records did not originally store coordinates.
- **Integration:** He helped merge the map and comparison work into the main application, and fixed several integration bugs, the admin page, and the logo.
- **Testing:** He wrote tests for the estimation feature.
- **Documentation:** He updated the project documentation.

## Trung: Map, Comparison, Property Details and Design

Trung focused on frontend features for exploring properties and on the look of the application.

- **Map:** He built the interactive property map, including an expandable map view, map icons, and points of interest.
- **Comparison:** He built the page for comparing up to six properties side by side, which also works on smaller screens.
- **Property Details:** He worked on the property details view.
- **Design:** He styled all pages for dark mode and then redesigned the whole frontend in a new version, improving the responsive layouts for different screen sizes.