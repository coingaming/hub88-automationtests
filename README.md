# Hub88 API Automated Testing Suite

Welcome to the **Operator API Testing Suite**! This project is designed to test and validate the functionality of various API endpoints provided by a gaming operator platform. Using Cypress as the testing framework, this suite ensures that critical API responses meet expected standards for game lists, freebets, and game URLs.

The project leverages configuration files to define test parameters and modular test scripts to execute API tests efficiently. Whether you're a developer, QA engineer, or stakeholder, this README will guide you through the project's structure, setup, and usage.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Project Structure](#project-structure)
- [Configuration Files](#configuration-files)
- [Test Suites](#test-suites)
- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
- [Running the Tests](#running-the-tests)
- [Test Details](#test-details)
- [Contributing](#contributing)
- [License](#license)

---

## Project Overview

This project automates the testing of a gaming operator's API endpoints, ensuring reliability and correctness of responses. It uses configuration-driven testing, where test data (e.g., base URLs, operator IDs, game codes) is defined in separate configuration files. These configurations are then consumed by Cypress test scripts to validate API behavior.

The suite currently supports testing for:
- **Game List API**: Retrieves and validates a list of available games.
- **Freebets API**: Fetches and verifies freebet details for specific games and currencies.
- **Game URL API**: Generates and validates game URLs for various platforms, currencies, and regions.

---

## Features

- **Modular Configuration**: Test parameters are centralized in config files for easy updates.
- **Dynamic Testing**: Supports multiple games, currencies, platforms, and languages via comma-separated values.
- **Signature Generation**: Integrates cryptographic signing (RSA-SHA256) for secure API requests.
- **Detailed Validation**: Ensures response structures, data types, and formats meet expectations.
- **Logging**: Provides detailed logs for debugging and traceability.

---

## Project Structure
operator-api-tests/
- ├── config/
- │   ├── operatorConfig.js       # Main config for game list and freebets tests
- │   └── providerConfig.js       # Config for provider-specific settings
- ├── e2e/
- │   ├── operator/
- │   │   ├── gameList.cy.js    # Tests for Game List API
- │   │   ├── freebets.cy.js    # Tests for Freebets API
- │   │   └── gameUrl.cy.js     # Tests for Game URL API
- │   └── provider/
- │       └── supplierTest.cy.js         # Custom Cypress commands (if any)
- ├── README.md                   # Project documentation (this file)
- └── package.json                # Project dependencies and scripts


---

## Configuration Files

The project uses configuration files to define test parameters, making it easy to adapt tests to different environments or requirements without modifying the test logic.

### `operatorConfig.js`
- **Purpose**: Defines settings for game list and freebets API tests.
- **Key Exports**:
  - `baseUrl`: API base URL (e.g., `https://api.server1.ih.testenv.io`).
  - `operatorID`: Unique operator identifier (e.g., `1205`).
  - `currencyCode`: Supported currencies (e.g., `EUR, USD`).
  - `gameCode`: Game codes to test (e.g., `clt_astrowild, clt_basketballpro`).
  - `loadPrivateKey`: Loads the private key for signing requests.
  - `generateSignature`: Generates RSA-SHA256 signatures for API authentication.

### `providerConfig.js`
- **Purpose**: Defines provider-specific settings (currently unused in active tests but available for extension).
- **Key Exports**:
  - `baseUrl`: Provider API URL (e.g., `https://staging.the-rgs.com/api`).
  - `providerID`: Provider identifier (e.g., `hub88-caleta`).

These files allow you to update test data in one place, and the test suites automatically adapt to the changes.

---

## Test Suites

The test suites are written in Cypress and located in the `cypress/integration/` directory. Each suite targets a specific API endpoint.

### 1. `gameList.spec.js`
- **Endpoint**: `/operator/generic/v2/game/list`
- **Purpose**: Validates the game list response.
- **Validations**:
  - Response status is 200.
  - Response body is a non-empty array.
  - Game properties (e.g., `url_thumb`, `game_code`, `freebet_support`) match expected types and formats.

### 2. `freebets.spec.js`
- **Endpoint**: `/operator/generic/v2/freebet/prepaids/list`
- **Purpose**: Tests freebet retrieval for multiple games and currencies.
- **Validations**:
  - Response status is 200.
  - Response body is an array.
  - Freebet properties (e.g., `prepaid_uuid`, `bet_value`, `bonus_buy`) are correctly formatted.

### 3. `gameUrl.spec.js`
- **Endpoint**: `/operator/generic/v2/game/url`
- **Purpose**: Generates and validates game URLs across platforms, currencies, and regions.
- **Validations**:
  - Response status is 200.
  - Response contains a valid `url` property in proper URL format.

---

## Prerequisites

- **Node.js**: Version 14.x or higher.
- **Cypress**: Installed as a project dependency.
- **Private Key**: A valid RSA private key file for signing requests (managed via `cy.task`).

---

## Setup Instructions

1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd operator-api-tests

## Install Dependencies:
npm install

## Configure the Private Key:
Place your RSA private key file in a secure location.
Update the cy.task('readPrivateKey') implementation in cypress/plugins/index.js to read the key file:

const fs = require('fs');
module.exports = (on) => {
  on('task', {
    readPrivateKey() {
      return fs.readFileSync('/path/to/private-key.pem', 'utf8');
    }
  });
};

## Update Configuration:
Modify config/operatorConfig.js and config/providerConfig.js with your API details (e.g., baseUrl, operatorID).

## Running the Tests

1. **Open Cypress Test Runner**:
npx cypress open

Select a test file (e.g., gameList.spec.js) to run interactively.

### Run Tests in Headless Mode:
npx cypress run

Executes all tests and outputs results to the terminal.

### Run Specific Test Suite:
npx cypress run --spec "cypress/integration/freebets.spec.js"

## Test Details

- **Dynamic Test Generation**: Tests iterate over comma-separated values (e.g., `gameCode`, `currencyCode`) to cover all combinations.
- **Error Handling**: The `failOnStatusCode: false` option allows debugging of non-200 responses.
- **Logging**: Cypress logs (`cy.log`) provide visibility into requests and signatures.
- **Steps**: `cy.step` commands organize validation blocks for better reporting.

---

## Contributing

We welcome contributions! To contribute:
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -m "Add your feature"`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request.

Please ensure your code follows the existing style and includes appropriate tests.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
