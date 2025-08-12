import { By } from 'selenium-webdriver';
const sortOption = 'az'; // default sort option

class pageInventory {
    static sort = By.css('[data-test="product-sort-container"]');
    static sortSelection = By.css(`[data-test="product-sort-container"] option[value="${sortOption}"]`);
    static item = By.css('[data-test="inventory-list"]');
    static items = By.css('[data-test="inventory-item-name"]');
}

export default pageInventory;