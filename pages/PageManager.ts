import { Page } from "@playwright/test";
import { CartPage } from '@pages/CartPage';
import { SearchPage } from '@pages/SearchPage';
import { ProductPage } from "@pages/ProductPage";
import { ItemModal } from "./ItemModal";


export class PageManager {

    readonly page: Page;

    private readonly cartPage: CartPage;
    private readonly searchPage: SearchPage;
    private readonly productPage: ProductPage;
    private readonly itemModal: ItemModal;

    constructor(page: Page) {

        this.page = page;
        this.cartPage = new CartPage(this.page);
        this.searchPage = new SearchPage(this.page);
        this.productPage = new ProductPage(this.page);
        this.itemModal = new ItemModal(this.page);

    }

    onCartPage() {
        return this.cartPage;
    }

    onSearchPage() {
        return this.searchPage;
    }

    onProductPage() {
        return this.productPage;
    }

    inItemModal() {
        return this.itemModal;
    }

}