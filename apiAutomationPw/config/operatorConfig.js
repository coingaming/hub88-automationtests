// Check for PLAYWRIGHT_ENV first, then NODE_ENV, default to 'eu' if neither is set
const environment = process.env.PLAYWRIGHT_ENV || process.env.NODE_ENV || 'eu';

switch (environment) {
  case 'eu':
    module.exports = {
      baseUrl: 'https://api.hub88.io',
      operatorID: 220,
      currencyCode: 'EUR, USD',
      gameCode: 'pgp_sweetbonanza1000, pgp_gatesofolympus1000, pgp_gatesofolympus, pgp_jokersjewels, pgp_sugarrush1000, pgp_sweetbonanza, pgp_savannahlegend, pgp_starlightprincess1000',
      countryCode: 'FI',
      langCode: 'en'
    };
    break;
  case 'staging':
    module.exports = {
      baseUrl: 'https://api.server1.ih.testenv.io',
      operatorID: 10,
      currencyCode: 'EUR, USD',
      gameCode: 'pgp_sweetbonanza',
      countryCode: 'FI',
      langCode: 'en'
    }; 
    break;
  case 'asia':
    module.exports = {
      baseUrl: 'https://api.as1.hub88.io',
      operatorID: 221,
      currencyCode: 'VND, JPY',
      gameCode: 'pgp_starlightprincess1000',
      countryCode: 'JP',
      langCode: 'jp'
    };
    break;
  case 'psn':
    module.exports = {
      baseUrl: 'https://api.hub88.io',
      operatorID: 220,
      currencyCode: 'EUR, USD',
      gameCode: 'psn_diamondspowerholdandwin, psn_4potsrichesholdandwin, psn_coinstrikeholdandwin, psn_legendofcleopatramegaways, psn_superchargedcloversholdandwin',
      countryCode: 'FI',
      langCode: 'en'
    };
    break;
  default:
    throw new Error(`Unknown environment: ${environment}`);
}

// npm run test-eu
// npm run test-staging
// npm run test-asia
// npm run test-psn
