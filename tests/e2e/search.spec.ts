import { PageManager } from '@pages/PageManager';
import { test, expect } from '@fixtures/index';

test.describe('Search', () => {
    test.beforeEach(async ({ page }) => {

        const aboutYou = new PageManager(page);
        await aboutYou.onSearchPage().goto();

    });

    test('returns results for a known product', async ({ page }) => {

        const aboutYou = new PageManager(page);

        await aboutYou.onSearchPage().search('Nike Sneaker');
        const count = await aboutYou.onSearchPage().getResultCount();
        expect(count).toBeGreaterThan(0);

    });

    test('shows no-results state for a nonsense query', async ({ page }) => {

        const aboutYou = new PageManager(page);

        await aboutYou.onSearchPage().search('кривда');
        
        await expect(page).not.toHaveURL(/error|500/);
        await aboutYou.onSearchPage().expectNoResults();

    });

    test('handles very long query gracefully', async ({ page }) => {

        const aboutYou = new PageManager(page);

        const longQuery = 'a'.repeat(1250);
        await aboutYou.onSearchPage().search(longQuery);
        // long request aren't crushing the page
        await expect(page).not.toHaveURL(/error|500/);
        await expect(page.locator('body')).toBeVisible();

    });
});
