import { baseUrl, operatorIDfreeBets, currencyCodefreeBets, gameCodefreeBets, loadPrivateKey, generateSignature } from '../../config/operatorConfig';

describe('Operator Freebets API Tests', () => {
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
                cy.step(`Validating Freebet Response #${index + 1}`).then(() => {
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