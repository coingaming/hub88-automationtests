// Check for PLAYWRIGHT_ENV first, then NODE_ENV, default to 'eu' if neither is set
const environment = process.env.PLAYWRIGHT_ENV || process.env.NODE_ENV || 'eu';

switch (environment) {
  case 'eu':
    module.exports = {
      baseUrl: 'https://api.hub88.io',
      operatorID: 220,
      currencyCode: 'USD',
      gameCode: 'pgp_sweetbonanza1000, pgp_gatesofolympus1000, pgp_gatesofolympussuperscatter, pgp_gatesofolympus, pgp_jokersjewels, pgp_sweetbonanza, pgp_sugarrush1000, pgp_firestampede, pgp_bigbasssplash, pgp_starlightprincess1000, pgp_thedoghouse, pgp_firestampede2, pgp_fruitparty, pgp_goldparty, pgp_sweetbonanzaxmas, pgp_sugar_rush, pgp_jokersjewelsdice, pgp_thedoghousemegaways, pgp_sweetbonanzasuperscatter, pgp_biggerbassbonanza, pgp_bigbassbonanzatm, pgp_bigbassvegasdoubledowndeluxe, pgp_bigbassreelrepeat, pgp_dede, pgp_gatesofolympusxmas1000, pgp_jokersjewelscash, pgp_buffalokingmegaways, pgp_savannahlegend, pgp_sugarsupremepowernudge, pgp_jokersjewelswild, pgp_bigbassbonanza1000, pgp_banditmegaways, pgp_wisdomofathena, pgp_wisdomofathena1000, pgp_clovergold, pgp_sweetbonanzadice, pgp_thedoghousediceshow, pgp_bigbassboxingbonusround, pgp_beekeeper, pgp_5lionsmegaways, pgp_cleocatra, pgp_bigbassholdandspinnermegaways, pgp_lobsterhouse, pgp_5lionsmegaways2, pgp_greatrhinomegaways, pgp_bigbassfloatsmyboat, pgp_starlightprincess',
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
