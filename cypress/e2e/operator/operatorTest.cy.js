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

  import axios from 'axios';
import { baseUrl, operatorID, generateSignature } from './operatorConfig';

const validPlatforms = ["GPL_DESKTOP", "GPL_MOBILE"];

const generateUser = () => `user_${String(Math.floor(Math.random() * 1000000))}`;
const generateToken = () => Cypress._.random(1000000000, 9999999999).toString() + '-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

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
                            cy.step(`New Game Launcher request sent to the Supplier`);
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

                            // Log the request details in Cypress UI
                            cy.log('Request Sent:', JSON.stringify(requestBody));

                            cy.request({
                                method: 'POST',
                                url: `${baseUrl}/game/url`,
                                headers: {
                                    'Content-Type': 'application/json',
                                    'X-Hub88-Signature': signature
                                },
                                body: requestBody
                            }).then((response) => {
                                // Validate the response status
                                expect(response.status).to.eq(200);

                                // Validate the response contains a URL
                                expect(response.body).to.have.property('url').that.is.a('string');
                                expect(response.body.url).to.match(/^https?:\/\//);
                            });
                        });
                    });
                });
            });
        });
    });
});
