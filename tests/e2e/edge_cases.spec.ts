import { PageManager } from '@pages/PageManager';
import { test, expect } from '@playwright/test';

/**
 * Resilience and edge-case tests for critical storefront behavior.
 *
 * Verifies that invalid product URLs fail gracefully with a 404 page, that
 * unusual search input does not break the application, and that unauthenticated
 * users are redirected away from protected checkout flow.
 */

// run all edge-case checks in a clean unauthenticated session
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Edge Cases & Resilience', () => {
    test('non-existent product URL returns 404 page, not 500', async ({ page }) => {

        const response = await page.goto('/p/elder-brand/thing-that-should-not-be/');
        // invalid product should return 404, not a server error
        expect(response?.status()).toBe(404);
        // meaningful message
        await expect(page.getByTestId("notFoundSubtitle")).toBeVisible();

    });

    test('search with special characters does not crash', async ({ page }) => {
    
        const aboutYou = new PageManager(page);

        await aboutYou.onSearchPage().goto();
        await aboutYou.onSearchPage().search('<script>alert("xss")</script>');

        await page.waitForLoadState('domcontentloaded');
        // checking that page still in valid state
        await expect(page.locator('body')).toBeVisible();
        await expect(page).not.toHaveURL(/error|500/);
        
    });

    test('direct navigation to checkout redirects unauthenticated user to login', async ({ page }) => {

        await page.goto('/checkout');
        await expect(page).toHaveURL(/\?loginFlow=login/i);

    });
});
