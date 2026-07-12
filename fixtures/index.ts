import { test as base, expect } from '@playwright/test';
import { PageManager } from '@pages/PageManager';

type Pages = {
    aboutYou: PageManager;
    mainPage: string;
};

export const test = base.extend<Pages>({

    mainPage: [async({ page }, use) => {

        await page.goto('/');
        
        const cookieBanner = page.getByRole('button', { name: 'Ok' });
        const switchCountryBanner = page.getByTestId('modalDialogBody');
        
        await cookieBanner.isVisible({ timeout: 5000 });
        await cookieBanner.click();
        await switchCountryBanner.isVisible({ timeout: 5000 });
        await page.getByTestId('countrySwitchCurrentCountry').click();
        
        await use('');

    }, {auto: true}],

    aboutYou: async({ page }, use) => {

        const aboutYou = new PageManager(page);
        await use(aboutYou);

    }

});

export { expect } from '@playwright/test';