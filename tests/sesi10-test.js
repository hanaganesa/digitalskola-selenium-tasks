const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert/strict');
const firefox = require('selenium-webdriver/firefox');

describe('Saucedemo Test', () => {
    let driver;

    beforeEach(async () => {
        options = new firefox.Options();
        options.addArguments('--incognito');
        options.addArguments('--headless');
        driver = await new Builder().forBrowser('firefox').setFirefoxOptions(options).build();

        await driver.get('https://www.saucedemo.com');

        // inputs
        let inputUsername = await driver.findElement(By.css('[data-test="username"]'));
        let inputPassword = await driver.findElement(By.css('[data-test="password"]'));
        let buttonLogin = await driver.findElement(By.css('[data-test="login-button"]'));

        // actions
        await inputUsername.sendKeys('standard_user');
        await inputPassword.sendKeys('secret_sauce');
        await buttonLogin.click();

        // wait 2 second for the page to load
        await driver.sleep(2000); 

        // assertions
        try {
            let item = await driver.findElement(By.css('[data-test="inventory-list"]'));
            let itemDisplayed = await item.isDisplayed();

            assert.strictEqual(itemDisplayed, true, 'Item is not displayed');
        } catch (error) {
            assert.fail('Login failed or item not displayed: ' + error.message);
        }
    });

    it('Sort Items A-Z in Saucedemo Inventory Page', async () => {
        // select dropdown
        let sort = await driver.findElement(By.css('[data-test="product-sort-container"]'));
        await sort.click();
        let selection = await driver.findElement(By.css('[data-test="product-sort-container"] option[value="az"]'));
        await selection.click();

        // assertions - get items list
        let sortedItems = await driver.findElements(By.css('[data-test="inventory-item-name"]'));
        let originalItemNames = [];
        for (let item of sortedItems) {
            originalItemNames.push(await item.getText());
        }

        // sort copied items and compare
        let sortedItemNames = originalItemNames.slice();
        try {
            assert.deepStrictEqual(originalItemNames, sortedItemNames, 'Items are not sorted correctly');
        } catch (error) {
            assert.fail('ERROR: Items not sorted --> ' + error.message);
        }
    });

    it('Check Out Item', async () => {
        // add an item to the cart
        let addToCartButton = await driver.findElement(By.css('[data-test="add-to-cart-test.allthethings()-t-shirt-(red)"]'));

        await addToCartButton.click();

        // assert item is added to cart
        let cartBadge = await driver.findElement(By.css('[data-test="shopping-cart-badge"]'));
        let badgeText = await cartBadge.getText();
        assert.strictEqual(badgeText, '1', 'Item did not added to cart');

        // go to cart
        let cartLink = await driver.findElement(By.css('[data-test="shopping-cart-link"]'));
        await cartLink.click();

        // wait 1 second for the page to load
        await driver.sleep(1000);

        // assert cart page is displayed
        let cartPageTitle = await driver.findElement(By.css('[data-test="title"]'));
        let cartTitleText = await cartPageTitle.getText();
        assert.strictEqual(cartTitleText, 'Your Cart', 'Failed accessing cart page');

        // proceed to checkout
        let checkoutButton = await driver.findElement(By.css('[data-test="checkout"]'));
        await checkoutButton.click();

        // wait 1 second for the page to load
        await driver.sleep(1000);

        // assert checkout information page is displayed
        let checkoutPageTitle = await driver.findElement(By.css('[data-test="title"]'));
        let checkoutTitleText = await checkoutPageTitle.getText();
        assert.strictEqual(checkoutTitleText, 'Checkout: Your Information', 'Failed accessing checkout page');

        // fill in checkout information
        let firstNameInput = await driver.findElement(By.css('[data-test="firstName"]'));
        let lastNameInput = await driver.findElement(By.css('[data-test="lastName"]'));
        let postalCodeInput = await driver.findElement(By.css('[data-test="postalCode"]'));
        let continueButton = await driver.findElement(By.css('[data-test="continue"]'));
        await firstNameInput.sendKeys('Firstname');
        await lastNameInput.sendKeys('Lastname');
        await postalCodeInput.sendKeys('12345');
        await continueButton.click();

        // wait 1 second for the page to load
        await driver.sleep(1000);

        // assert checkout overview page is displayed
        let checkoutOverviewTitle = await driver.findElement(By.css('[data-test="title"]'));
        let checkoutOverviewText = await checkoutOverviewTitle.getText();
        assert.strictEqual(checkoutOverviewText, 'Checkout: Overview', 'Failed accessing checkout overview page');

        // check overview data
        let itemPrice = await driver.findElement(By.css('[data-test="inventory-item-price"]'));
        let itemPriceText = await itemPrice.getText();
        let totalPrice = await driver.findElement(By.css('[data-test="subtotal-label"]'));
        let totalPriceText = await totalPrice.getText();
        totalPriceText = totalPriceText.replace('Item total: ', '');
        assert.strictEqual(itemPriceText, totalPriceText, 'Total price is incorrect');

        // finish checkout
        let finishButton = await driver.findElement(By.css('[data-test="finish"]'));
        await finishButton.click();
        
        // wait 1 second for the page to load
        await driver.sleep(1000);

        // assert checkout complete page is displayed
        let checkoutCompleteTitle = await driver.findElement(By.css('[data-test="title"]'));
        let checkoutCompleteText = await checkoutCompleteTitle.getText();
        assert.strictEqual(checkoutCompleteText, 'Checkout: Complete!', 'Failed accessing checkout complete page');

        // assert success message
        let successMessage = await driver.findElement(By.css('[data-test="complete-header"]'));
        let successMessageText = await successMessage.getText();
        assert.strictEqual(successMessageText, 'Thank you for your order!', 'Checkout was not completed');
    });

    afterEach(async () => {
        await driver.quit();
    });
});