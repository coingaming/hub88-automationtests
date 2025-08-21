# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Repository Overview

This is Hub88's QA Automation Suite - a multi-framework testing environment that handles API and UI testing for Hub88's gaming platform. The repository uses a distributed testing architecture with four main testing frameworks, each serving specific testing needs.

## Key Testing Frameworks & Commands

### 1. Cypress API Tests (`apiAutomation/`)
**Purpose**: API integration testing with RSA signature authentication

```bash
# Setup and run
cd apiAutomation
npm install
npx cypress run                    # Run all tests headless
npx cypress open                   # Open Cypress GUI
npx cypress run --spec "cypress/e2e/operator/operatorGameLauncherTest.cy.js"  # Run specific test
```

**Key Features**:
- RSA signature generation for API authentication
- Supports multiple environments (production/staging keys)
- Custom Cypress tasks for private key loading
- Project ID: `hgdyuk` for Cypress Dashboard

### 2. Playwright API Tests (`apiAutomationPw/`)
**Purpose**: API testing with Playwright, focusing on freebets and game launcher APIs

```bash
# Setup and run
cd apiAutomationPw
npm install
npm run test                       # Run all tests
npm run fbtest                     # Run freebets API regression tests
npm run glttest                    # Run game launcher tests
npx playwright test operatorGameLauncher.spec.js --headed  # Run specific test with UI
```

**Key Architecture**:
- External signature service at `server1.ih.testenv.io:3003`
- Crypto utilities for RSA signature generation
- Parameterized testing across multiple currencies, games, platforms

### 3. Back Office UI Tests (`boAutomationPw/`)
**Purpose**: UI automation for Hub88's back-office transactions interface

```bash
# Setup and run
cd boAutomationPw
npm install
npm run test                       # Run headless
npm run testh                      # Run with browser UI
npm run testd                      # Run with debug mode
npm run login                      # Generate auth storage state
```

**Key Features**:
- Page Object Model architecture (`pageObjects/transactions.js`)
- Persistent authentication via `storageState.json`
- Large viewport configuration (1920x1080)
- Back-office URL: `https://bo-v3.hub88.io/transactions`

### 4. AI Manual Testing (`ai-manual-testing/`)
**Purpose**: AI-assisted manual test case generation from UI analysis

```bash
# Setup and run
cd ai-manual-testing
npm install
npm run test                       # Run page analysis
npm run login                      # Generate auth session
npx playwright test analyzePage.spec.ts --headed  # Run with browser
```

**Key Architecture**:
- Generates `rich-analysis.json` from live webpage analysis
- Uses AI prompts defined in `copilotPrompt.md` for test case generation
- Creates markdown test cases for manual execution

### 5. Postman Server (`postmanServer/`)
**Purpose**: Local signature generation server for Postman API collections

```bash
# Setup and run
cd postmanServer
npm install
npm start                          # Starts server on port 3001
```

**Architecture**:
- Express.js server with RSA signature generation
- Uses `node-forge` for cryptographic operations
- Requires `private_key.pem` file for signature generation
- Endpoint: `POST http://localhost:3001/` with JSON payload `{data: "string_to_sign"}`

## Authentication Architecture

### RSA Signature System
All API tests use RSA-based request signing:

1. **Private Keys**: Located in framework-specific `secure/` directories
2. **Signature Generation**: SHA-256 hash of request body, signed with RSA private key
3. **Header**: `X-Hub88-Signature: <base64_signature>`

### Multi-Environment Support
- **Production Keys**: `private-key.pem`
- **Staging Keys**: `private-key-stage.pem` (Cypress), external service (Playwright)

## Configuration System

### API Configuration (`config/operatorConfig.js`)
```javascript
{
  baseUrl: 'https://api.hub88.io',
  operatorID: 220,
  currencyCode: 'EUR, USD',
  gameCode: 'pgp_sweetbonanza1000, pgp_gatesofolympus1000, ...',
  countryCode: 'FI',
  langCode: 'en'
}
```

### Test Data Generation
- **Dynamic Users**: `user_${Math.floor(Math.random() * 1000000)}`
- **Tokens**: UUID-like format with random numbers
- **Parameterized Testing**: Automated test generation across all currency/game/platform combinations

## Test Execution Patterns

### Parallel Execution
All Playwright frameworks use:
- `fullyParallel: true` for maximum speed
- CI optimizations (single worker, 2 retries)
- HTML reporting with trace capture on failures

### Test Isolation
- Each framework maintains separate `node_modules`
- Independent configuration files
- Isolated test data and credentials

## Key Testing Scenarios

### API Tests Cover:
- **Game Launch URLs**: Multi-platform game URL generation
- **Free Bets**: Bonus system API validation  
- **Operator Integration**: Partner API authentication flows
- **Provider Integration**: Game supplier API validation

### UI Tests Cover:
- **Transaction Processing**: Back-office transaction management
- **Round Details**: Game session detail validation
- **Filter Operations**: Search and filtering functionality

## Development Workflow

### Adding New Tests
1. Choose appropriate framework based on test type (API vs UI)
2. Follow existing patterns for configuration and authentication
3. Use parameterized testing for multi-variant scenarios
4. Ensure proper error handling and signature generation

### Authentication Setup
1. Place RSA private keys in framework's `secure/` directory
2. For Playwright API tests, ensure signature service is accessible
3. For UI tests, generate `storageState.json` using login commands

### Running Test Suites
```bash
# Run all API tests (choose framework)
cd apiAutomation && npx cypress run
cd apiAutomationPw && npm test

# Run UI tests
cd boAutomationPw && npm test

# Generate manual test cases
cd ai-manual-testing && npm test
```

## Environment Dependencies

### External Services
- **Signature Service**: `server1.ih.testenv.io:3003` (Playwright API tests)
- **API Endpoint**: `https://api.hub88.io` (all API tests)
- **Back Office**: `https://bo-v3.hub88.io` (UI tests)

### Required Files
- RSA private keys in PEM format
- `storageState.json` for UI test authentication
- Framework-specific configuration files

## Troubleshooting

### Signature Issues
- Verify private key file paths and permissions
- Check signature service availability (Playwright)
- Validate request payload format matches expected structure

### Authentication Failures
- Regenerate `storageState.json` using login commands
- Verify back-office credentials and permissions
- Check session timeout and renewal requirements
