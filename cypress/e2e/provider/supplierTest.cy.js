import { baseUrl, signature, providerID, currencyCode, gameCode, countryCode, langCode } from '../../config/providerConfig';

describe('Provider Game List API', () => {
    const validCategories = [
        "Video Keno", "Video Bingo", "Live Poker", "Live Wheel of Fortune", "Live Sicbo", "Live Crash", "Baccarat", "Bet On Poker", 
        "Blackjack", "Casual Games", "Jackpot Slots", "Live Baccarat", "Live Blackjack", "Live Dealer", "Live Dice", "Live Games", 
        "Live Keno", "Live Lottery", "Live Roulette", "Lottery", "Multiplayer", "Player Props", "Poker", "Roulette", "Scratch Cards", 
        "Sportsbook", "Table Games", "Video Poker", "Virtual Sports", "Wheel of Fortune", "Instant Win Games", "Keno", "Bingo", "Sic Bo", 
        "Video Slots", "Unknown", "Crash", "Scratch", "Dragon Tiger", "Live Game Shows", "Live Dragon Tiger", "Crash Games", "Arcade Games", 
        "Other Table Games", "Other Live Games", "Dice", "Plinko", "Hi Lo"
    ];
    const validPlatforms = ["GPL_DESKTOP", "GPL_MOBILE"];
  
    it('Should return a valid list of provider games', () => {
        const requestBody = { operator_id: providerID };

        // Log the request details
        cy.log('Request Sent:', JSON.stringify(requestBody));

        cy.request({
            method: 'POST',
            url: `${baseUrl}/game/list`,
            headers: {
                'Content-Type': 'application/json',
                'X-Hub88-Signature': signature
            },
            body: requestBody
        }).then((response) => {
            // Validate the response status
            expect(response.status).to.eq(200);
    
            // Validate response is an array
            expect(response.body).to.be.an('array');
            expect(response.body.length).to.be.greaterThan(0);
    
            // Validate each game object structure
            response.body.forEach(game => {
                cy.wrap(game).should((gameObj) => {
                    expect(gameObj).to.have.property('url_thumb').that.is.a('string');
                    expect(gameObj).to.have.property('url_background').that.is.a('string');
                    expect(gameObj).to.have.property('product').that.is.a('string');
                    expect(gameObj).to.have.property('platforms').that.is.an('array');

                    gameObj.platforms.forEach(platform => {
                        expect(validPlatforms).to.include(platform);
                    });

                    expect(gameObj.platforms.length).to.be.greaterThan(0);
                    expect(gameObj).to.have.property('name').that.is.a('string');
                    expect(gameObj).to.have.property('game_code').that.is.a('string');
                    expect(gameObj).to.have.property('freebet_support').that.is.a('boolean');
                    expect(gameObj).to.have.property('enabled').that.is.a('boolean');
                    expect(gameObj).to.have.property('category').that.is.a('string');
                    expect(validCategories).to.include(gameObj.category);
                    expect(gameObj).to.have.property('blocked_countries').that.is.an('array');
                });
            });
        });
    });
});

const validPlatforms = ["GPL_DESKTOP", "GPL_MOBILE"];

// Function to generate a random user ID as a string
const generateUser = () => `user_${String(Math.floor(Math.random() * 1000000))}`;

// Function to generate a random UUID token
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
                            const requestBody = {
                                user: generateUser(),
                                token: generateToken(),
                                sub_partner_id: "bender",
                                platform: platform,
                                operator_id: providerID,
                                meta: {},
                                lobby_url: "https://amazing-casino.com/lobby",
                                lang: lang,
                                ip: "142.245.172.168",
                                game_code: game,
                                deposit_url: "https://amazing-casino.com/deposit",
                                currency: currency,
                                country: country
                            };

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
