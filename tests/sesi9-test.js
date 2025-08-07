const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert/strict');
const firefox = require('selenium-webdriver/firefox');

describe('Saucedemo Test', () => {
    let driver;

    it('Visit Saucedemo Website, Login, and Sort Items A-Z', async () => {
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

        await driver.quit();
    });
});