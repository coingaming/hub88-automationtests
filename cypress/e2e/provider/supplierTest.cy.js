import { baseUrl, signature, providerID } from '../../config/providerConfig';

describe('Provider Game List API', () => {

    const validCategories = [
        "Video Keno", "Video Bingo", "Live Poker", "Live Wheel of Fortune", "Live Sicbo", "Live Crash", "Baccarat", "Bet On Poker", 
        "Blackjack", "Casual Games", "Jackpot Slots", "Live Baccarat", "Live Blackjack", "Live Dealer", "Live Dice", "Live Games", 
        "Live Keno", "Live Lottery", "Live Roulette", "Lottery", "Multiplayer", "Player Props", "Poker", "Roulette", "Scratch Cards", 
        "Sportsbook", "Table Games", "Video Poker", "Virtual Sports", "Wheel of Fortune", "Instant Win Games", "Keno", "Bingo", "Sic Bo", 
        "Video Slots", "Unknown", "Crash", "Scratch", "Dragon Tiger", "Live Game Shows", "Live Dragon Tiger", "Crash Games", "Arcade Games", 
        "Other Table Games", "Other Live Games", "Dice", "Plinko", "Hi Lo"
    ];
    const validPlatforms = [
        "GPL_DESKTOP", "GPL_MOBILE"
    ];
  
    it('Should return a valid list of provider games', () => {
      cy.request({
        method: 'POST',
        url: `${baseUrl}/game/list`,
        headers: {
          'Content-Type': 'application/json',
          'X-Hub88-Signature': signature
        },
        body: {
          operator_id: providerID
        }
      }).then((response) => {
        // Validate the response status
        expect(response.status).to.eq(200);
  
        // Validate response is an array
        expect(response.body).to.be.an('array');
        expect(response.body.length).to.be.greaterThan(0);
  
        // Validate the first game object structure
        const game = response.body[0];
  
        expect(game).to.have.property('url_thumb').that.is.a('string');
        expect(game).to.have.property('url_background').that.is.a('string');
        expect(game).to.have.property('product').that.is.a('string');
        expect(game).to.have.property('platforms').that.is.an('array');
        game.platforms.forEach(platform => {
        expect(validPlatforms).to.include(platform); // Each platform should be either "GPL_DESKTOP" or "GPL_MOBILE"
        });
        expect(game.platforms.length).to.be.greaterThan(0);
        expect(game).to.have.property('name').that.is.a('string');
        expect(game).to.have.property('game_code').that.is.a('string');
        expect(game).to.have.property('freebet_support').that.is.a('boolean');
        expect(game).to.have.property('enabled').that.is.a('boolean');
        expect(game).to.have.property('category').that.is.a('string');
        expect(validCategories).to.include(game.category); // Check if the category is in the validCategories list
        expect(game).to.have.property('blocked_countries').that.is.an('array');
      });
    });
  
  });