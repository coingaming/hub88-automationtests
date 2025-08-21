const { test, expect } = require('@playwright/test');
const { 
  baseURL,
  userProfileButton,
  logoutButton
 } = require('../pageObjects/selectors.js');

test.use({ storageState: 'storageState.json' });

test.describe('Onboarding Process Tests', () => {
  test('Should be able to click user avatar', async ({ page }) => {
    // Navigate to the application
    await page.goto(baseURL);

    // Locate the avatar button via XPath
    await page.locator(userProfileButton).click({ timeout: 3000 });
    console.log('✅ User avatar click test passed');

    // Locate the logout button via XPath
    await expect(page.locator(logoutButton)).toBeVisible();
    console.log('✅ Logout button visibility test passed');
  });

});