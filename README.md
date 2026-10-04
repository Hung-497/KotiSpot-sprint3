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

The dataset contains 20 properties: 14 active, approved showcase listings (nine for sale and five for rent) and six listings covering unreviewed, flagged, removed, inactive, sold, and rented states. The showcase set covers Helsinki, Espoo, Vantaa, Tampere, and Turku, with varied subtypes, prices, sizes, room counts, and features. Four sale listings use Metropolia campus addresses: Arabia, Karamalmi, Myllypuro, and Myyrmäki. Listings and sale details are fictional demo content.

Default public browsing (`GET /api/properties`, used by the Recommended tabs) shows newest listings first, with descending ObjectId order for matching creation dates. The four campuses have the newest public timestamps in the seed dataset, so they appear first in the seeded recommendations. This is not permanent campus pinning: unrelated newer listings can appear ahead of them. Search/filter sorting remains unchanged.

Each campus has three distinct photos (exterior, library, and cafeteria), stored alongside the existing images in `frontend/src/assets/metropolia-*.jpg`: 12 files total. The seeder reads these local files and saves them as JPEG data URLs using the existing property-image format, with the exterior as the main image. Listing cards and detail galleries display them without external requests or frontend changes. Keep the frontend assets available when running the backend seeder. The other 16 properties retain the frontend's bundled fallback image. To update an already-imported seed dataset with these details and photos, run `npm run data:reset`; this restores seed-owned data and removes manual records within the existing scoped cleanup.

Photo and address sources: Metropolia's official [Arabia](https://www.metropolia.fi/en/about-us/campuses/arabia-campus), [Karamalmi](https://www.metropolia.fi/en/about-us/campuses/karamalmi-campus), [Myllypuro](https://www.metropolia.fi/en/about-us/campuses/myllypuro-campus), and [Myyrmäki](https://www.metropolia.fi/en/about-us/campuses/myyrmaki-campus) campus pages. Myllypuro's library photo comes from Metropolia's [library article](https://blogit.metropolia.fi/tiedon-janoa/2020/09/07/myllypuron-uusi-kirjasto/), rather than the generic stock image on the campus page. The images are checked into the repository; seed commands do not download them. Source attribution does not establish a reuse licence; these are school-project demo assets, not a claim of unrestricted rights for commercial redistribution.

### Campus facts and demo estimates

Campus listings are fictional sales, not actual offers by Metropolia. [Myllypuro](https://www.metropolia.fi/en/about-us/campuses/myllypuro-campus) publishes 56,000 m² gross / 41,000 m² usable, completed in phases in 2018 and 2019. [Myyrmäki](https://www.metropolia.fi/fi/metropoliasta/kampukset/myyrmaki) publishes approximately 26,000 m² usable; its original A wing dates from 1988, with an expansion in 2018. Whole-campus areas for Arabia and Karamalmi and complete room inventories were not verified in the inspected sources. Karamalmi's demo area represents an assumed campus portion, not the whole Nokia property.

| Campus | Seed size / basis | Rooms (estimated) | Assumed EUR/m² | Demo asking price |
| --- | --- | ---: | ---: | ---: |
| Arabia | 16,000 m², demo estimate | 160 | 3,600 | EUR 57,600,000 |
| Karamalmi | 8,000 m², demo estimate | 100 | 2,500 | EUR 20,000,000 |
| Myllypuro | 56,000 m², published gross area | 400 | 3,200 | EUR 179,200,000 |
| Myyrmäki | 26,000 m², published usable area | 260 | 2,400 | EUR 62,400,000 |

Prices are deterministic **demo estimates**: `size × assumed EUR/m²`, not app-model predictions, market valuations, or observed asking prices. Rates are manually chosen scenario assumptions: higher for Helsinki's urban creative location and modern specialist facilities, lower for Espoo office-style spaces and Vantaa's mixed-age campus. No comparable sales or rental yields have been verified. Gross and usable areas differ, so these rates are not directly comparable.

`rooms` counts estimated teaching rooms, laboratories, studios, and offices, not bedrooms. The rough area allowances are 100 m² per room for Arabia/Myyrmäki, 80 m² for Karamalmi, and 140 m² for Myllypuro, including circulation and shared facilities. All campuses have zero bedrooms; washroom counts (18/12/64/36) and furnishing are demo assumptions. Unverified original construction years for Arabia/Karamalmi are stored as `0` (unknown). Myllypuro uses final construction year 2019; Myyrmäki uses original-wing year 1988. Descriptions label estimates explicitly. Existing residential/subtype labels are retained solely for compatibility with KotiSpot's current residential-only filters; they do not describe the actual campus building type. No commercial-property schema or frontend change is introduced.

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

## Estimation model setup

The backend includes an estimation model and python server for intended use (Feature WIP).

First, ensure required python packages are installed by running (in `backend/utils/estimation_models/`):
```sh
pip install -r requirements.txt
```
For __linux__ users, venv may be required. Run the following in project root folder:
```sh
python -m venv venv
source venv/bin/activate
pip install -r backend/utils/estimation_models/requirements.txt
```
Afterwards, to start the server, navigate to `backend/` and run:
```sh
python serve.py
```


## Sprint Documentation

- [Sprint 3 Backlog and User Stories](./sprint-3-backlog-and-user-stories.md)
- [Complete Product Backlog and User Stories from Sprint 1](https://github.com/amaroqq/KotiSpot-sprint1/blob/sprint-1/product-backlog-and-user-stories.md)
