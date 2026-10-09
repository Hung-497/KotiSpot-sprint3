# 5. Scrum Ceremony Insights

## Daily Scrum

### What Was Completed

In the first days of the sprint, we set up the Sprint 3 repository, wrote the backlog and user stories, and connected the React frontend to the Express API so the application used real data instead of mock data.

During the second week, we finished passwordless login with one-time email codes, geocoding of property addresses, the contact form, notifications with replies, listings with multiple photos, and seed data for development.

Around the turn of the month, we finished listing status management, seller and agent verification, account preferences, filtering and sorting connected to the backend, and the first version of the AI price estimate. We also refactored the frontend into reusable hooks.

In the final days of the sprint, we completed reporting of suspicious listings, the AI price estimate and the five-year price prediction, the property map with nearby places, property comparison, and the property details page. We also merged a full redesign of the frontend with dark mode and responsive layouts.

### What Is Planned Next

All selected stories are now implemented. Our next step is to check every implemented story against our Definition of Done and fix any defects we find.

The deferred items—the mortgage calculator, market dashboard, listing analytics, and support chatbot—will remain in the Product Backlog for a future sprint.

### Blockers and Problems

Our biggest recurring problem was integration. Team members worked on separate branches in parallel, and merging them several times caused conflicts and broken features that had to be fixed afterwards. This happened again at the end of the sprint, when a large frontend redesign was merged only one day before the deadline.

A second blocker was missing data. We had no approved source of market data, so the mortgage calculator and the market dashboard could not be built. The AI features were also slowed down until we settled on a local model trained on historical postal-code price data.

In addition, property records did not originally store coordinates, so we had to add geocoding before the map could work. Loading nearby places directly from public map servers was unreliable, so we moved those requests to the backend.

### Important Decisions and Changes

- We decided to use passwordless authentication and to make booking a viewing part of an inquiry rather than a separate workflow.
- We moved the mortgage calculator and the market dashboard back to the Product Backlog.
- We removed one user story (S3-US-07) and covered its requirements through the Definition of Done instead.
- Image upload was originally optional, but we included it because there was capacity to build it.
- We decided that a reported (flagged) listing stays publicly visible while an administrator investigates it; only removed listings are hidden.

## Sprint Review

### What Was Achieved

We set out to build an integrated application in which authentication, property discovery, communication, and listing management all run on persisted backend data. That goal has been achieved.

Of the 30 Product Backlog Items, 26 are now implemented, and the remaining 4 were deliberately deferred.

### What Functionality Is Working

#### Accounts

Users can register and log in with an email code, and they can manage their profile and account preferences, including a light or dark theme.

#### Finding Properties

Users can browse properties for sale or rent, search them, filter and sort them, and see rental terms. They can open a full property details page with a map of the property and nearby places, and compare up to six properties side by side.

#### Contact

Users can save favourite properties, contact sellers or agents, receive notifications about inquiries, and contact KotiSpot support.

#### Listings

Sellers and agents can create, edit, deactivate, and delete listings with photos. They can also request an AI price estimate and a five-year price prediction.

#### Safety and Administration

Users can report suspicious listings. Administrators can review reports, verify sellers and agents, and moderate listings.

### What Changed During the Sprint

Image upload was added even though it was optional, and S3-US-07 was removed as a separate story. The mortgage calculator and the market dashboard were deferred because the data they need was not available.

Some property data was also adjusted. For example, the "studio" type was removed, and filtering now uses property subtypes. The map shows the selected property and its surroundings on the details page; a single map of all search results was left out of scope.

Near the end of the sprint, the whole frontend was redesigned.

## Sprint Retrospective

### Team Performance and Sprint Goal Completion

We implemented 16 of the 18 planned stories, which is 90 of 106 story points, or roughly 85%. The remaining 16 points belong to the two deferred stories.

No selected story is left in progress or unstarted. All core workflows are working, from logging in to managing and moderating listings, so we consider the Sprint Goal met.

### Workload Distribution

The work was divided by feature area:

- **Hung:** Backend authentication and authorization, plus coordinating integration and the backlog.
- **Albaraae:** Connecting the frontend to the backend, notifications, image upload, filtering, and suspicious-listing reports.
- **Eric:** AI price estimation and prediction models, and location services.
- **Trung:** The map, property comparison, property details, and the frontend redesign.

### Team Communication and Collaboration

We communicated regularly and used pull requests to bring work together, merging eleven of them during the sprint. Most problems came from branches staying separate for too long before they were merged. That made integration harder than it needed to be, especially in the last days of the sprint.

### Challenges and Solutions

- **Merge conflicts:** We solved these with dedicated integration branches and follow-up fixes.
- **Missing external data:** We deferred the features that depended on it, rather than delivering them half-finished. For the AI features, we used a local model trained on historical postal-code price data.
- **Unreliable external map services:** We routed nearby-place requests through our backend, with caching and fallback between servers.
- **Inconsistent test data:** We created shared seed data so that everyone developed and tested against the same properties and users.

### Sprint Metrics

| Metric | Result |
|---|---|
| Stories planned | 18 (106 points) |
| Stories implemented | 16 of 18 (2 deferred) |
| Backlog items implemented | 26 of 30 (4 deferred) |
| Story points implemented | 90 of 106 (about 85%) |
| Commits over the sprint | 97 (from 18 September to 7 October) |
| Pull requests merged | 11 |
| Backend test cases | About 250, in 13 test files |

### Team Satisfaction

Overall, the team is satisfied with the amount of working functionality we delivered. We feel the integration problems, especially the large merges near the end of the sprint, caused unnecessary stress.