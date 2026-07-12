import { test as setup, expect } from '@playwright/test';
import * as fs from 'fs';

const AUTH_FILE = '.auth/state.json';

setup('authenticate', async ({ page }) => {

    // creates folder for storageState if not exist
    if (!fs.existsSync('.auth')) {
        fs.mkdirSync('.auth');
    }

    await page.goto('/?loginFlow=login');

    const cookieBanner = page.getByRole('button', { name: /Ok/i });
    if (await cookieBanner.isVisible({ timeout: 5000 }).catch(() => false)) {
        await cookieBanner.click();
        await cookieBanner.waitFor({ state: 'hidden' });
    }

    await page.getByTestId("textInputLabel").fill(process.env.TEST_EMAIL!);
    await page.getByTestId("textInputLabel").fill(process.env.TEST_PASSWORD!);
    await page.getByTestId("SubmitLogin").click();

    await expect(page).not.toHaveURL(/\/login/);

    await page.context().storageState({ path: AUTH_FILE });

});
