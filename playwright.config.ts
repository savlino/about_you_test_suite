import { defineConfig, devices } from '@playwright/test';
require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  expect: { timeout: 10_000 },
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    locale: 'de-DE',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    
  },

  /* Configure projects for major browsers */
  projects: [

    // ─── SETUP ──────────────────────────────────────────────────────────────
    {
      name: 'setup',
      testMatch: '**/global.setup.ts',
      use: { baseURL: 'https://www.aboutyou.de' },
    },

    // ─── ABOUT YOU (aboutyou.de) ─────────────────────────────────────────
    {
      name: 'authenticated',
      testMatch: ['**/e2e/**/*.spec.ts'],
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'https://www.aboutyou.de',
        storageState: '.auth/state.json',
      },
    },
    {
      name: 'guest',
      testMatch: ['**/api/**/*.spec.ts'],
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'https://www.aboutyou.de',
      },
    },

    // ─── OUTLET (aboutyou-outlet.de) ────────────────────────────────────

    {
      name: 'outlet-guest',
      testMatch: ['**/outlet/**.spec.ts'],
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'https://aboutyou-outlet.de',
        storageState: { cookies: [], origins: [] },
      },
    },

    // Cross-site switch baseURL during test execution
    {
      name: 'cross-site',
      testMatch: ['**/outlet/cross_site.spec.ts'],
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'https://www.aboutyou.de',
        storageState: '.auth/state.json',
      },
    }
  ],
});
