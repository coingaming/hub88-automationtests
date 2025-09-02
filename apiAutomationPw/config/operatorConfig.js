const environment = process.env.NODE_ENV || 'development';

if (environment === 'eu') {
  module.exports = {
    baseUrl: 'https://api.hub88.io',
    operatorID: 220,
    currencyCode: 'EUR, USD',
    gameCode: 'pgp_sweetbonanza1000, pgp_gatesofolympus1000, pgp_gatesofolympus, pgp_jokersjewels, pgp_sugarrush1000, pgp_sweetbonanza, pgp_savannahlegend, pgp_starlightprincess1000',
    countryCode: 'FI',
    langCode: 'en'
  };
} else if (environment === 'staging') {
  module.exports = {
    baseUrl: 'https://api.server1.ih.testenv.io',
    operatorID: 10,
    currencyCode: 'EUR, USD',
    gameCode: 'pgp_sweetbonanza1000',
    countryCode: 'FI',
    langCode: 'en'
  };
} else if (environment === 'asia') {
  module.exports = {
    baseUrl: 'https://api.as1.hub88.io',
    operatorID: 221,
    currencyCode: 'VND, JPY',
    gameCode: 'pgp_starlightprincess1000',
    countryCode: 'JP',
    langCode: 'jp'
  };
} else if (environment === 'generic') {
  module.exports = {
    baseUrl: 'https://api.hub88.io',
    operatorID: 220,
    currencyCode: 'EUR, USD',
    gameCode: 'psn_diamondspowerholdandwin, psn_4potsrichesholdandwin, psn_coinstrikeholdandwin, psn_legendofcleopatramegaways, psn_superchargedcloversholdandwin',
    countryCode: 'FI',
    langCode: 'en'
  };
} else {
  throw new Error(`Unknown environment: ${environment}`);
}

// npm run test-eu
// npm run test-staging
// npm run test-asia
// npm run test-generic
