import { baseUrl, operatorID, generateSignature, loadPrivateKey } from '../../config/operatorConfig';

describe('Game List API', () => {
  before(() => {
    // Load the private key before tests run
    loadPrivateKey().then(() => {
      cy.log('Private key loaded successfully');
    });
  });

  it('Should return a valid list of games', () => {
    const requestBody = { operator_id: operatorID };

    cy.then(async () => {
      const signature = await generateSignature(requestBody);
      return signature;
    }).then((signature) => {
      cy.log('Request Sent:', JSON.stringify(requestBody));
      cy.log('Generated Signature:', signature);

      cy.request({
        method: 'POST',
        url: `${baseUrl}/operator/generic/v2/game/list`,
        headers: {
          'Content-Type': 'application/json',
          'X-Hub88-Signature': signature
        },
        body: requestBody,
        failOnStatusCode: false // Temporarily for debugging
      }).then((response) => {
        expect(response.status).to.eq(200, `Expected 200 but got ${response.status}: ${JSON.stringify(response.body)}`);
        expect(response.body).to.be.an('array').and.have.length.greaterThan(0);

        const game = response.body[0];

        cy.then(() => cy.step('Checking url_thumb, should be a valid URL')).then(() => {
          expect(game).to.have.property('url_thumb').that.is.a('string').and.satisfy(url => {
            return /^https?:\/\/[^\s/$.?#].[^\s]*$/.test(url);
          }, 'Expected url_thumb to be a valid URL');
        });

        cy.then(() => cy.step('Checking url_background, should be a valid URL')).then(() => {
          expect(game).to.have.property('url_background').that.is.a('string').and.satisfy(url => {
            return /^https?:\/\/[^\s/$.?#].[^\s]*$/.test(url);
          }, 'Expected url_background to be a valid URL');
        });

        cy.then(() => cy.step('Checking product, should be a string')).then(() => {
          expect(game).to.have.property('product').that.is.a('string');
        });

        cy.then(() => cy.step('Checking platforms, should be an array')).then(() => {
          expect(game).to.have.property('platforms').that.is.an('array');
        });

        cy.then(() => cy.step('Checking name, should be a string')).then(() => {
          expect(game).to.have.property('name').that.is.a('string');
        });

        cy.then(() => cy.step('Checking game_code, should be a string')).then(() => {
          expect(game).to.have.property('game_code').that.is.a('string');
        });

        cy.then(() => cy.step('Checking freebet_support, should be a boolean')).then(() => {
          expect(game).to.have.property('freebet_support').that.is.a('boolean');
        });

        cy.then(() => cy.step('Checking enabled, should be a boolean')).then(() => {
          expect(game).to.have.property('enabled').that.is.a('boolean');
        });

        cy.then(() => cy.step('Checking phoenix_jackpot_support, should be a boolean or null')).then(() => {
          expect(game).to.have.property('phoenix_jackpot_support').and.satisfy(val => typeof val === 'boolean' || val === null);
        });

        cy.then(() => cy.step('Checking category, should be a string or null')).then(() => {
          expect(game).to.have.property('category').and.satisfy(val => typeof val === 'string' || val === null);
        });

        cy.then(() => cy.step('Checking blocked_countries, should be an array or null')).then(() => {
          expect(game).to.have.property('blocked_countries').and.satisfy(val => Array.isArray(val) || val === null);
        });

        cy.then(() => cy.step('Checking release_date, should be a string or null')).then(() => {
          expect(game).to.have.property('release_date').and.satisfy(val => typeof val === 'string' || val === null);
        });

        cy.then(() => cy.step('Checking volatility, should be a number or null')).then(() => {
          expect(game).to.have.property('volatility').and.satisfy(val => typeof val === 'number' || val === null);
        });

        cy.then(() => cy.step('Checking rtp, should be a string or null')).then(() => {
          expect(game).to.have.property('rtp').and.satisfy(val => typeof val === 'string' || val === null);
        });

        cy.then(() => cy.step('Checking paylines, should be a number or null')).then(() => {
          expect(game).to.have.property('paylines').and.satisfy(val => typeof val === 'number' || val === null);
        });

        cy.then(() => cy.step('Checking hit_ratio, should be a string or null')).then(() => {
          expect(game).to.have.property('hit_ratio').and.satisfy(val => typeof val === 'string' || val === null);
        });

        cy.then(() => cy.step('Checking certifications, should be an array or null')).then(() => {
          expect(game).to.have.property('certifications').and.satisfy(val => Array.isArray(val) || val === null);
        });

        cy.then(() => cy.step('Checking languages, should be an array or null')).then(() => {
          expect(game).to.have.property('languages').and.satisfy(val => Array.isArray(val) || val === null);
        });

        cy.then(() => cy.step('Checking technology, should be an array or null')).then(() => {
          expect(game).to.have.property('technology').and.satisfy(val => Array.isArray(val) || val === null);
        });

        cy.then(() => cy.step('Checking features, should be an array or null')).then(() => {
          expect(game).to.have.property('features').and.satisfy(val => Array.isArray(val) || val === null);
        });
      });
    });
  });
});