import http from 'k6/http';
import { check, sleep } from 'k6';
import { Counter } from 'k6/metrics';
import { getLastMonthRange } from '../utils/timeRangeGenerator.js';

// Import environment configuration
import environment from '../config/environment.js';

// Custom metrics
const successfulQueries = new Counter('successful_queries');
const failedQueries = new Counter('failed_queries');

// Default options for the test
export const options = {
  // Define test stages - how many virtual users and for how long
  stages: [
    { duration: '5s', target: environment.vusers || 5 },  // Ramp up
    { duration: '10s', target: environment.vusers || 5 }, // Stay at target
    { duration: '5s', target: 0 },                        // Ramp down
  ],
  // Define performance thresholds
  thresholds: {
    // 95% of requests should complete within specified time
    http_req_duration: [`p(95)<${environment.responseTimeThreshold || 1000}`], 
    // Expect at least this many successful queries
    'successful_queries': [`count>${environment.minSuccessfulQueries || 10}`],
  },
  // Add tags for better reporting
  tags: {
    name: 'Last Month with Round Query',
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

// Function to generate a payload with last month time range and round
function generatePayload() {
  // Get dynamic time range for last month
  const timeRange = getLastMonthRange();
  
  // Build filter object
  const filter = {
    startTime: timeRange.startTime,
    endTime: timeRange.endTime,
    round: environment.round
  };

  // Add default statuses if not specified
  if (environment.statuses && environment.statuses.length > 0) {
    filter.statuses = environment.statuses;
  } else {
    filter.statuses = ['TS_SUCCESS']; // Default value
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

  // Use the environment URL
  const url = `${environment.baseUrl}${environment.apiPath}`;
  
  // Generate the payload with last month time range and round
  const payload = generatePayload();
  
  // Log request details for debugging
  console.log(`Making request to: ${url}`);
  console.log(`Time range: ${payload.variables.filter.startTime} to ${payload.variables.filter.endTime}`);
  console.log(`Round: ${payload.variables.filter.round}`);
  console.log(`Payload: ${JSON.stringify(payload)}`);
  
  // Make the request
  const response = http.post(url, JSON.stringify(payload), { headers });
  
  // Log response details
  console.log(`Response status: ${response.status}`);
  
  // Check if the response was successful
  const success = check(response, {
    'status is 200': (r) => r.status === 200,
    'has data': (r) => r.json('data') !== null,
    'has transactions': (r) => r.json('data.transactions.connection') !== null,
  });
  
  // Increment our custom metrics
  if (success) {
    successfulQueries.add(1);
    console.log(`Success! Total count: ${response.json('data.transactions.connection.totalCount')}`);
  } else {
    failedQueries.add(1);
    console.log(`Failed request: ${response.status} - ${response.body}`);
  }
  
  // Sleep between requests to simulate real user behavior
  sleep(1);
}
