import { Page } from '@playwright/test';

export class BasePage {
    constructor(readonly page: Page) {}

    /** closes Cookie-alert banner */
    async acceptCookies(): Promise<void> {

        const banner = this.page.getByRole('button', { name: /Alle akzeptieren/i });
        if (await banner.isVisible({ timeout: 5000 }).catch(() => false)) {
            await banner.click();
            await banner.waitFor({ state: 'hidden' });
        }

    }

    /** closes banner with buttons for switching to local site */
    async closeSwitchCountryBanner(): Promise<void> {

        const switchCountryBanner = this.page.getByTestId('modalDialogBody');
        if (await switchCountryBanner.isVisible({ timeout: 5000 }).catch(() => false)) {
            await switchCountryBanner.click();
            await switchCountryBanner.waitFor({ state: 'hidden' });
        }

    }

    async goto(): Promise<void> {

        await this.page.goto('/');
        await this.acceptCookies();
        await this.closeSwitchCountryBanner();
        
    }
}
