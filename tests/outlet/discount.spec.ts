import { test, expect } from '@playwright/test';

/**
 * Proper discount Display for Outlet resource is essential
 *
 */

// UNSTABLE due to hardcoded link (exclusively demonstration purposes)
const PRODUCT_PAGE = "https://aboutyou-outlet.de/p/ted-baker/ohrringe-eisley/4482268";

test.describe('Outlet - Discount Display', () => {
    test('Outlet page receives correct price information', async ({ page }) => {

        const productId = new URL(PRODUCT_PAGE).pathname.split('/').filter(Boolean).at(-1);
        if (productId == null) throw new Error('Incorrect URL or unexpected format');

        // catching API response with product details
        const productResponse = page.waitForResponse(resp => {
            const ct = resp.headers()['content-type'] || '';
            return resp.url().includes(productId)
                && resp.status() === 200
                && ['fetch', 'xhr'].includes(resp.request().resourceType())
                && ct.includes('application/json');
        });

        await page.goto(PRODUCT_PAGE);

        const resp = await productResponse;
        const data = await resp.json();

        expect(data.id).toBe(Number(productId));

        // validating discount information
        expect(
            data.lowestPriceOfVariants.originalPrice
        ).toBeGreaterThan(
            data.lowestPriceOfVariants.currentPrice
        );

        expect(
            data.lowestPriceOfVariants.currentPrice
        ).toBeGreaterThanOrEqual(
            data.lowestBestPrice.price
        );
        
    });
});
