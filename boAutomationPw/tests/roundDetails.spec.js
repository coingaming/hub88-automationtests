const { test, expect } = require('@playwright/test');
const config = require('../config/test.config.js');

test.use({ storageState: 'storageState.json' });

const suppliers = [
  "Pragmatic Play", "Hacksaw Gaming", "Evolution Gaming", "Play'n Go", "Nolimit City", "3Oaks", "PGSoft", "Push Gaming", "Live88", "Amusnet", "OneTouch", "Playson", "NetEnt", "VoltEnt", "Peter & Sons", "Relax Gaming", "Endorphina", "Spribe", "Spinomenal", "Penguin King", "Betsoft", "Novomatic", "Microgaming Live", "BGaming", "Blueprint Gaming", "Games Global", "Pragmatic Play Live", "AvatarUX", "RubyPlay", "Dragon Gaming", "Red Tiger Gaming", "Kalamba Games", "KA Gaming", "TrueLab", "Microgaming", "Caleta Gaming", "ShadyLady", "Ezugi", "Fazi", "Turbogames", "Thunderkick", "SlotMill Games", "SmartSoft", "BetsyGames", "Just Slots", "Barbarabang", "Evoplay Entertainment", "Big Time Gaming", "BELATRA", "Platipus", "GameArt", "Oddin", "Habanero", "Popiplay", "Aviatrix", "Mascot Gaming", "Red Rake Gaming", "Octoplay", "Booming Games", "Gamomat", "Winfinity", "Fugaso", "Gamzix", "Fantasma", "Onlyplay", "155.io", "Gameburger", "SwinttPremium", "Darwin Gaming", "Triple Edge", "Apparat Gaming", "TopSpin Games", "Retro Gaming", "Split The Pot", "Mancala Gaming", "Wazdan", "Creedroomz", "BetGames.TV", "Rogue", "G Games", "1x2gaming", "7777Gaming", "NetGaming", "KingMidas", "Oryx Gaming", "GamingCorps", "ElaGames", "SwinttGames", "Playnetic", "WinFast", "CQ9", "SpinPlay Games", "Tangente", "Atomic Slot Lab", "SpinLogic", "SkyWind Live", "JVL", "Yolted", "7Mojos", "FBastards", "Popok", "Felix Gaming", "Stormcraft", "Neon Valley", "Galaxsys", "VivoGaming", "Northern Lights Gaming", "Snowborn Studios", "AirDice", "Pascal", "SkyWind", "JDB Gaming", "Spinthon", "PlayAce", "Golden Race", "LiveGames", "Alchemy Gaming", "NE Games", "Red Desert", "Popok Live", "Pragmatic Play Virtual Sports", "Flatdog Games", "Live Solutions", "Livespins", "Sexy", "Phoenix 7", "Buck Stakes Entertainment", "Speedy Tomatoes", "GP1", "IGTech", "Famous Games", "H27", "OneGame", "Wild Gaming", "100HP Gaming", "Animo Live", "Brino Games", "Victory Ark", "SKILLEX GAMES", "ColossusBets", "Elbet", "Studio21", "5G", "VegasLounge", "clawbuster", "Konquer", "Gosh", "Boldplay", "Popok Instant", "Gametech", "Slingshot", "Foxium", "Kero", "SlotMatrix", "All41", "Zillion", "Bitblox Games", "Low6", "JFTW", "7Mojos Live"
];

// Use config instead of hardcoded URL
const endpoint = config.endpoints.transactions;

test.describe('Supplier roundDetails GraphQL check', () => {
  for (const supplier of suppliers) {
    test(`Check roundDetails for supplier: ${supplier}`, async ({ page }) => {
      // Go to endpoint
      await page.goto(endpoint);

      // Click sequence to open supplier selection
      await page.locator('xpath=/html/body/div/div/div/main/div/div[1]/div[1]/div[1]/button').click();
      await page.locator('xpath=/html/body/div/div/div/main/div/div[1]/div[1]/div[1]/div/div/ul/li[3]').click();
      await page.locator('xpath=/html/body/div/div/div/main/div/div[1]/div[1]/div[1]/div/div/div[3]/button').click();

      // Selector of Filter Tabs
      await page.locator('xpath=/html/body/div/div/div/main/div/div[1]/div[1]/div[5]/button').click();

      // Open Supplier Filter
      await page.locator('xpath=/html/body/div/div/div/main/div/div[1]/div[1]/div[5]/div/div/div/div[9]').click();

      // Open supplier dropdown
      await page.locator('xpath=/html/body/div/div/div/main/div/div[1]/div[2]/div/button').click();

      // Click the supplier input field
      await page.locator('xpath=/html/body/div/div/div/main/div/div[1]/div[2]/div/div/div/div[1]/div/input').click();
      // Type the supplier name
      await page.keyboard.type(supplier);

      // Click the first label/div in the dropdown list
      const firstSupplierOption = page.locator('xpath=/html/body/div/div/div/main/div/div[1]/div[2]/div/div/div/div[3]/div[1]');
      await expect(firstSupplierOption).toBeVisible();
      await firstSupplierOption.click();

      // Click outside to confirm selection
      await page.locator('xpath=/html/body/div/div/div/main/div/div[1]/div[2]/div/div/div').click();

      // Confirm selection by clicking outside
      await page.locator('xpath=/html/body/div/div/div/main/div/div[1]/div[2]/div/div/div').click();

      // Click the first button in the table
      await page.locator('xpath=/html/body/div/div/div/main/div/div[3]/div[1]/table/tbody/tr[1]/td[10]/div[2]/button[1]').click();

      // Wait for GraphQL roundDetails request and check response
      const [graphql] = await Promise.all([
        page.waitForResponse(resp =>
          resp.url().includes('/graphql') &&
          resp.request().postData()?.includes('roundDetails')
        ),
      ]);

      expect(graphql.status()).toBe(200);
      const json = await graphql.json();
      expect(json.data).toBeDefined();
      expect(json.data.roundDetails).toMatch(/^https:\/\/launcher-eu1\.fh8labs\.com\/round\/evolution\?payload=/);

      // Clean supplier selection
      await page.locator('xpath=/html/body/div/div/div/main/div/div[1]/div[2]/div/button/div/div[2]').click();
    });
  }
});