import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '@pages/BasePage';

export class ProductPage extends BasePage {
    readonly addToCartButton: Locator;
    readonly sizeOptions: Locator;
    readonly productName: Locator;
    readonly sizeDropdown: Locator;
    readonly wishlistButton: Locator;

    constructor(page: Page) {
        super(page);
        this.productName = page.getByTestId("productName");
        this.sizeDropdown = page.getByTestId('sizeFlyoutOpener');
        this.sizeOptions = page.getByTestId('sizeOptionList').or(page.getByTestId("sizeList"));
        this.addToCartButton = page.getByTestId("addToBasketButton");
        this.wishlistButton = page.getByTestId("addToWishlist");
    }

    async selectFirstAvailableSize(): Promise<string> {

        await this.sizeDropdown.click();
        expect(this.sizeOptions.first()).toBeVisible();

        // filtering listed size options to keep only available
        const available = this.sizeOptions.locator('[data-testid$="_active"]');
        const selected = this.sizeOptions.locator('[data-testid$="_selected"]');

        // ternary to keep a fallback option to selected by default
        const target = (await available.count()) > 0
            ? available.first()
            : selected.first();
        
        const sizeText = await target.textContent() ?? 'unknown';
        await target.click();
        return sizeText.trim();

    }

    async addToCart(): Promise<void> {

        await this.addToCartButton.click();

    }

    async addToCartWithSize(): Promise<string[]> {

        const selectedItemName = (await this.productName.textContent())?.trim();
        const selectedItemSize = await this.selectFirstAvailableSize();
        
        await this.addToCart();

        if (selectedItemName == null) throw new Error('Missing item name');

        return [selectedItemName, selectedItemSize];

    }

    async validateItemSentToBasket(): Promise<void> {
        
        expect(this.page.getByTestId('basketFlyoutHeader')).toBeVisible();
        await this.page.getByTestId('basketFlyoutClose').click();

    }
}
