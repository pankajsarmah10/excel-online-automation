import { Page, Frame, Locator, expect } from "@playwright/test";
import { Utils } from "../helpers/utils";

export abstract class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to a specific URL
   */
  public async navigateTo(url: string): Promise<void> {
    await this.page.goto(url);
    await Utils.waitForAllLoadStates(this.page);
  }

  /**
   * Find a frame by name
   */
  public async getFrame(frameName: string): Promise<Frame | null> {
    return this.page.frame(frameName);
  }

  /**
   * Click on element
   */
  public async clickElement(locator: Locator): Promise<void> {
    await locator.click();
  }

  /**
   * Type text into an input field
   */
  public async typeText(
    locator: Locator,
    text: string,
    delay: number = 50
  ): Promise<void> {
    await locator.fill(text);
  }

  /**
   * Wait for element to be visible
   */
  public async waitForElement(
    locator: Locator,
    timeout: number = 5000
  ): Promise<void> {
    await locator.waitFor({ state: "visible", timeout });
  }

  /**
   * Check if element exists
   */
  public async elementExists(locator: Locator): Promise<boolean> {
    return (await locator.count()) > 0;
  }

  /**
   * Get text from element
   */
  public async getElementText(locator: Locator): Promise<string> {
    return await locator.innerText();
  }

  /**
   * Press keyboard keys
   */
  public async pressKey(key: string): Promise<void> {
    await this.page.keyboard.press(key);
  }
}
