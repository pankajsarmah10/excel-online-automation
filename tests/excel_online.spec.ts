import { test, expect } from "@playwright/test";
import * as fs from "fs";
import { decrypt } from "../utils/encrypt_credentails";
import { getCurrentEnvironment } from "../config/env.config";

import { LoginPage } from "../pages/login.page";
import { ExcelPage } from "../pages/excel.page";

//Get current environment
const env = getCurrentEnvironment();

//Get credentials
const config = JSON.parse(fs.readFileSync("./config/config.json", "utf8"));
const { email, password } = config;

test.describe("Excel online test", () => {
  test("Verify Excel online TODAY() function - Copy from Clipboard", async ({
    browser,
  }) => {
    const context = await browser.newContext({
      permissions: ["clipboard-read", "clipboard-write"],
    });
    const newPage = await context.newPage();
    await newPage.goto(env.baseUrl);

    // Log in to Office
    const loginPage = new LoginPage(newPage);
    await loginPage.login(decrypt(email), decrypt(password));

    // Open Excel and verify Today function
    const excelPage = new ExcelPage(newPage);
    const excelTab = await excelPage.openBlankWorkbook();

    // Verify that Excel is loaded properly
    await expect(excelTab).toHaveTitle(/.*Microsoft Excel Online/);

    // Test the TODAY() function
    const isCorrectDate = await excelPage.verifyTodayFunction_alternative(
      excelTab
    );
    expect(isCorrectDate).toBeTruthy();

    await context.close();
  });

  test("Verify Excel online TODAY() function - Tooltip text", async ({
    browser,
  }) => {
    const context = await browser.newContext({
      permissions: ["clipboard-read", "clipboard-write"],
    });
    const newPage = await context.newPage();
    await newPage.goto(env.baseUrl);

    // Log in to Office
    const loginPage = new LoginPage(newPage);
    await loginPage.login(decrypt(email), decrypt(password));

    // Open Excel and verify Today function
    const excelPage = new ExcelPage(newPage);
    const excelTab = await excelPage.openBlankWorkbook();

    // Verify that Excel is loaded properly
    await expect(excelTab).toHaveTitle(/.*Microsoft Excel Online/);

    // Test the TODAY() function
    const isCorrectDate = await excelPage.verifyTodayFunction(excelTab);
    expect(isCorrectDate).toBeTruthy();
    // await context.close();
  });
});
