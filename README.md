# About You Test Suite

Playwright end-to-end test suite for [aboutyou.de](https://www.aboutyou.de/) and [aboutyou-outlet.de](https://aboutyou-outlet.de/), written in TypeScript and organized with Playwright projects plus a small Page Object Model.

## Overview

This repository covers two related storefronts with slightly different test goals. The main site suite focuses on customer-facing flows such as search, catalog interaction, cart behavior, and a few resilience checks, while the outlet suite focuses on auth-gate behavior, cross-site session isolation, and discount-data validation.

The project uses a dedicated Playwright setup project to log in once and persist browser state into `.auth/state.json`, which is then reused by authenticated projects. Guest-only outlet checks intentionally run without that state so protected-route behavior can be validated from a clean session.

## Prerequisites

- Node.js 18+
- A registered account on [aboutyou.de](https://www.aboutyou.de/); the same credentials are expected to work for both sites according to the current repo setup.

## Setup

**1. Clone and install**

```bash
git clone https://github.com/savlino/about_you_test_suite.git
cd about_you_test_suite
npm install
npx playwright install chromium
```

**2. Configure credentials**

Copy `.env.example` to `.env` and fill in your test account:

```bash
cp .env.example .env
```

```env
TEST_EMAIL=your@email.com
TEST_PASSWORD=your_password
```

**3. Refresh the auth session**

The repository includes a pre-committed `.auth/state.json` with browser session cookies. These expire over time, so before running tests you need to update this file with a fresh session.

Run the setup step in isolation:

```bash
npx playwright test --project=setup
```

This logs in once and saves the session to `.auth/state.json`. All authenticated test projects then reuse this file — no repeated logins per test.

## Running Tests

Run everything

```bash
npx playwright test
```

Run a specific project

```bash
npx playwright test --project=authenticated       # aboutyou.de — auth-required tests
npx playwright test --project=outlet-guest        # outlet auth gate (guest session)
npx playwright test --project=outlet-authenticated # outlet discount display
npx playwright test --project=cross-site          # session isolation between both sites
```

Run a single spec

```bash
npx playwright test tests/e2e/search.spec.ts
npx playwright test tests/outlet/auth-gate.spec.ts
```

Run with visible browser (useful for debugging)

```bash
npx playwright test --headed
```

Open interactive UI mode

```bash
npx playwright test --ui
```

View the Report

```bash
npx playwright show-report
```

## Project Structure

```
├── playwright.config.ts       # Test projects, timeouts, reporters
├── .env.example               # Credentials template
├── .auth/
│   └── state.json             # Saved browser session (refresh before running)
├── tests/
│   ├── global.setup.ts        # Runs once — logs in and saves storageState
│   ├── e2e/                   # aboutyou.de tests (run authenticated)
│   │   ├── search.spec.ts
│   │   ├── cart.spec.ts
│   │   ├── filters.spec.ts
│   │   └── edge_cases.spec.ts
│   └── outlet/                # aboutyou-outlet.de tests
│       ├── auth-gate.spec.ts
│       ├── discount.spec.ts
│       └── cross_site.spec.ts
├── pages/                     # Page Object Model
│   ├── BasePage.ts
│   ├── CartPage.ts
│   ├── ItemModal.ts           # implementation of Product Page for modal window in gallery
│   ├── PageManager.ts         # Page Manager file, addressing existing pages
│   ├── ProductPage.ts
│   └── SearchPage.ts
├── fixtures/   
│   └── index.ts  
└── helpers/
    └── basic_helpers.ts       # Helper functions for simple operations
```

The `pages/` directory contains the Page Object Model used by the main-site tests. `PageManager.ts` acts as a simple entry point for the page objects used across the suite.

## Test Projects

The config defines five Playwright projects, each with its own `baseURL` and session state:

| Project | Target | Session | Purpose |
|---|---|---|---|
| `setup` | aboutyou.de | fresh login | Generates `.auth/state.json` for authenticated runs. |
| `authenticated` | aboutyou.de | logged in | Runs the main storefront suite under `tests/e2e/**`. |
| `outlet-guest` | aboutyou-outlet.de | guest | Validates guest access restrictions in `tests/outlet/auth-gate.spec.ts`. |
| `outlet-authenticated` | aboutyou-outlet.de | logged in | Runs `tests/outlet/discount.spec.ts` using the saved auth state. |
| `cross-site` | both sites | logged in on main site | Checks that an authenticated main-site session does not automatically grant outlet access. |

`outlet-guest` has no dependency on `setup` — the empty session is intentional, not a missing step.

## What's Covered

**aboutyou.de**

- Search: known queries return results, unlikely queries show the no-results state, and oversized input does not break the page flow.
- Cart: add-to-cart from product page, add-to-cart from gallery modal, validation when size is not selected, item removal, and basket persistence after reload.
- Catalog: coverage for filter behavior and sorting interactions on a category page.
- Edge cases: invalid product URL returns 404, suspicious search input does not crash the app, and direct navigation to checkout redirects unauthenticated users to login.

**aboutyou-outlet.de**

- Auth gate: guests are redirected to `/signin` across all routes including direct product URLs; signin page renders correctly; protected routes open without further redirect
- Discount display: original and sale price both visible per card;
- Cross-site isolation: an authenticated `aboutyou.de` session does not automatically authenticate outlet access.

## Known limitations

Some outlet tests use hardcoded product URLs and are therefore data-dependent and potentially unstable over time. This is especially relevant for `discount.spec.ts`, which currently demonstrates the approach against a fixed product page rather than dynamically discovering a current outlet item.

The discount test currently validates API pricing consistency rather than asserting that the same values are rendered correctly in the visible UI. Likewise, the cross-site suite currently verifies one important isolation scenario, but it does not yet cover a broader matrix of login/logout combinations across both domains.

The suite also stops before any real payment completion flow, and email-based flows such as password reset or order confirmation are intentionally out of scope in the current repository description.

## What's Not Covered — and Why

**Payment / checkout completion** — no test payment gateway is available. Tests go up to the checkout entry point but stop before any real transaction.

**Email flows** — order confirmations and password reset emails require an external mailbox API (e.g. Mailosaur). Out of scope here.

**Mobile viewports** — straightforward to add via an extra `projects` entry using `devices['iPhone 14']`; deprioritised to keep the suite focused.

**Wishlist** — lower business risk than cart; omitted in favour of deeper cart coverage.

**Performance / load** — outside Playwright's scope; belongs in a dedicated tool like k6.

## CI

A GitHub Actions workflow is included at `.github/workflows/`. Credentials are injected as repository secrets (`TEST_EMAIL`, `TEST_PASSWORD`) — never committed to the repository.
