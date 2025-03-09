import { Page, Frame, Locator } from "@playwright/test";
import { BasePage } from "./base.page";
import { Utils } from "../helpers/utils";

export class ExcelPage extends BasePage {
  // Locators
  private readonly blankWorkbookLink: Locator;
  private readonly formulaBar: Locator;
  private readonly tooltipSubtext: Locator;

  constructor(page: Page) {
    super(page);
    this.blankWorkbookLink = page.getByRole("link", { name: "Blank workbook" });
  }

  /**
   * Open a new blank workbook
   */
  public async openBlankWorkbook(): Promise<Page> {
    const [newTab] = await Promise.all([
      this.page.context().waitForEvent("page"),
      this.blankWorkbookLink.click(),
    ]);

    await newTab.waitForSelector("iframe[name=WacFrame_Excel_0]", {
      timeout: 10000,
    });
    return newTab;
  }

  /**
   * Get Excel frame
   */
  public async getExcelFrame(page: Page): Promise<Frame | null> {
    const frame = page.frame("WacFrame_Excel_0");
    if (frame) {
      await Utils.waitForAllLoadStates(frame);
    }
    return frame;
  }

  /**
   * Enter formula in cell
   */
  public async enterFormula(
    page: Page,
    frame: Frame | null,
    formula: string
  ): Promise<void> {
    if (!frame) {
      throw new Error("Excel frame not found");
    }
    await frame?.locator("#formulaBarTextDivId>.ql-editor").click();
    await frame?.waitForTimeout(500);
    await page.keyboard.type(formula, { delay: 100 });
    await Utils.waitForAllLoadStates(frame);
  }

  /**
   * Get tooltip text
   */
  public async getTooltipText(frame: Frame | null): Promise<string | null> {
    if (!frame) {
      return null;
    }
    await frame.waitForSelector(
      "div.ms-Tooltip-subtext>span,p.ms-Tooltip-subtext",
      {
        timeout: 5000,
      }
    );
    return await frame
      .locator("div.ms-Tooltip-subtext>span,p.ms-Tooltip-subtext ")
      .innerText();
  }

  /**
   * Select all text in formula bar
   */
  public async selectAllInFormulaBar(
    page: Page,
    frame: Frame | null
  ): Promise<void> {
    if (!frame) {
      throw new Error("Excel frame not found");
    }

    await frame.locator("#formulaBarTextDivId>.ql-editor").click();
    const modifierKey = process.platform === "darwin" ? "Meta" : "Control";
    await page.keyboard.press(`${modifierKey}+A`);
  }

  /**
   * Verify Excel function result
   */
  public async verifyTodayFunction(
    page: Page,
    count: number = 0
  ): Promise<boolean> {
    const frame = await this.getExcelFrame(page);

    await this.enterFormula(page, frame, "=TODAY()");
    if (frame) {
      await Utils.waitForAllLoadStates(frame);
    }
    await this.selectAllInFormulaBar(page, frame);
    let displayedDate: string | null = "";
    try {
      displayedDate = await this.getTooltipText(frame);
    } catch (err) {
      count++;
      console.log(`Tooltip not displayed. Retry: ${count}.`);
      if (count == 5) {
        throw err;
      }
      await new Promise((resolve) => setTimeout(resolve, 500));
      await page.reload();
      await Utils.waitForAllLoadStates(page);
      return await this.verifyTodayFunction(page, count);
    }

    const todaysDate = Utils.getTodaysDate();
    return displayedDate === todaysDate;
  }

  /**
   * Verify Excel function result - alternative
   */
  public async verifyTodayFunction_alternative(page: Page): Promise<boolean> {
    const frame = await this.getExcelFrame(page);
    await this.enterFormula(page, frame, "=TODAY()");
    if (frame) {
      await Utils.waitForAllLoadStates(frame);
    }

    await page.keyboard.press("Enter");
    await frame?.waitForTimeout(1000);
    await page.keyboard.press("ArrowUp");
    await frame?.waitForTimeout(1000);
    await page.keyboard.press("Control+C");
    await frame?.waitForTimeout(1000);
    let displayedDate = "";
    if (frame) {
      displayedDate = await Utils.readClipboardContent(frame);
    }
    const todaysDate = Utils.getTodaysDate();
    return displayedDate === todaysDate;
  }
}
