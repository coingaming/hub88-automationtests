// Check for K6_ENV or PLAYWRIGHT_ENV first, then NODE_ENV, default to 'bo-eu' if neither is set
const environment = process.env.K6_ENV || process.env.PLAYWRIGHT_ENV || process.env.NODE_ENV || 'bo-eu';

switch (environment) {
  case 'bo-as':
    module.exports = {
      baseUrl: 'https://bo-v3.as1.hub88.io',
      apiPath: '/api_v3',
      description: 'Hub88 BO Asia Environment'
    };
    break;
  case 'bo-eu':
    module.exports = {
      baseUrl: 'https://bo-v3.hub88.io',
      apiPath: '/api_v3',
      description: 'Hub88 BO Europe Environment'
    };
    break;
  default:
    module.exports = {
      baseUrl: 'https://bo-v3.hub88.io',
      apiPath: '/api_v3',
      description: 'Hub88 BO Default Environment'
    };
}

// npm run test:perf:bo-as
// npm run test:perf:bo-eu
