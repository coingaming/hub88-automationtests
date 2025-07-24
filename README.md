# Hub88 QA Automation Suite

This repository contains the automated testing infrastructure for Hub88's API and UI testing efforts using multiple testing frameworks.

## Overview

The repository is organized into three main testing approaches:

- **API Automation** (Cypress)
- **Manual Testing Scripts** (Playwright) 
- **API Collections** (Postman)

## Project Structure

```
hub88-automationtests/
├── ai-manual-testing/         # Playwright test scenarios
├── apiAutomation/            # Cypress API tests
├── postmanAutomatedTests/    # Postman collections & scripts
└── postmanServer/           # Local server for signature generation
```

## Testing Frameworks

### 1. API Automation (Cypress)
- Located in `apiAutomation/`
- Focuses on API integration testing
- Includes configuration for different environments
- Uses custom signature generation for authentication
- Supports parallel test execution

### 2. Manual Testing Scripts (Playwright)
- Located in `ai-manual-testing/`
- UI automation test cases
- Test case generation and execution
- Detailed reporting capabilities

### 3. Postman Collections
- Located in `postmanAutomatedTests/`
- API request collections for:
  - Campaign info tests
  - Game launcher tests
  - Recommendations lobby tests
  - Thrilltech integration tests
  - Wallet API transactions

### 4. Signature Server
- Located in `postmanServer/`
- Local Express.js server for signature generation
- Supports RSA key-based signing
- Used by Postman tests for authentication

## Getting Started

1. Install dependencies:
```bash
# For Cypress tests
cd apiAutomation
npm install

# For Playwright tests
cd ai-manual-testing
npm install

# For signature server
cd postmanServer
npm install
```

2. Configure environment variables and private keys

3. Run tests:
```bash
# Cypress tests
cd apiAutomation
npx cypress run

# Playwright tests
cd ai-manual-testing
npx playwright test

# Start signature server
cd postmanServer
npm start
```

## Key Features

- **Multi-framework Support**: Allows choosing the best tool for each testing need
- **Environment Configuration**: Supports multiple environments (staging, production)
- **Authentication**: RSA signature generation for secure API testing
- **Reporting**: Detailed test reports and failure analysis
- **Modular Structure**: Easy to maintain and extend test suites

## Test Categories

- API Integration Tests
- Game Launch Flows
- Payment Transactions
- Campaign Management
- User Authentication
- Game List Management
- Recommendations System

## Contributing

1. Create a feature branch
2. Add/update tests
3. Ensure all tests pass
4. Submit a pull request

## Test Execution

Each framework has its own execution commands and reporting mechanisms. Refer to individual framework directories for specific instructions.

## Maintenance

- Keep dependencies updated
- Review and update test cases regularly
- Maintain documentation for new features
- Monitor test stability and performance

## Support

For questions or issues:
1. Check existing documentation
2. Review test logs
3. Contact the QA team

## License

Internal use only - Hub88 proprietary software