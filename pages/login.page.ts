import { Page, Locator } from "@playwright/test";
import { BasePage } from "./base.page";

export class LoginPage extends BasePage {
  // Locators
  private readonly emailInput: Locator;
  private readonly nextButton: Locator;
  private readonly passwordInput: Locator;
  private readonly signInButton: Locator;
  private readonly staySignedInButton: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.getByRole("textbox", {
      name: "Enter your email, phone, or Skype.",
    });
    this.nextButton = page.getByRole("button", { name: "Next" });
    this.passwordInput = page.getByRole("textbox", { name: "Password" });
    this.signInButton = page.getByRole("button", { name: "Sign in" });
    this.staySignedInButton = page.getByRole("button", { name: "Yes" });
  }

  /**
   * Login with email and password
   */
  public async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.nextButton.click();

    await this.passwordInput.fill(password);
    await this.signInButton.click();
    await this.staySignedInButton.click();
  }
}
