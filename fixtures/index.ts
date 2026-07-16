import { test as base } from '@playwright/test';
import { PageManager } from '@pages/PageManager';

type Pages = {
    aboutYou: PageManager;
    mainPage: string;
};

export const test = base.extend<Pages>({

    mainPage: [async({ page }, use) => {

        await page.goto('/');
        const cookieBannerOkButton = page.getByRole('button', { name: 'Ok' });
        const switchCountryBannerButton = page.getByTestId('modalDialogBody');
        
        /* not stable solution - relying on elements visibility
        current implementation without ifs, due to unstable timings */
        await cookieBannerOkButton.isVisible({ timeout: 5000 });
        await cookieBannerOkButton.click();
        await switchCountryBannerButton.isVisible({ timeout: 5000 });
        await switchCountryBannerButton.click();

        await use('');

    }, {auto: true}],

    aboutYou: async({ page }, use) => {

        const aboutYou = new PageManager(page);
        await use(aboutYou);

    }

});

export { expect } from '@playwright/test';