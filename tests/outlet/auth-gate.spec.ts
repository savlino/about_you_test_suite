import { test, expect } from '@playwright/test';

/**
 * Auth Gate - Outlet only permits catalog for authorised visitors.
 * Meanwhile, direct item link can be opened (link sharing).
 * All tests are running in guest session (outlet-guest project).
 *
 */

const PROTECTED_ROUTES = [
    { path: '/deals/f',      label: 'women category' },
    { path: '/deals/m',      label: 'men category' },
    { path: '/deals/k',      label: 'kids category' },
];

const EXISTING_URL = '/deals/k/278?category=138114';

test.describe('Outlet - Auth Gate (guest)', () => {

    test.beforeEach(async ({ page }) => {
        await page.context().clearCookies();
    });

    // redirects to Sign-in

    for (const route of PROTECTED_ROUTES) {
        test(`guest visiting ${route.label} is redirected to /signin`, async ({ page }) => {
            await page.goto(route.path);
            await page.waitForURL(/\/signin|\/login/i, { timeout: 10000 });
            await expect(page).toHaveURL(/\/signin|\/login/i);
        });
    }

    test('guest visiting a direct product URL is not redirected to /signin', async ({ page }) => {

        // UNSTABLE due to hardcoded link (exclusively demonstration purposes)
        await page.goto(EXISTING_URL);
        await page.waitForURL(EXISTING_URL, { timeout: 10000 });
        await expect(page).toHaveURL(EXISTING_URL);

    });

    // Double-checking that content is protected in API as well

    test('product API endpoint returns 401 without auth', async ({ request }) => {

        // requesting content unauthorised
        const res = await request.get('https://aboutyou-outlet.de/api/v1/products', {
            headers: { Accept: 'application/json' },
        });
        // getting nothing:(
        expect(res.status()).toBe(403);

    });
});
