const { test, expect } = require('@playwright/test');
const selectors = require('../utils/selectors.js');

// test.use({ storageState: 'storageState.json' });


test.beforeEach(async ({ context }) => {
  await context.storageState({ path: 'storageState.json' });
});


test.describe('Onboarding Process Tests', () => {

  test('Should be able to click user avatar', async ({ page }) => {
    // Navigate to the application
    await page.goto(selectors.baseURL, { timeout: 5000 });

    // Locate the avatar button via XPath
    await page.locator(selectors.userProfileButton).click({ timeout: 3000 });
    console.log('✅ User avatar click test passed');

    // Locate the logout button via XPath
    await expect(page.locator(selectors.logoutButton)).toBeVisible();
    console.log('✅ Logout button visibility test passed');
  });

  test('Should be able to fill organization name', async ({ page }) => {
    // Navigate to the application
    await page.goto(selectors.baseURL, { timeout: 5000 });

    await page.locator(selectors.nameInput).fill('qaTest Organization');
    await expect(page.locator(selectors.nameInput)).toHaveValue('qaTest Organization');
    console.log('✅ Organization name test passed');
  });

  test('Should be able to select country', async ({ page }) => {
    // Navigate to the application
    await page.goto(selectors.baseURL, { timeout: 5000 });

    await expect(page.locator(selectors.countryButton)).toBeVisible();
    await page.locator(selectors.countryButton).click({ timeout: 3000 });
    console.log('✅ Country button click test passed');

    await page.locator(selectors.brazilCountry).click({ timeout: 3000 });
    await expect(page.getByText('+55 🇧🇷')).toBeVisible();
    console.log('✅ Country code test passed');
  });

  test('Should be able to fill phone number', async ({ page }) => {
    // Navigate to the application
    await page.goto(selectors.baseURL, { timeout: 5000 });

    await page.locator(selectors.phoneInput).fill('123456789');
    await expect(page.locator(selectors.phoneInput)).toHaveValue('123456789');
    console.log('✅ Phone number test passed');
  });
});