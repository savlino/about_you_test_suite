import { test, expect } from '@playwright/test';

/**
 * Cross-site: validating that both websites use same account independently
 *
 * Context: Outlet's startpage offers "Mit ABOUT YOU anmelden" functionality
 * Sessions supposed to be isolated, so that logging out on one of them
 * does not affect the session on another
 */

const MAIN = 'https://www.aboutyou.de';
const OUTLET = 'https://aboutyou-outlet.de';

test.describe('Cross-site', () => {

    test('login on aboutyou.de does not grant access to outlet', async ({ browser }) => {

        /**
         * User opens main site authenticated
         * 
         * Navigates to Outlet, still unlogged
         */
        const context = await browser.newContext({
            storageState: '.auth/state.json',
        });

        try {
            const pageMain = await context.newPage();
            await pageMain.goto(MAIN);
            await expect(pageMain.getByTestId("LogoutButton")).toBeEnabled();

            // navigate to Outlet right away
            const pageOutlet = await context.newPage();
            await pageOutlet.goto(`${OUTLET}/deals/f`);
            await expect(pageOutlet).toHaveURL(/\/signin/i);
        } finally {
            await context.close();
        }

    });

});
