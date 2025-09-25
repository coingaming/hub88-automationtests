// Check for PLAYWRIGHT_ENV first, then NODE_ENV, default to 'staging' if neither is set
const environment = process.env.PLAYWRIGHT_ENV || process.env.NODE_ENV || 'staging';

switch (environment) {
  case 'staging':
    module.exports = {
      baseUrl: 'https://api.server1.ih.testenv.io/operator/generic/v2',
      operatorID: 10,
      campaign_uuid: '6f505b97-b208-4fa0-be59-fa98656898fd'
    };
    break;
  case 'eu':
    module.exports = {
      baseUrl: 'https://api.hub88.io/operator/generic/v2',
      operatorID: 220,
      campaign_uuid: '7e605b97-c308-5fb0-ce59-fa98656898fe'
    };
    break;
  case 'asia':
    module.exports = {
      baseUrl: 'https://api.as1.hub88.io/operator/generic/v2',
      operatorID: 221,
      campaign_uuid: '8d705b97-d408-6fc0-df59-fa98656898ff'
    };
    break;
  default:
    throw new Error(`Unknown environment: ${environment}`);
}

// npm run test-staging
// npm run test-eu
// npm run test-asia
