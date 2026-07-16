import { test, expect } from '@playwright/test';

/**
 * Verifies outlet discount data through the product-details API response.
 *
 * Opens a known outlet product page, captures the related JSON response, and
 * checks that the returned product ID matches the URL and that discounted price
 * values are internally consistent.
 */

// UNSTABLE due to hardcoded link (exclusively demonstration purposes)
const PRODUCT_PAGE = "https://aboutyou-outlet.de/p/ted-baker/ohrringe-eisley/4482268";

test.describe('Outlet - Discount Display', () => {
    test('Outlet page receives correct price information', async ({ page }) => {

        const productId = new URL(PRODUCT_PAGE).pathname.split('/').filter(Boolean).at(-1);
        if (productId == null) throw new Error('Incorrect URL or unexpected format');

        // catching API response with product details
        const productResponsePromise = page.waitForResponse(resp => {
            const ct = resp.headers()['content-type'] || '';
            return resp.status() === 200
                && ['fetch', 'xhr'].includes(resp.request().resourceType())
                && ct.includes('application/json')
                && resp.url().includes(`/api`)
                && resp.url().includes(productId);
        });

        await page.goto(PRODUCT_PAGE);
        await expect(page.locator('body')).toBeVisible();
        const resp = await productResponsePromise;
        const data = await resp.json();

        expect(data.id).toBe(Number(productId));

        // validating discount information
        const originalPrice = data.lowestPriceOfVariants.originalPrice;
        const currentPrice = data.lowestPriceOfVariants.currentPrice;
        const bestPrice = data.lowestBestPrice.price;

        expect(originalPrice).toBeGreaterThan(currentPrice);
        expect(currentPrice).toBeGreaterThanOrEqual(bestPrice);
        
    });
});
