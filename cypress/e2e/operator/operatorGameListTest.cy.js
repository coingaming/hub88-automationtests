import { baseUrl, operatorID, generateSignature } from '../../config/operatorConfig';

describe('Game List API', () => {
  it('Should return a valid list of games', () => {
    const requestBody = { operator_id: operatorID };
    const signature = generateSignature(requestBody);

    cy.log('Request Sent:', JSON.stringify(requestBody));

    cy.request({
      method: 'POST',
      url: `${baseUrl}/operator/generic/v2/game/list`,
      headers: {
        'Content-Type': 'application/json',
        'X-Hub88-Signature': signature
      },
      body: requestBody
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.be.an('array').and.have.length.greaterThan(0);

      const game = response.body[0];

      // ✅ Use cy.then() to ensure sequential execution
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



/* describe('Game Round Check API', () => {
  it('Should return a valid round check URL', () => {
    const requestBody = {
      user: "john12345",
      transaction_uuid: "16d2dcfe-b89e-11e7-854a-58404eea6d16",
      round: "rNEMwgzJAOZ6eR3V",
      operator_id: operatorID
    };
    const signature = generateSignature(requestBody);

    // Log the request details in Cypress UI
    cy.log('Request Sent:', JSON.stringify(requestBody));

    cy.request({
      method: 'POST',
      url: `${baseUrl}/operator/generic/v2/game/round`,
      headers: {
        'Content-Type': 'application/json',
        'X-Hub88-Signature': signature
      },
      body: requestBody
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('url');
    });
  });
});

describe('Game URL Generation API', () => {
  it('Should return a valid game URL', () => {
    const requestBody = {
      user: "testQA",
      token: "f562a685-a160-4d17-876d-ab3363db331c",
      sub_partner_id: "my-casino-id",
      platform: "GPL_DESKTOP",
      operator_id: operatorID,
      meta: {},
      lobby_url: "https://amazing-casino.com/lobby",
      lang: "en",
      ip: "142.245.172.168",
      game_code: "clt_dragonrising",
      deposit_url: "https://amazing-casino.com/deposit",
      currency: "EUR",
      game_currency: "EUR",
      country: "EE"
    };
    const signature = generateSignature(requestBody);

    // Log the request details in Cypress UI
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
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('url');
    });
  });
}); */