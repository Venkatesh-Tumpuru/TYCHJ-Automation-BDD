import { Given, When, Then } from "@cucumber/cucumber";
import { LoginPage } from "../pages/login.page";

let login: LoginPage;

Given("user navigates to application", async function () {
  login = new LoginPage(this.page);
  await login.goto();
});

When("user enters login info", async function () {
  await login.login("test", "test123");
});

Then("user should see dashboard", async function () {
  await login.verifyDashboard();
});
