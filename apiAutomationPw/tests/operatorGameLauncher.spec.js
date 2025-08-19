const { test, expect } = require('@playwright/test');
const { baseUrl, operatorID, currencyCode, gameCode, countryCode, langCode } = require('../config/operatorConfig.js');
const { loadPrivateKey, generateSignature } = require('../utils/cryptoUtils.js');

const validPlatforms = ['GPL_DESKTOP', 'GPL_MOBILE'];

const generateUser = () => `user_${Math.floor(Math.random() * 1000000)}`;
const generateToken = () => `${Math.floor(Math.random() * 1e10)}-xxxx-xxxx-xxxx-xxxxxxxxxxxx`;

test.describe('Provider Game URL API', () => {
  const currencies = currencyCode.split(',').map(c => c.trim());
  const games = gameCode.split(',').map(g => g.trim());
  const countries = countryCode.split(',').map(c => c.trim());
  const languages = langCode.split(',').map(l => l.trim());

  test.beforeAll(() => {
    loadPrivateKey();
    console.log('🔑 Private key loaded successfully');
  });

  currencies.forEach(currency => {
    games.forEach(game => {
      validPlatforms.forEach(platform => {
        countries.forEach(country => {
          languages.forEach(lang => {
            test(`Should get game URL for ${currency}, ${game}, ${platform}, ${country}, ${lang}`, async () => {
              const specialGameCodes = ['gmx_pilot', 'btsg_sportbetting'];
              const subPartnerId = specialGameCodes.includes(game) ? null : '';

              const requestBody = {
                user: generateUser(),
                token: generateToken(),
                sub_partner_id: subPartnerId,
                platform,
                operator_id: operatorID,
                meta: {},
                lobby_url: 'https://amazing-casino.com/lobby',
                lang,
                ip: '0.0.0.0',
                game_code: game,
                deposit_url: 'https://amazing-casino.com/deposit',
                currency,
                country
              };

              const signature = generateSignature(requestBody);

              // console.log('🚀 Sending request:', JSON.stringify(requestBody));
              // console.log('🔏 Signature:', signature);
              console.log('Request sent');

              const response = await fetch(`${baseUrl}/operator/generic/v2/game/url`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'X-Hub88-Signature': signature
                },
                body: JSON.stringify(requestBody)
              });

              const body = await response.json();
              console.log('Response received');

              expect(response.status).toBe(200);
              expect(body).toHaveProperty('url');
              expect(typeof body.url).toBe('string');
              expect(body.url).toMatch(/^https?:\/\/[^\s/$.?#].[^\s]*$/);
              console.log('✅ Test passed');

            });
          });
        });
      });
    });
  });
});
