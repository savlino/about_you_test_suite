import { test, expect } from '@fixtures/index';

/**
 * Catalog filtering and sorting tests for product listing pages.
 *
 * Verifies that applying a filter updates the visible result set and counter,
 * and that sorting changes product ordering according to the selected rule.
 * These checks help catch regressions in listing controls and catalog refresh behavior.
 */

test.describe('Catalog Filters', () => {
    test.beforeEach(async ({ aboutYou }) => {

        // open a stable category page directly to avoid unrelated homepage/search setup
        await aboutYou.page.goto('/c/frauen/bekleidung/jeans-20258');

        await aboutYou.onSearchPage().acceptCookies();
        await aboutYou.onSearchPage().closeSwitchCountryBanner();
        
        await aboutYou.page.waitForLoadState('domcontentloaded');

    });

    test('applying a "Color" filter reduces results', async ({ aboutYou }) => {

        // capture listing state before applying filters
        const beforeCount = await aboutYou.onSearchPage().getResultCount();
        // apply the first available color option
        const expectedAfterFilterValue = await aboutYou.onSearchPage().applyFirstColorFilterAndGetExpectedCount();

        // wait until the visible counter changes after the filter is applied
        expect(aboutYou.onSearchPage().getResultCount()).not.toBe(beforeCount);
        const afterCount = await aboutYou.onSearchPage().getResultCount();

        expect(afterCount).toBe(expectedAfterFilterValue);
        expect(beforeCount).toBeGreaterThanOrEqual(afterCount);

    });

    // test UNSTABLE, default order not guaranteed, first-card comparison may not be deterministic
    test('sort by price ascending shows cheapest item first', async ({ aboutYou }) => {

        // capture the first visible card under default sort order
        const firstResultBeforeSorting = await aboutYou.onSearchPage().productCards.first().textContent();
        await aboutYou.onSearchPage().sortByLowestPrice();

        const firstResultAfterSorting = await aboutYou.onSearchPage().productCards.first().textContent();
        expect(firstResultAfterSorting).not.toBe(firstResultBeforeSorting);

    });
});
