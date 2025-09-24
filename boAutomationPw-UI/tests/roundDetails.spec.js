const { test, expect } = require('@playwright/test');
const config = require('../config/test.config.js');
const {
  rangeSelector,
  rangeOption,
  applyRangeButton,
  addFilterTab,
  supplierSearchInput,
  firstTableRoundDetailsButton,
  statusSearchInput
} = require('../pageObjects/transactions.js');

test.use({ storageState: 'storageState.json' });

// const suppliers = [
//   "Pragmatic Play", "Hacksaw Gaming", "Evolution Gaming", "Play'n Go", "Nolimit City", "3Oaks", "PGSoft", "Push Gaming", "Live88", "Amusnet", "OneTouch", "Playson", "NetEnt", "VoltEnt", "Peter & Sons", "Relax Gaming", "Endorphina", "Spribe", "Spinomenal", "Penguin King", "Betsoft", "Novomatic", "Microgaming Live", "BGaming", "Blueprint Gaming", "Games Global", "Pragmatic Play Live", "AvatarUX", "RubyPlay", "Dragon Gaming", "Red Tiger Gaming", "Kalamba Games", "KA Gaming", "TrueLab", "Microgaming", "Caleta Gaming", "ShadyLady", "Ezugi", "Fazi", "Turbogames", "Thunderkick", "SlotMill Games", "SmartSoft", "BetsyGames", "Just Slots", "Barbarabang", "Evoplay Entertainment", "Big Time Gaming", "BELATRA", "Platipus", "GameArt", "Oddin", "Habanero", "Popiplay", "Aviatrix", "Mascot Gaming", "Red Rake Gaming", "Octoplay", "Booming Games", "Gamomat", "Winfinity", "Fugaso", "Gamzix", "Fantasma", "Onlyplay", "155.io", "Gameburger", "SwinttPremium", "Darwin Gaming", "Triple Edge", "Apparat Gaming", "TopSpin Games", "Retro Gaming", "Split The Pot", "Mancala Gaming", "Wazdan", "Creedroomz", "BetGames.TV", "Rogue", "G Games", "1x2gaming", "7777Gaming", "NetGaming", "KingMidas", "Oryx Gaming", "GamingCorps", "ElaGames", "SwinttGames", "Playnetic", "WinFast", "CQ9", "SpinPlay Games", "Tangente", "Atomic Slot Lab", "SpinLogic", "SkyWind Live", "JVL", "Yolted", "7Mojos", "FBastards", "Popok", "Felix Gaming", "Stormcraft", "Neon Valley", "Galaxsys", "VivoGaming", "Northern Lights Gaming", "Snowborn Studios", "AirDice", "Pascal", "SkyWind", "JDB Gaming", "Spinthon", "PlayAce", "Golden Race", "LiveGames", "Alchemy Gaming", "NE Games", "Red Desert", "Popok Live", "Pragmatic Play Virtual Sports", "Flatdog Games", "Live Solutions", "Livespins", "Sexy", "Phoenix 7", "Buck Stakes Entertainment", "Speedy Tomatoes", "IGTech", "H27", "OneGame", "100HP Gaming", "Brino Games", "Victory Ark", "SKILLEX GAMES", "Boldplay", "Popok Instant", "Gametech", "Slingshot", "Foxium", "Kero", "SlotMatrix", "All41", "Zillion", "Bitblox Games", "Low6", "JFTW", "7Mojos Live"
// ];

const suppliers = [
  "Novomatic", "Pragmatic Play Live"
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
      await page.locator(addFilterTab).click();
      await page.locator('div[class*="FilterDropdown"]').getByText('Suppliers', { exact: true }).click();

      // click the input field to search for the supplier
      const input = await page.waitForSelector(supplierSearchInput, { state: 'visible' });
      await input.click({ clickCount: 3 }); // Select existing text
      await input.type(supplier, { delay: 50 }); // Type the value like a user

      // Click the first label/div in the dropdown list
      const supplierSelector = `//div[div[div[normalize-space(text())="${supplier}"]]]`;
      const firstSupplierOption = page.locator(supplierSelector);
      await page.waitForSelector(supplierSelector, { timeout: 1000 });
      await expect(firstSupplierOption).toBeVisible();
      await firstSupplierOption.click();

      // Click outside to confirm selection
      await page.locator('img[alt="logo"]').click();

      // Selector of Filter Tabs - Select Status Filter
      await page.locator(addFilterTab).click();
      await page.locator('div[class*="FilterDropdown"]').getByText('Statuses', { exact: true }).click();
      
      // click on the status Success
      const inputStatus = await page.waitForSelector(statusSearchInput, { state: 'visible' });
      await inputStatus.click();

      // Click outside to confirm selection
      await page.locator('img[alt="logo"]').click();

      // Wait for the table to load and check the first data row
      await expect(page.locator('table tr').nth(1)).toContainText(supplier, { timeout: 5000 });
      await expect(page.locator('table tr').nth(1)).toContainText('Success', { timeout: 5000 });

      // Override window.open to prevent new tabs
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
        console.log('✅ Round Details Available');
        await newPage.close();
      });

      // Click the button that may open a new tab
      let buttonAvailable = true;
      try {
        await page.locator(firstTableRoundDetailsButton).first().click({ timeout: 5000 });
      } catch {
        console.log('✅ The Round Details button is not available');
        buttonAvailable = false;
      }

      // Only proceed with tab verification if the button was available
      if (buttonAvailable) {
        // Set up the wait for new tab event
        const waitForNewTab = page.context().waitForEvent('page');
        
        // Give it a short time to possibly open a tab
        await Promise.race([
          waitForNewTab,
          page.waitForTimeout(20000) // Only wait as long as needed
        ]);

        // Assert that a new tab was triggered
        expect(newTabOpened).toBeTruthy();
      }
    });
  }
});