import { baseUrl, baseUrlAsia, operatorIDAsia, operatorID, generateSignature, currencyCode, gameCode, gameCodeAsia, countryCode, langCode, loadPrivateKey, operatorIDfreeBets, currencyCodefreeBets, gameCodefreeBets } from '../../config/operatorConfigASIAGAMING';

const validPlatforms = ["GPL_DESKTOP", "GPL_MOBILE"];

const generateUser = () => `user_${Math.floor(Math.random() * 1000000)}`;
const generateToken = () => `${Cypress._.random(1000000000, 9999999999)}-xxxx-xxxx-xxxx-xxxxxxxxxxxx`;

describe('Provider Game URL API - EUROPE', () => {
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
              
              // Define specific game codes and their sub_partner_id
              const specialGameCodes = ['gmx_pilot'];
              const subPartnerId = specialGameCodes.includes(game) ? null : 'bender'; // Set null for special game codes, 'bender' for others
            
              const requestBody = {
                user: generateUser(),
                token: generateToken(),
                sub_partner_id: subPartnerId, // Use the conditionally set sub_partner_id
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
                    expect(response.body.url).to.include('fh8labs.com/games', 'Expected URL to contain launcher-as1.fh8labs.com/games');
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

describe('Provider Game URL API - ASIA', () => {
  before(() => {
    // Load the private key before tests run
    loadPrivateKey().then(() => {
      cy.log('Private key loaded successfully');
    });
  });

  const currencies = currencyCode.split(',').map(c => c.trim());
  const games = gameCodeAsia.split(',').map(g => g.trim());
  const countries = countryCode.split(',').map(c => c.trim());
  const languages = langCode.split(',').map(l => l.trim());

  currencies.forEach(currency => {
    games.forEach(game => {
      validPlatforms.forEach(platform => {
        countries.forEach(country => {
          languages.forEach(lang => {
            it(`Should get game URL for ${currency}, ${game}, ${platform}, ${country}, ${lang}`, () => {
              
              // Define specific game codes and their sub_partner_id
              const specialGameCodes = ['gmx_pilot'];
              const subPartnerId = specialGameCodes.includes(game) ? null : 'bender'; // Set null for special game codes, 'bender' for others
            
              const requestBody = {
                user: generateUser(),
                token: generateToken(),
                sub_partner_id: subPartnerId, // Use the conditionally set sub_partner_id
                platform: platform,
                operator_id: operatorIDAsia,
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
                  url: `${baseUrlAsia}/operator/generic/v2/game/url`,
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
                    expect(response.body.url).to.include('fh8labs.com/games', 'Expected URL to contain launcher-as1.fh8labs.com/games');
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

describe('Asia Gaming Prepaids Call Test - EUROPE', () => {
  before(() => {
    // Load the private key before tests run
    loadPrivateKey().then(() => {
      cy.log('Private key loaded successfully');
    });
  });

  const games = gameCodefreeBets.split(',').map(g => g.trim());
  const currencies = currencyCodefreeBets.split(',').map(g => g.trim());

  currencies.forEach(currency => {
    games.forEach(game => {
      it(`Should get freebets list for game code: ${currency}, ${game}`, () => {
        const requestBody = {
          operator_id: operatorIDfreeBets,
          game_code: game,
          currency: currency
        };

        cy.then(async () => {
          const signature = await generateSignature(requestBody);
          return signature;
        }).then((signature) => {
          cy.step('🚀 Sending request to Freebets API');
          cy.log('Request Sent:', JSON.stringify(requestBody));
          cy.log('Generated Signature:', signature);

          cy.request({
            method: 'POST',
            url: `${baseUrl}/operator/generic/v2/freebet/prepaids/list`,
            headers: {
              'Content-Type': 'application/json',
              'X-Hub88-Signature': signature
            },
            body: requestBody,
            failOnStatusCode: false // Temporarily for debugging
          }).then((response) => {
            expect(response.status).to.eq(200, `Expected 200 but got ${response.status}: ${JSON.stringify(response.body)}`);
            expect(response.body).to.be.an('array');

            if (response.body.length > 0) {
              response.body.forEach((freebet, index) => {
                cy.step(`Validating Prepaid #${index + 1}`).then(() => {
                  // All validations for this freebet in one block
                  expect(freebet.prepaid_uuid).to.match(
                    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
                    'prepaid_uuid should be a valid UUID'
                  );

                  expect(freebet.game_code).to.match(
                    /^[a-z]{3}_/,
                    'game_code should start with 3 letters followed by underscore'
                  );

                  expect(freebet.bet_value).to.satisfy(
                    (value) => Number.isInteger(value) || value === null,
                    'bet_value should be an integer or null'
                  );

                  expect(freebet.bet_count).to.satisfy(
                    (value) => Number.isInteger(value) || value === null,
                    'bet_count should be an integer or null'
                  );

                  expect(freebet.bonus_buy).to.be.a(
                    'boolean',
                    'bonus_buy should be a boolean'
                  );

                  // Check required fields exist
                  expect(freebet).to.have.property('prepaid_uuid');
                  expect(freebet).to.have.property('game_code');
                  expect(freebet).to.have.property('currency');
                  expect(freebet).to.have.property('bet_value');
                  expect(freebet).to.have.property('bet_count');
                  expect(freebet).to.have.property('bonus_buy');
                });
              });
            }
          });
        });
      });
    });
  });
});

describe('Asia Gaming Prepaids Call Test - ASIA', () => {
  before(() => {
    // Load the private key before tests run
    loadPrivateKey().then(() => {
      cy.log('Private key loaded successfully');
    });
  });

  const games = gameCodeAsia.split(',').map(g => g.trim());
  const currencies = currencyCodefreeBets.split(',').map(g => g.trim());

  currencies.forEach(currency => {
    games.forEach(game => {
      it(`Should get freebets list for game code: ${currency}, ${game}`, () => {
        const requestBody = {
          operator_id: operatorIDfreeBets,
          game_code: game,
          currency: currency
        };

        cy.then(async () => {
          const signature = await generateSignature(requestBody);
          return signature;
        }).then((signature) => {
          cy.step('🚀 Sending request to Freebets API');
          cy.log('Request Sent:', JSON.stringify(requestBody));
          cy.log('Generated Signature:', signature);

          cy.request({
            method: 'POST',
            url: `${baseUrl}/operator/generic/v2/freebet/prepaids/list`,
            headers: {
              'Content-Type': 'application/json',
              'X-Hub88-Signature': signature
            },
            body: requestBody,
            failOnStatusCode: false // Temporarily for debugging
          }).then((response) => {
            expect(response.status).to.eq(200, `Expected 200 but got ${response.status}: ${JSON.stringify(response.body)}`);
            expect(response.body).to.be.an('array');

            if (response.body.length > 0) {
              response.body.forEach((freebet, index) => {
                cy.step(`Validating Prepaid #${index + 1}`).then(() => {
                  // All validations for this freebet in one block
                  expect(freebet.prepaid_uuid).to.match(
                    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
                    'prepaid_uuid should be a valid UUID'
                  );

                  expect(freebet.game_code).to.match(
                    /^[a-z]{3}_/,
                    'game_code should start with 3 letters followed by underscore'
                  );

                  expect(freebet.bet_value).to.satisfy(
                    (value) => Number.isInteger(value) || value === null,
                    'bet_value should be an integer or null'
                  );

                  expect(freebet.bet_count).to.satisfy(
                    (value) => Number.isInteger(value) || value === null,
                    'bet_count should be an integer or null'
                  );

                  expect(freebet.bonus_buy).to.be.a(
                    'boolean',
                    'bonus_buy should be a boolean'
                  );

                  // Check required fields exist
                  expect(freebet).to.have.property('prepaid_uuid');
                  expect(freebet).to.have.property('game_code');
                  expect(freebet).to.have.property('currency');
                  expect(freebet).to.have.property('bet_value');
                  expect(freebet).to.have.property('bet_count');
                  expect(freebet).to.have.property('bonus_buy');
                });
              });
            }
          });
        });
      });
    });
  });
});