import { Page, Locator } from '@playwright/test';
import { ProductPage } from '@pages/ProductPage';

export class ItemModal extends ProductPage {
    readonly addToCartButton: Locator;
    readonly sizeOptions: Locator;
    readonly productName: Locator;
    readonly sizeDropdown: Locator;
    readonly wishlistButton: Locator;

    constructor(page: Page) {
        super(page);
        this.productName = page.getByTestId("MiniADPDialogBody").getByTestId("productName");
        this.sizeDropdown = page.getByTestId("MiniADPDialogBody").getByTestId('sizeFlyoutOpener');
        this.sizeOptions = page.getByTestId("MiniADPDialogBody").getByTestId('sizeOptionList').or(page.getByTestId("sizeList"));
        this.addToCartButton = page.getByTestId("MiniADPDialogBody").getByTestId("addToBasketButton");
        this.wishlistButton = page.getByTestId("MiniADPDialogBody").getByTestId("addToWishlist");
    }

}
