import { baseUrl, signature, operatorID } from '../../config/operatorConfig';

describe('Game List API', () => {
  it('Should return a valid list of games', () => {
    cy.request({
      method: 'POST',
      url: `${baseUrl}/operator/generic/v2/game/list`,
      headers: {
        'Content-Type': 'application/json',
        'X-Hub88-Signature': signature
      },
      body: {
        operator_id: operatorID
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.be.an('array');
      expect(response.body.length).to.be.greaterThan(0);

      const game = response.body[0];

      expect(game).to.have.property('url_thumb').that.is.a('string');
      expect(game).to.have.property('url_background').that.is.a('string');
      expect(game).to.have.property('product').that.is.a('string');
      expect(game).to.have.property('platforms').that.is.an('array');
      expect(game).to.have.property('name').that.is.a('string');
      expect(game).to.have.property('game_code').that.is.a('string');
      expect(game).to.have.property('freebet_support').that.is.a('boolean');
      expect(game).to.have.property('phoenix_jackpot_support').that.is.a('boolean');
      expect(game).to.have.property('enabled').that.is.a('boolean');
      expect(game).to.have.property('category').that.is.a('string');
      expect(game).to.have.property('blocked_countries').that.is.an('array');
      expect(game).to.have.property('release_date').that.is.a('string');
      expect(game).to.have.property('volatility').that.is.a('number');
      expect(game).to.have.property('rtp').that.is.a('string');
      expect(game).to.have.property('paylines').that.is.a('number');
      expect(game).to.have.property('hit_ratio').that.is.a('string');
      expect(game).to.have.property('certifications').that.is.an('array');
      expect(game).to.have.property('languages').that.is.an('array');
      expect(game).to.have.property('technology').that.is.an('array');
      expect(game).to.have.property('features').that.is.an('array');
    });
  });
});


describe('Game Round Check API', () => {
    it('Should return a valid round check URL', () => {
      cy.request({
        method: 'POST',
        url: `${baseUrl}/operator/generic/v2/game/round`,
        headers: {
          'Content-Type': 'application/json',
          'X-Hub88-Signature': signature
        },
        body: {
          user: "john12345",
          transaction_uuid: "16d2dcfe-b89e-11e7-854a-58404eea6d16",
          round: "rNEMwgzJAOZ6eR3V",
          operator_id: 1
        }
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('url');
      });
    });
  });

  describe('Game URL Generation API', () => {
    it('Should return a valid game URL', () => {
      cy.request({
        method: 'POST',
        url: `${baseUrl}/operator/generic/v2/game/url`,
        headers: {
          'Content-Type': 'application/json',
          'X-Hub88-Signature': signature
        },
        body: {
          user: "testQA",
          token: "f562a685-a160-4d17-876d-ab3363db331c",
          sub_partner_id: "my-casino-id",
          platform: "GPL_DESKTOP",
          operator_id: 1,
          meta: {},
          lobby_url: "https://amazing-casino.com/lobby",
          lang: "en",
          ip: "142.245.172.168",
          game_code: "clt_dragonrising",
          deposit_url: "https://amazing-casion.com/deposit",
          currency: "EUR",
          game_currency: "EUR",
          country: "EE"
        }
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('url');
      });
    });
  });