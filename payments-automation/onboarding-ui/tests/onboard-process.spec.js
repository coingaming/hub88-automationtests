const { test, expect } = require('@playwright/test');
const { 
  baseURL,
  userProfileButton,
  logoutButton,
  nameInput
 } = require('../pageObjects/selectors.js');

test.use({ storageState: 'storageState.json' });

test.describe('Onboarding Process Tests', () => {
  // 
  test('Should be able to click user avatar', async ({ page }) => {
    // Navigate to the application
    await page.goto(baseURL, { timeout: 5000 });

    // Locate the avatar button via XPath
    await page.locator(userProfileButton).click({ timeout: 3000 });
    console.log('✅ User avatar click test passed');

    // Locate the logout button via XPath
    await expect(page.locator(logoutButton)).toBeVisible();
    console.log('✅ Logout button visibility test passed');
  });

  test('Should be able to fill organization name', async ({ page }) => {
    // Navigate to the application
    await page.goto(baseURL, { timeout: 5000 });

    await page.locator(nameInput).fill('qaTest Organization');
    await expect(page.locator(nameInput)).toHaveValue('qaTest Organization');
    console.log('✅ Organization name test passed');
  });
});