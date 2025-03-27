import { baseUrl, operatorID, generateSignature, currencyCode, gameCode, countryCode, langCode } from '../../config/operatorConfig';

const validPlatforms = ["GPL_DESKTOP", "GPL_MOBILE"];

const generateUser = () => `user_${Math.floor(Math.random() * 1000000)}`;
const generateToken = () => `${Cypress._.random(1000000000, 9999999999)}-xxxx-xxxx-xxxx-xxxxxxxxxxxx`;

describe('Provider Game URL API', () => {
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

              const signature = generateSignature(requestBody);

              cy.then(() => {
                cy.step('🚀 Sending request to Hub88');
              });

              cy.log('Request Sent:', JSON.stringify(requestBody));

              cy.request({
                method: 'POST',
                url: `${baseUrl}/operator/generic/v2/game/url`,
                headers: {
                  'Content-Type': 'application/json',
                  'X-Hub88-Signature': signature
                },
                body: requestBody
              }).then((response) => {
                
                cy.then(() => {
                    cy.step('✅ Validating response status');
                  });

                  cy.then(() => {
                    expect(response.status).to.eq(200);
                  });
                  
                  cy.then(() => {
                    cy.step('📄 Validating response body structure');
                  });

                  cy.then(() => {
                    expect(response.body).to.have.property('url').that.is.a('string');
                  });
                  
                  cy.then(() => {
                    cy.step('🔗 Validating response URL format');
                  });

                  cy.then(() => {
                    expect(response.body.url).to.match(/^https?:\/\/[^\s/$.?#].[^\s]*$/, 'Expected URL to be valid');
                  });
              });
            });
          });
        });
      });
    });
  });
});
