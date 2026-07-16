import { test, expect } from '@fixtures/index';

/**
 * Search behavior tests for the storefront.
 *
 * Verifies that known queries return results, impossible queries show the
 * no-results state, and unusual inputs does not break the search flow
 * or crash the page.
 */

test.describe('Search', () => {

    test('returns results for a known product', async ({ aboutYou }) => {

        await aboutYou.onSearchPage().search('Nike Sneaker');
        await expect(aboutYou.onSearchPage().productCards.first()).toBeVisible();
        const count = await aboutYou.onSearchPage().getResultCount();
        expect(count).toBeGreaterThan(0);

    });

    test('shows no-results state for a nonsense query', async ({ aboutYou }) => {

        // empiric line that returns no result on German and English versions
        const noResultsQuery = 'кривда';
        await aboutYou.onSearchPage().search(noResultsQuery);
        await expect(aboutYou.page).not.toHaveURL(/error|500/);
        await aboutYou.onSearchPage().expectNoResults();

    });

    test('handles very long query gracefully', async ({ aboutYou }) => {

        const longQuery = 'a'.repeat(1250);
        await aboutYou.onSearchPage().search(longQuery);
        // oversized input should not break rendering or navigation
        await expect(aboutYou.page).not.toHaveURL(/error|500/);
        await expect(aboutYou.onSearchPage().searchInput).toBeVisible();

    });
});
