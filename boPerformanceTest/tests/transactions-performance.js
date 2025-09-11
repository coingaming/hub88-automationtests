import http from 'k6/http';
import { check, sleep } from 'k6';
import { Counter } from 'k6/metrics';

// Import environment configuration
// K6 handles imports differently than Node.js
import environment from '../config/environment.js';

// Custom metrics
const successfulQueries = new Counter('successful_queries');
const failedQueries = new Counter('failed_queries');

// Default options for the test - can be overridden by environment-specific settings
export const options = {
  // Define test stages - how many virtual users and for how long
  stages: [
    { duration: '5s', target: environment.vusers || 5 },  // Ramp up to specified users over 30 seconds
    { duration: '10s', target: environment.vusers || 5 },    // Stay at specified users for 1 minute
    { duration: '5s', target: 0 },                        // Ramp down to 0 users over 30 seconds
  ],
  // Define performance thresholds
  thresholds: {
    // 95% of requests should complete within specified time (default 1000ms)
    http_req_duration: [`p(95)<${environment.responseTimeThreshold || 1000}`], 
    // Expect at least this many successful queries
    'successful_queries': [`count>${environment.minSuccessfulQueries || 100}`],
  },
  // Add tags for better reporting
  tags: {
    environment: environment.description || 'Default',
  },
};

// The GraphQL query
const query = `
query transactions($first: Int, $last: Int, $after: String, $before: String, $orderBy: TransactionOrder, $filter: TransactionFilter) {
  transactions(orderBy: $orderBy, filter: $filter) {
    connection(first: $first, last: $last, before: $before, after: $after) {
      totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        cursor
        node {
          id
          insertedAt
          status
          amount
          amountEur
          transactionUuid
          kind
          user
          currencyCode
          round
          game {
            code
            name
            product {
              code
              name
            }
          }
          operator {
            code
            name
            brand {
              code
              name
            }
          }
          retryable
          supplierUser
          supplierCode
          providesRoundDetails
        }
      }
    }
  }
}`;

// Function to generate a payload using environment variables
function generatePayload() {
  // Build filter object based on available environment variables
  const filter = {
    startTime: environment.startTime,
    endTime: environment.endTime
  };

  // Add optional filters only if they have values
  if (environment.statuses && environment.statuses.length > 0) {
    filter.statuses = environment.statuses;
  } else {
    filter.statuses = ['TS_SUCCESS']; // Default value if not specified
  }

  if (environment.productCodes && environment.productCodes.length > 0) {
    filter.productCodes = environment.productCodes;
  }

  if (environment.transactionUuid) {
    filter.transactionUuid = environment.transactionUuid;
  }

  if (environment.user) {
    filter.user = environment.user;
  }

  if (environment.round) {
    filter.round = environment.round;
  }

  if (environment.operatorCodes && environment.operatorCodes.length > 0) {
    filter.operatorCodes = environment.operatorCodes;
  }

  if (environment.currencyCodes && environment.currencyCodes.length > 0) {
    filter.currencyCodes = environment.currencyCodes;
  }

  return {
    query: query,
    variables: {
      first: 50,
      limit: 50,
      orderBy: {
        order: 'ASC',
        field: 'INSERTED_AT'
      },
      filter: filter
    }
  };
}

// Main function that is executed for each virtual user
export default function() {
  // Set up the headers using environment configuration
  const headers = {
    'Accept': 'application/graphql+json, application/json',
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${environment.authToken}`,
    'sec-ch-ua': '"Not;A=Brand";v="99", "Google Chrome";v="139", "Chromium";v="139"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"macOS"',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'
  };

  // Use the environment URL or fallback to a default
  const url = `${environment.baseUrl}${environment.apiPath}`;
  
  // Generate the payload with default parameters
  const payload = generatePayload();
  
  // Log request details for debugging
  console.log(`Making request to: ${url}`);
  console.log(`Headers: ${JSON.stringify(headers)}`);
  console.log(`Payload: ${JSON.stringify(payload)}`);
  
  // Make the request
  const response = http.post(url, JSON.stringify(payload), { headers });
  
  // Log response details
  console.log(`Response status: ${response.status}`);
  console.log(`Response body: ${response.body}`);
  
  // Check if the response was successful
  const success = check(response, {
    'status is 200': (r) => r.status === 200,
    'has data': (r) => r.json('data') !== null,
    'has transactions': (r) => r.json('data.transactions.connection') !== null,
  });
  
  // Increment our custom metrics
  if (success) {
    successfulQueries.add(1);
  } else {
    failedQueries.add(1);
    console.log(`Failed request: ${response.status} - ${response.body}`);
  }
  
  // Sleep between requests to simulate real user behavior
  sleep(1);
}
