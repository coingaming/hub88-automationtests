import { baseUrl, operatorID, generateSignature, currencyCode, gameCode, countryCode, langCode, loadPrivateKey } from '../../config/operatorConfig';

const validPlatforms = ["GPL_DESKTOP", "GPL_MOBILE"];

const generateUser = () => `user_${Math.floor(Math.random() * 1000000)}`;
const generateToken = () => `${Cypress._.random(1000000000, 9999999999)}-xxxx-xxxx-xxxx-xxxxxxxxxxxx`;

describe('Provider Game URL API', () => {
  before(() => {
    // Load the private key before tests run
    loadPrivateKey().then(() => {
      cy.log('Private key loaded successfully');
    });
  });

  const currencies = currencyCode.split(',').map(c => c.trim());
  const games = gameCode.split(',').map(g => g.trim());
  const countries = countryCode.split(',').map(c => c.trim());
  const languages = langCode.split(',').map(l => l.trim());

  currencies.forEach(currency => {
    games.forEach(game => {
      validPlatforms.forEach(platform => {
        countries.forEach(country => {
          languages.forEach(lang => {
            it(`Should get game URL for ${currency}, ${game}, ${platform}, ${country}, ${lang}`, () => {
              const requestBody = {
                user: generateUser(),
                token: generateToken(),
                sub_partner_id: "bender",
                platform: platform,
                operator_id: operatorID,
                meta: {},
                lobby_url: "https://amazing-casino.com/lobby",
                lang: lang,
                ip: "142.245.172.168",
                game_code: game,
                deposit_url: "https://amazing-casino.com/deposit",
                currency: currency,
                country: country
              };

              cy.then(async () => {
                const signature = await generateSignature(requestBody);
                return signature;
              }).then((signature) => {
                cy.step('🚀 Sending request to Hub88');
                cy.log('Request Sent:', JSON.stringify(requestBody));
                cy.log('Generated Signature:', signature);

                cy.request({
                  method: 'POST',
                  url: `${baseUrl}/operator/generic/v2/game/url`,
                  headers: {
                    'Content-Type': 'application/json',
                    'X-Hub88-Signature': signature
                  },
                  body: requestBody,
                  failOnStatusCode: false // Temporarily for debugging
                })
                
                .then((response) => {

                  cy.then(() => cy.step('✅ Validating response status')).then(() => {
                    expect(response.status).to.eq(200, `Expected 200 but got ${response.status}: ${JSON.stringify(response.body)}`);
                  });
                  
                  cy.then(() => cy.step('📄 Validating response body structure')).then(() => {
                    expect(response.body).to.have.property('url').that.is.a('string');
                  });

                  cy.then(() => cy.step('🔗 Validating response URL format')).then(() => {
                    expect(response.body.url).to.match(/^https?:\/\/[^\s/$.?#].[^\s]*$/, 'Expected URL to be valid');
                    expect(response.body.url).to.include('launcher.server1.ih.testenv.io/games', 'Expected URL to contain launcher-as1.fh8labs.com/games');
                  });
                });
              });
            });
          });
        });
      });
    });
  });
});