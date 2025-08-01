const { test, expect } = require('@playwright/test');
const config = require('../config/test.config.js');
const {
  rangeSelector,
  yesterdayOption,
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
  "Pragmatic Play", "Hacksaw Gaming", "Evolution Gaming", "Play'n Go", "Nolimit City", "3Oaks", "PGSoft", "Push Gaming", "Live88", "Amusnet", "OneTouch", "Playson", "NetEnt", "VoltEnt", "Peter & Sons", "Relax Gaming", "Endorphina", "Spribe", "Spinomenal", "Penguin King", "Betsoft", "Novomatic", "Microgaming Live", "BGaming", "Blueprint Gaming", "Games Global", "Pragmatic Play Live", "AvatarUX", "RubyPlay", "Dragon Gaming", "Red Tiger Gaming", "Kalamba Games", "KA Gaming", "TrueLab", "Microgaming", "Caleta Gaming", "ShadyLady", "Ezugi", "Fazi", "Turbogames", "Thunderkick", "SlotMill Games", "SmartSoft", "BetsyGames", "Just Slots", "Barbarabang", "Evoplay Entertainment", "Big Time Gaming", "BELATRA", "Platipus", "GameArt", "Oddin", "Habanero", "Popiplay", "Aviatrix", "Mascot Gaming", "Red Rake Gaming", "Octoplay", "Booming Games", "Gamomat", "Winfinity", "Fugaso", "Gamzix", "Fantasma", "Onlyplay", "155.io", "Gameburger", "SwinttPremium", "Darwin Gaming", "Triple Edge", "Apparat Gaming", "TopSpin Games", "Retro Gaming", "Split The Pot", "Mancala Gaming", "Wazdan", "Creedroomz", "BetGames.TV", "Rogue", "G Games", "1x2gaming", "7777Gaming", "NetGaming", "KingMidas", "Oryx Gaming", "GamingCorps", "ElaGames", "SwinttGames", "Playnetic", "WinFast", "CQ9", "SpinPlay Games", "Tangente", "Atomic Slot Lab", "SpinLogic", "SkyWind Live", "JVL", "Yolted", "7Mojos", "FBastards", "Popok", "Felix Gaming", "Stormcraft", "Neon Valley", "Galaxsys", "VivoGaming", "Northern Lights Gaming", "Snowborn Studios", "AirDice", "Pascal", "SkyWind", "JDB Gaming", "Spinthon", "PlayAce", "Golden Race", "LiveGames", "Alchemy Gaming", "NE Games", "Red Desert", "Popok Live", "Pragmatic Play Virtual Sports", "Flatdog Games", "Live Solutions", "Livespins", "Sexy", "Phoenix 7", "Buck Stakes Entertainment", "Speedy Tomatoes", "GP1", "IGTech", "Famous Games", "H27", "OneGame", "Wild Gaming", "100HP Gaming", "Animo Live", "Brino Games", "Victory Ark", "SKILLEX GAMES", "ColossusBets", "Elbet", "Studio21", "5G", "VegasLounge", "clawbuster", "Konquer", "Gosh", "Boldplay", "Popok Instant", "Gametech", "Slingshot", "Foxium", "Kero", "SlotMatrix", "All41", "Zillion", "Bitblox Games", "Low6", "JFTW", "7Mojos Live"
];

// Use config instead of hardcoded URL
const endpoint = config.endpoints.transactions;
const apiEndpoint = config.endpoints.baseUrl;

test.describe('Supplier roundDetails GraphQL check', () => {
  for (const supplier of suppliers) {
    test(`Check roundDetails for supplier: ${supplier}`, async ({ page }) => {
      // Go to endpoint
      await page.goto(endpoint);

      // Click sequence to open supplier selection
      await page.locator(rangeSelector).first().click();
      await page.locator(yesterdayOption).click();
      await page.locator(applyRangeButton).click();

      // Selector of Filter Tabs
      await page.locator(supplierFilterTab).click();

      // Open Supplier Filter
      await page.locator('xpath=/html/body/div/div/div/main/div/div[1]/div[1]/div[5]/div/div/div/div[9]').click();

      // Open supplier dropdown only if supplierBox is not visible
      const isSupplierBoxVisible = await page.locator(supplierBox).isVisible();
      if (!isSupplierBoxVisible) {
        await page.locator(supplierDropdown).click();
      }

      // click the input field to search for the supplier
      const input = await page.waitForSelector(supplierSearchInput, { state: 'visible' });
      await input.click({ clickCount: 3 }); // Select existing text
      await input.fill('');                 // Clear the field
      await input.type(supplier, { delay: 50 }); // Type the value like a user

      // Click the first label/div in the dropdown list
      const firstSupplierOption = page.locator(firstSupplierButton);
      await page.waitForSelector(firstSupplierButton, { timeout: 1000 });
      await expect(firstSupplierOption).toBeVisible();
      await firstSupplierOption.click();

      // Click outside to confirm selection
      await page.locator(supplierDropdown).click();

      // 1. Override window.open to prevent new tabs
      await page.addInitScript(() => {
        window.open = (url) => {
          console.log('Blocked opening new tab to:', url);
          // Don't open a new tab at all
        };
      });

      // 2. Listen for new pages and close them immediately if any slip through
      page.context().on('page', async (newPage) => {
        console.log('⚠️ New tab detected and will be closed');
        await newPage.close();
      });

      // Track if a new tab was opened
      let newTabOpened = false;

      page.context().on('page', async (newPage) => {
        newTabOpened = true;
        console.log('⚠️ New tab detected — closing it');
        await newPage.close();
      });

      // Click the button that may open a new tab
      await page.locator(firstTableRoundDetailsButton).first().click();

      // Give it a short time to possibly open a tab
      await page.waitForTimeout(1000); // Adjust if needed

      // Assert that a new tab was triggered
      expect(newTabOpened).toBeTruthy();

    //   // Clean supplier selection
    //   const input2 = await page.waitForSelector('//button[.//div[contains(text(), "Suppliers: 1")]]', { state: 'visible' });
    //   await input2.hover();
    //   await page.locator('//svg[contains(@class, "IconCloseRounded")]').click();
    // });

    // 1. Locate the button that contains the "Suppliers: 1" label
      const supplierButton = page.locator('//button[.//div[contains(text(), "Suppliers: 1")]]');
      await supplierButton.hover();

      const closeIcon = page.locator(`//*[@id="root"]/div/div/main/div/div[1]/div[2]/div/button/div/div[2]`);

      await closeIcon.click({ timeout: 2000 });
    });
  }
});