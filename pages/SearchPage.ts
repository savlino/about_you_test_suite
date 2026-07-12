import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '@pages/BasePage';


async function getBadgeNumber(locator: Locator) {
    const text = await locator.innerText();
    return Number(text.replace(/\D/g, ''));
}

export class SearchPage extends BasePage {
    readonly searchInput: Locator;
    readonly searchButton: Locator;
    readonly productCards: Locator;
    readonly noResultsMessage: Locator;
    readonly itemCounterOnPage: Locator;
    readonly colorDropdown: Locator;
    readonly firstColorOption: Locator;
    readonly sortingDropdown: Locator;
    readonly sortingLowestPrice: Locator;

    constructor(page: Page) {

        super(page);
        this.searchInput = page.getByTestId('searchBarInput');
        this.searchButton = page.getByTestId('searchIcon');
        this.productCards = page.getByTestId(/^productTile-/);
        this.noResultsMessage = page.getByTestId("SearchStreamEmpty");
        this.itemCounterOnPage = page.getByTestId('categoryHeaderTitle').getByTestId('numberBadge');
        this.colorDropdown = page.getByTestId('filterDropdownColor');
        this.firstColorOption = page.getByTestId('filterFlyoutColorLabel').first();
        this.sortingDropdown = page.getByTestId("sortingOptionsDropdown_inactive");
        this.sortingLowestPrice = page.getByTestId("sortingOptionsDropdown-price_high");

    }

    // async goto(): Promise<void> {

    //     await this.page.goto('/');
    //     await this.acceptCookies();
    //     await this.closeSwitchCountryBanner();
        
    // }

    async search(query: string): Promise<void> {

        await this.searchButton.click();
        expect(this.searchInput).toBeVisible();
        await this.searchInput.fill(query);

        await this.searchInput.press('Enter');

    }

    async getResultCount(): Promise<number> {

        expect(this.productCards.first()).toBeVisible();
        return await getBadgeNumber(this.itemCounterOnPage);

    }

    async applyFirstColorFilterAndGetCount(): Promise<number> {
        
        await this.colorDropdown.click();
        const colorFilter = this.firstColorOption;

        // scrapes item count value from filter checkbox
        const onFilterBadge = colorFilter.getByTestId('numberBadge');
        await colorFilter.click();
        return await getBadgeNumber(onFilterBadge);
    }

    async openFirstResult(): Promise<void> {
        
        await this.productCards.first().click();
        await this.page.waitForLoadState('domcontentloaded');

    }

    async clickAddToBasketFromItemCard(): Promise<void> {

        // hovering over item card to make buttons visible
        await this.productCards.first().hover();
        await this.productCards.first().getByTestId("ProductTileAddToBasketButton").click();

    }

    async expectNoResults(): Promise<void> {

        await expect(this.noResultsMessage).toBeVisible();
        await expect(this.productCards).toHaveCount(0);

    }

    async sortByLowestPrice(): Promise<void> {

        await this.sortingDropdown.click();
        await this.sortingLowestPrice.click();

    }
}
