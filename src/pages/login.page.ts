import { LoginLocators } from "../locators/login.locators";

export class LoginPage {
  constructor(public page: any) {}

  async goto() {
    await this.page.goto(process.env.URL);
  }

  async login(username: string, password: string) {
    await this.page.fill(LoginLocators.username, username);
    await this.page.fill(LoginLocators.password, password);
    await this.page.click(LoginLocators.loginBtn);
  }

  async verifyDashboard() {
    await this.page.waitForSelector(LoginLocators.dashboard);
  }
}
