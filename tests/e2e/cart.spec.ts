import { test, expect } from '@fixtures/index';

/**
 * Cart flow tests for the outlet site.
 *
 * Verifies that an item can be added to the basket, that its name and size are
 * preserved correctly, and that the basket can be cleared back to an empty state.
 * These tests cover the basic shopping-cart lifecycle and help catch regressions
 * in product selection, basket transfer, and item removal.
 */
test.describe('Cart', () => {

    test.beforeEach(async ({ aboutYou }) => {

        await aboutYou.onCartPage().goto();
        // ensure basket starts empty for each test
        await aboutYou.onCartPage().clearCart();

    });

    test('adding an item updates cart', async ({ aboutYou }) => {

        await aboutYou.onSearchPage().goto();
        await aboutYou.onSearchPage().search('T-Shirt');
        await aboutYou.onSearchPage().openFirstResult();

        const [itemName, itemSize] = await aboutYou.onProductPage().addToCartWithSize();
        await aboutYou.onProductPage().validateItemSentToBasket();

        await aboutYou.onCartPage().goto();
        await aboutYou.onCartPage().validateItemInBasket(itemName);
        await aboutYou.onCartPage().validateItemSize(itemSize);

    });

    test('adding an item from gallery', async ({ aboutYou }) => {

        await aboutYou.onSearchPage().goto();
        await aboutYou.onSearchPage().search('Skirt');
        // add to basket directly from listing, which opens the item modal
        await aboutYou.onSearchPage().clickAddToBasketFromItemCard();

        const [itemName, itemSize] = await aboutYou.inItemModal().addToCartWithSize();
        await aboutYou.onProductPage().validateItemSentToBasket();

        await aboutYou.onCartPage().goto();
        await aboutYou.onCartPage().validateItemInBasket(itemName);
        await aboutYou.onCartPage().validateItemSize(itemSize);

    });

    test('removing the last item shows empty cart', async ({ aboutYou }) => {

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

    test('adding product without selecting size shows validation error', async ({ aboutYou }) => {

        await aboutYou.onSearchPage().goto();
        await aboutYou.onSearchPage().search('Sneaker');
        await aboutYou.onSearchPage().openFirstResult();

        await aboutYou.onProductPage().addToCart();
        // size options droprown opens automatically
        await expect(aboutYou.onProductPage().sizeOptions).toBeVisible();

    });

    test('cart persists after page reload', async ({ aboutYou }) => {

        await aboutYou.onSearchPage().goto();
        await aboutYou.onSearchPage().search('Hoodie');
        await aboutYou.onSearchPage().openFirstResult();
        const [itemName, itemSize] = await aboutYou.onProductPage().addToCartWithSize();
        await aboutYou.onProductPage().validateItemSentToBasket();

        await aboutYou.page.reload();

        await aboutYou.onCartPage().goto();
        await aboutYou.onCartPage().validateItemInBasket(itemName);
        await aboutYou.onCartPage().validateItemSize(itemSize);

    });

});
