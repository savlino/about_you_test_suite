import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '@pages/BasePage';

export class CartPage extends BasePage {
    readonly emptyCartMessage: Locator;
    readonly cartIcon: Locator;
    readonly removeButtons: Locator;

    constructor(page: Page) {
        super(page);
        this.cartIcon = page.getByTestId("Basket");
        this.emptyCartMessage = page.getByTestId("emptyBasketMessage");
        this.removeButtons = page.getByTestId("removeProduct");
    }

    async goto(): Promise<void> {

        await this.page.getByTestId('Basket').click();
        await this.page.waitForLoadState('domcontentloaded');

    }

    async openViaIcon(): Promise<void> {

        await this.cartIcon.click();
        await this.page.waitForLoadState('domcontentloaded');

    }

    async validateItemInBasket(expectedItemName: string): Promise<void> {

        const basketName = (await this.page.getByTestId("productName").textContent())?.trim();

        expect(basketName).toBeTruthy();
        expect(expectedItemName).toContain(basketName!);

    }

    async validateItemSize(expectedItemSize: string): Promise<void> {

        const basketName = (await this.page.getByTestId("productSize").textContent())?.trim();

        expect(basketName).toBeTruthy();
        expect(expectedItemSize).toContain(basketName!);

    }

    async expectEmpty(): Promise<void> {

        await expect(this.emptyCartMessage).toBeVisible();

    }

    async removeFirstItem(): Promise<void> {

        await this.removeButtons.first().click();

    }

    async clearCart(page: Page): Promise<void> {
        await expect(
            this.emptyCartMessage.or(this.removeButtons).first()
        ).toBeVisible();

        if(!(await this.emptyCartMessage.isVisible())) {
            await expect(this.removeButtons.first()).toBeVisible();

            const numOfItems = await this.removeButtons.count();
            console.log('Number of items in the basket: ' + numOfItems);

            for (let i = numOfItems; i > 0; i--) {
                await this.removeFirstItem();
                await page.waitForTimeout(1500); // waiting for animation
            }
            await expect(this.emptyCartMessage).toBeVisible();
        }
    }
}
