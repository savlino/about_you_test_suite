import { PageManager } from '@pages/PageManager';
import { test, expect } from '@fixtures/index';

/**
 * Warenkorb tests
 */
test.describe('Cart', () => {

    test.beforeEach(async ({ page }) => {

        const aboutYou = new PageManager(page);

        await aboutYou.onCartPage().goto();
        await aboutYou.onCartPage().clearCart(page);

    });

    test('adding an item updates cart', async ({ page }) => {

        const aboutYou = new PageManager(page);

        await aboutYou.onSearchPage().goto();
        await aboutYou.onSearchPage().search('T-Shirt');
        await aboutYou.onSearchPage().openFirstResult();

        const [itemName, itemSize] = await aboutYou.onProductPage().addToCartWithSize();
        await aboutYou.onProductPage().validateItemSentToBasket();

        await aboutYou.onCartPage().goto();
        await aboutYou.onCartPage().validateItemInBasket(itemName);
        await aboutYou.onCartPage().validateItemSize(itemSize);

    });

    test('adding an item from gallery', async ({ page }) => {

        const aboutYou = new PageManager(page);

        await aboutYou.onSearchPage().goto();
        await aboutYou.onSearchPage().search('Skirt');
        await aboutYou.onSearchPage().clickAddToBasketFromItemCard();

        const [itemName, itemSize] = await aboutYou.inItemModal().addToCartWithSize();
        await aboutYou.onProductPage().validateItemSentToBasket();

        await aboutYou.onCartPage().goto();
        await aboutYou.onCartPage().validateItemInBasket(itemName);
        await aboutYou.onCartPage().validateItemSize(itemSize);

    });

    test('removing the last item shows empty cart', async ({ page }) => {

        const aboutYou = new PageManager(page);

        await aboutYou.onSearchPage().goto();
        await aboutYou.onSearchPage().search('Jeans');
        await aboutYou.onSearchPage().openFirstResult();
        const [itemName, itemSize] = await aboutYou.onProductPage().addToCartWithSize();
        await aboutYou.onProductPage().validateItemSentToBasket();

        await aboutYou.onCartPage().goto();
        await aboutYou.onCartPage().validateItemInBasket(itemName);
        await aboutYou.onCartPage().validateItemSize(itemSize);

        await aboutYou.onCartPage().removeFirstItem();
        await aboutYou.onCartPage().expectEmpty();

    });

    test('adding product without selecting size shows validation error', async ({ page }) => {

        const aboutYou = new PageManager(page);

        await aboutYou.onSearchPage().goto();
        await aboutYou.onSearchPage().search('Sneaker');
        await aboutYou.onSearchPage().openFirstResult();

        await aboutYou.onProductPage().addToCart();

        expect(aboutYou.onProductPage().sizeOptions).toBeVisible();

    });

    test('cart persists after page reload', async ({ page }) => {

        const aboutYou = new PageManager(page);

        await aboutYou.onSearchPage().goto();
        await aboutYou.onSearchPage().search('Hoodie');
        await aboutYou.onSearchPage().openFirstResult();
        const [itemName, itemSize] = await aboutYou.onProductPage().addToCartWithSize();
        await aboutYou.onProductPage().validateItemSentToBasket();

        await page.reload();

        await aboutYou.onCartPage().goto();
        await aboutYou.onCartPage().validateItemInBasket(itemName);
        await aboutYou.onCartPage().validateItemSize(itemSize);

    });

});
