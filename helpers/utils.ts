import { Page, Frame } from "@playwright/test";

export class Utils {
  /**
   * Waits for all load states one after another
   */
  static async waitForAllLoadStates(
    target: Page | Frame,
    maxAttempts: number = 3,
    pollInterval: number = 2000
  ): Promise<void> {
    // These states are typically more reliable, wait for them first
    await target.waitForLoadState("load");
    await target.waitForLoadState("domcontentloaded");

    // For networkidle, implement a retry mechanism
    let attempts = 0;
    let succeeded = false;

    while (attempts < maxAttempts && !succeeded) {
      try {
        // Set a reasonable timeout for networkidle
        await target.waitForLoadState("networkidle", { timeout: 10000 });
        succeeded = true;
      } catch (error) {
        attempts++;

        if (attempts >= maxAttempts) {
          // Log warning but don't fail the test
          console.warn(
            `Network did not reach idle state after ${maxAttempts} attempts. Continuing anyway.`
          );
        } else {
          console.log(
            `Network not idle, attempt ${attempts}/${maxAttempts}. Retrying in ${pollInterval}ms...`
          );
          // Wait before retrying
          await new Promise((resolve) => setTimeout(resolve, pollInterval));
        }
      }
    }
  }

  /**
   * Get current date in locale format
   */
  static getTodaysDate(format: string = "en-GB"): string {
    return new Date().toLocaleDateString(format);
  }

  /**
   * Format date as string
   */
  static formatDate(date: Date, format: string = "en-GB"): string {
    return date.toLocaleDateString(format);
  }

  /**
   * Reads and returns copied clipboard content
   */
  static async readClipboardContent(page: Page | Frame): Promise<string> {
    const clipboard_text = await page?.evaluate(async () => {
      return await navigator.clipboard.readText();
    });
    return clipboard_text;
  }
}
