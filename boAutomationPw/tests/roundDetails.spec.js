const { test, expect } = require('@playwright/test');
const config = require('../config/test.config.js');
const {
  rangeSelector,
  rangeOption,
  applyRangeButton,
  supplierFilterTab,
  supplierDropdown,
  supplierBox,
  supplierSearchInput,
  firstSupplierButton,
  firstTableRoundDetailsButton
} = require('../pageObjects/transactions.js');

test.use({ storageState: 'storageState.json' });

const suppliers = [
  "Pragmatic Play", "Hacksaw Gaming"
];

// Use config instead of hardcoded URL
const endpoint = config.endpoints.transactions;

test.describe('Supplier roundDetails check', () => { 
  for (const supplier of suppliers) {
    test(`Check roundDetails for supplier: ${supplier}`, async ({ page }) => {
      // Go to endpoint
      await page.goto(endpoint);

      // Click sequence to open supplier selection
      await page.locator(rangeSelector).first().click();
      await page.locator(rangeOption).click();
      await page.locator(applyRangeButton).click();

      // Selector of Filter Tabs - Select Supplier Filter
      await page.locator(supplierFilterTab).click();
      await page.locator('xpath=/html/body/div/div/div/main/div/div[1]/div[1]/div[5]/div/div/div/div[9]').click();

      // Open supplier dropdown only if supplierBox is not visible
      const isSupplierBoxVisible = await page.locator(supplierBox).isVisible();
      if (!isSupplierBoxVisible) {
        await page.locator(supplierDropdown).click();
      }

      // click the input field to search for the supplier
      const input = await page.waitForSelector(supplierSearchInput, { state: 'visible' });
      await input.click({ clickCount: 3 }); // Select existing text
      await input.type(supplier, { delay: 50 }); // Type the value like a user

      // Click the first label/div in the dropdown list
      const firstSupplierOption = page.locator(firstSupplierButton);
      await page.waitForSelector(firstSupplierButton, { timeout: 1000 });
      await expect(firstSupplierOption).toBeVisible();
      await firstSupplierOption.click();

      // Click outside to confirm selection
      await page.locator('img[alt="logo"]').click();

      // Wait for the table to load and check the first data row
      await expect(page.locator('table tr').nth(1)).toContainText(supplier, { timeout: 5000 });

      // 1. Override window.open to prevent new tabs
      await page.addInitScript(() => {
        window.open = (url) => {
          console.log('Blocked opening new tab to:', url);
          // Don't open a new tab at all
        };
      });

      // Track if a new tab was opened
      let newTabOpened = false;

      page.context().on('page', async (newPage) => {
        newTabOpened = true;
        console.log('✅ New tab detected — closing it');
        await newPage.close();
      });

      const waitForNewTab = page.context().waitForEvent('page');

      // Click the button that may open a new tab
      await page.locator(firstTableRoundDetailsButton).first().click();

      // Give it a short time to possibly open a tab
      await Promise.race([
        waitForNewTab,
        page.waitForTimeout(2000) // Only wait as long as needed
      ]);

      // Assert that a new tab was triggered
      expect(newTabOpened).toBeTruthy();
      // await waitForNewTab.waitForLoadState();
      // console.log('New tab URL:', waitForNewTab.url());
    });
  }
});