# About You Test Suite

Playwright E2E test suite covering [aboutyou.de](https://www.aboutyou.de/) and [aboutyou-outlet.de](https://aboutyou-outlet.de/), written in TypeScript.

## Prerequisites

- Node.js 18+
- A registered account on [aboutyou.de](https://www.aboutyou.de/) — the same credentials work for both sites

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

```bash
# Run everything
npx playwright test

# Run a specific project
npx playwright test --project=authenticated       # aboutyou.de — auth-required tests
npx playwright test --project=outlet-guest        # outlet auth gate (guest session)
npx playwright test --project=outlet-authenticated # outlet discount display
npx playwright test --project=cross-site          # session isolation between both sites

# Run with visible browser (useful for debugging)
npx playwright test --headed

# Open interactive UI mode
npx playwright test --ui
```

## View the Report

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
└── fixtures/
    └── index.ts               # Custom test with injected page objects
```

## Test Projects

The config defines five Playwright projects, each with its own `baseURL` and session state:

| Project | Target | Session | Runs |
|---|---|---|---|
| `setup` | aboutyou.de | — | `global.setup.ts` only |
| `authenticated` | aboutyou.de | logged in | `tests/e2e/**` |
| `outlet-guest` | outlet.de | no session | `outlet/auth-gate.spec.ts` |
| `outlet-authenticated` | outlet.de | logged in | `outlet/discount.spec.ts` |
| `cross-site` | both | logged in | `outlet/cross_site.spec.ts` |               # Currently not implemented

`outlet-guest` has no dependency on `setup` — the empty session is intentional, not a missing step.

## What's Covered

**aboutyou.de**

- Search: known queries, no-results state, XSS and long-input resilience, result links
- Cart: add with size selection, add without size (size dropdown opens), remove item, cart persists on reload
- Catalog: color filter, sort by price, page load sanity
- Edge cases: bad product/category URLs, XSS in search, unauthenticated checkout redirect

**aboutyou-outlet.de**

- Auth gate: guests are redirected to `/signin` across all routes including direct product URLs; signin page renders correctly; protected routes open without further redirect
- Discount display: original and sale price both visible per card;
- Cross-site SSO: login on main → outlet not accessible;

## What's Not Covered — and Why

**Payment / checkout completion** — no test payment gateway is available. Tests go up to the checkout entry point but stop before any real transaction.

**Email flows** — order confirmations and password reset emails require an external mailbox API (e.g. Mailosaur). Out of scope here.

**Mobile viewports** — straightforward to add via an extra `projects` entry using `devices['iPhone 14']`; deprioritised to keep the suite focused.

**Wishlist** — lower business risk than cart; omitted in favour of deeper cart coverage.

**Performance / load** — outside Playwright's scope; belongs in a dedicated tool like k6.

## CI

A GitHub Actions workflow is included at `.github/workflows/`. Credentials are injected as repository secrets (`TEST_EMAIL`, `TEST_PASSWORD`) — never committed to the repository.
