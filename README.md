# KotiSpot — Sprint 3

KotiSpot is a real-estate platform for browsing, buying, selling, and renting properties. Sprint 3 focuses on integrating the React frontend with the Express/MongoDB backend, implementing authentication and authorization, testing the combined application, and preparing it for deployment.

## Development seed data

The backend includes a deterministic dataset for manual development and review. Configure `MONGO_URI` in `backend/.env`, then run these commands from `backend/`:

```sh
npm run data:import
npm run data:destroy
npm run data:reset
```

- `data:import` inserts the dataset and refuses to continue if seed records already exist.
- `data:destroy` removes the predefined records, OTP challenges for the seed accounts, and manual records owned by or linked to the seeded users and properties. Other development data is preserved.
- `data:reset` performs that scoped cleanup and recreates the original dataset with the same identifiers and timestamps.

The dataset contains 16 properties: 10 active, approved showcase listings and six listings covering unreviewed, flagged, removed, inactive, sold, and rented states. The showcase set has an even sale/rent split across Helsinki, Espoo, Vantaa, Tampere, and Turku, with varied subtypes, prices, sizes, room counts, and features. Seeded properties intentionally use the frontend's bundled fallback image rather than external image URLs.

The seed users exercise buyer, renter, verified seller, verified agent, administrator, pending-verification, and rejected-verification paths:

| Role or state | Email |
| --- | --- |
| Buyer | `buyer@kotispot.dev` |
| Renter | `renter@kotispot.dev` |
| Verified seller | `seller@kotispot.dev` |
| Verified agent | `agent@kotispot.dev` |
| Administrator | `admin@kotispot.dev` |
| Pending seller application | `pending.seller@kotispot.dev` |
| Rejected agent application | `rejected.agent@kotispot.dev` |

Authentication still uses the normal one-time email-code flow. The seed does not create readable OTP codes, passwords, or JWTs. Seed commands always use `MONGO_URI`, refuse the test runtime, and also refuse to run when `MONGO_URI` and `TEST_MONGO_URI` point to the same database.

## Sprint Documentation

- [Sprint 3 Backlog and User Stories](./sprint-3-backlog-and-user-stories.md)
- [Complete Product Backlog and User Stories from Sprint 1](https://github.com/amaroqq/KotiSpot-sprint1/blob/sprint-1/product-backlog-and-user-stories.md)
