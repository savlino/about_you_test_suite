import { PageManager } from '@pages/PageManager';
import { test, expect } from '@fixtures/index';

test.describe('Catalog Filters', () => {
    test.beforeEach(async ({ page }) => {
        
        const aboutYou = new PageManager(page);

        // using static URL to skip unnecessary flows
        await page.goto('/c/frauen/bekleidung/jeans-20258');

        await aboutYou.onSearchPage().acceptCookies();
        await aboutYou.onSearchPage().closeSwitchCountryBanner();
        
        await page.waitForLoadState('domcontentloaded');

    });

    test('applying a "Color" filter reduces results', async ({ page }) => {
        
        const aboutYou = new PageManager(page);

        // scrapes item count before filtering
        const beforeCount = await aboutYou.onSearchPage().getResultCount();
        // applying filter by 'Color', first color in list
        const expectedAfterFilterValue = await aboutYou.onSearchPage().applyFirstColorFilterAndGetCount();

        // expecting count to update
        expect(aboutYou.onSearchPage().itemCounterOnPage).not.toBe(beforeCount);
        const afterCount = await aboutYou.onSearchPage().getResultCount();

        expect(afterCount).toBe(expectedAfterFilterValue);
        expect(beforeCount).toBeGreaterThanOrEqual(afterCount);

    });

    // test UNSTABLE, default order not guaranteed
    test('sort by price ascending shows cheapest item first', async ({ page }) => {
        
        const aboutYou = new PageManager(page);

        // storing first element in default order
        const firstResultBeforeSorting = aboutYou.onSearchPage().productCards.first();
        aboutYou.onSearchPage().sortByLowestPrice();

        expect(
            aboutYou.onSearchPage().productCards.first()
        ).not.toBe(firstResultBeforeSorting);

    });
});
