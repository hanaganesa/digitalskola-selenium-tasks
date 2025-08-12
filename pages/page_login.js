import { By } from 'selenium-webdriver';

class pageLogin {
    static inputUsername = By.css('[data-test="username"]');
    static inputPassword = By.css('[data-test="password"]');
    static buttonLogin   = By.css('[data-test="login-button"]');
}

export default pageLogin;