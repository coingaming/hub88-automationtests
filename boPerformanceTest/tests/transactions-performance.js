import http from 'k6/http';
import { check, sleep } from 'k6';
import { Counter } from 'k6/metrics';
import { baseUrl } from '../config/environment.js';

// Custom metrics
const successfulQueries = new Counter('successful_queries');
const failedQueries = new Counter('failed_queries');

// Default options for the test
export const options = {
  stages: [
    { duration: '30s', target: 5 },  // Ramp up to 5 users over 30 seconds
    { duration: '1m', target: 5 },   // Stay at 5 users for 1 minute
    { duration: '30s', target: 0 },  // Ramp down to 0 users over 30 seconds
  ],
  thresholds: {
    http_req_duration: ['p(95)<1000'], // 95% of requests should complete within 1s
    'successful_queries': ['count>100'],
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

// The authorization token - in a real scenario, you might want to get this dynamically
// or store it more securely
const authToken = 'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJ1a3Z6ZmFPamp4ZjVVVkxhakdXUDM5NTI1UklsbXA1OGlxbTVOY0N3UFJBIn0.eyJleHAiOjE3NTc1Nzg5MTgsImlhdCI6MTc1NzU3ODYxOCwiYXV0aF90aW1lIjoxNzU3NTc4NjA0LCJqdGkiOiI4YTM5YWNjMi1mNDEyLTRjYTQtYTkzZC01MjVmMDQ2NGE2NTEiLCJpc3MiOiJodHRwczovL2F1dGgtYm8uaHViODguaW8vYXV0aC9yZWFsbXMvaHViODhfYm8iLCJhdWQiOlsiaHViLXdhbGxldCIsImh1Yjg4X2NsaWVudF9hcmVhIiwiaHViODhfYm9fYmFja2VuZCIsImFjY291bnQiXSwic3ViIjoiN2YyYmEyYWItMTg1OC00MWMzLWJhMmEtZDZlNDgxOGUzYzc2IiwidHlwIjoiQmVhcmVyIiwiYXpwIjoiaHViODhfYm9fd2ViIiwibm9uY2UiOiJhODQ0NmI4MC1hZTU1LTRkNWEtOGY2YS1mMjE2ZTA0Nzc1MmYiLCJzZXNzaW9uX3N0YXRlIjoiZjNlZTJiNTYtYWExYi00ZGQzLTk4MTktYjM0NzA5ZmRlYWI4IiwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbImRlZmF1bHQtcm9sZXMtaHViODhfYm8iLCJvZmZsaW5lX2FjY2VzcyIsInVtYV9hdXRob3JpemF0aW9uIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiaHViLXdhbGxldCI6eyJyb2xlcyI6WyJhcjpnZXRNeVBlbmRpbmdBcHByb3ZhbCIsImFyOmNyZWF0ZVJlbGF0ZWRBY2NvdW50VXNlciIsImFyOnVwZGF0ZU15QWNjb3VudFJlY2lwaWVudCIsImFyOmxpc3RNeVN0YXRlbWVudHMiLCJhcjpnZXRNeVBheW1lbnQiLCJhcjpyZWplY3RNeVBheW1lbnQiLCJhcjpyZWplY3RNeVdpdGhkcmF3YWwiLCJhcjphcHByb3ZlTXlXaXRoZHJhd2FsIiwiYXI6Z2V0TXlTdGF0ZW1lbnQiLCJhcjpsaXN0TXlXYWxsZXRzIiwiYXI6bGlzdE15V2l0aGRyYXdhbHMiLCJhcjpkZWxldGVNeUFjY291bnRSZWNpcGllbnQiLCJhcjpjcmVhdGVNeVdpdGhkcmF3YWwiLCJhcjpsaXN0TXlBY2NvdW50c1VzZXJzIiwiYXI6Z2V0TXlFeGNoYW5nZSIsImFyOm15U3VwcG9ydGVkQ3VycmVuY2llcyIsImFyOnJlamVjdE15RXhjaGFuZ2UiLCJhcjpsaXN0TXlQZW5kaW5nQXBwcm92YWxzIiwiYXI6Z2V0TXlBY2NvdW50VXNlciIsImFyOmNyZWF0ZU15RXhjaGFuZ2UiLCJhcjpsaXN0TXlQYXltZW50cyIsImFyOnVwZGF0ZVJlbGF0ZWRBY2NvdW50VXNlciIsImFyOmNyZWF0ZU15UGF5bWVudCIsImFyOmdldE15RGVwb3NpdEluZm8iLCJhcjpnZXRNeVdhbGxldCIsImFyOmxpc3RNeUFjY291bnRzUmVjaXBpZW50cyIsImFyOmNyZWF0ZU15QWNjb3VudFJlY2lwaWVudCIsImFyOnVwZGF0ZU15QWNjb3VudFVzZXIiLCJhcjpzdXBwb3J0ZWRDdXJyZW5jaWVzIiwiYXI6YXBwcm92ZU15RXhjaGFuZ2UiLCJhcjpsaXN0UmVsYXRlZEFjY291bnRzVXNlcnMiLCJhcjpsaXN0TXlBY2NvdW50cyIsImFyOmdldE15U3RhdGVtZW50UmVjZWlwdCIsImFyOmdldE15QWNjb3VudCIsImFyOmNhbGN1bGF0ZU15VHJhbnNhY3Rpb25GZWUiLCJhcjpsaXN0TXlFeGNoYW5nZXMiLCJhcjpnZXRNeVdpdGhkcmF3YWwiLCJhcjpwYWlyQ3VycmVuY3lJbmZvIiwidXNlciIsImFyOmFwcHJvdmVNeVBheW1lbnQiLCJhcjp1cGRhdGVNeUFjY291bnQiXX0sImh1Yjg4X2NsaWVudF9hcmVhIjp7InJvbGVzIjpbImFyOnBpbmciLCJjeHBvcnRhbCIsImFyOmdldEF0dGFjaG1lbnQiLCJhcjpnZXRFbnZpcm9ubWVudHMiLCJhcjpnZXRDYXNlIiwiYXI6Y3JlYXRlQ2FzZSIsImFyOnVwZGF0ZUNhc2UiLCJwcjpwb3J0YWwiLCJhcjpsaXN0Q2FzZXMiLCJhcjpjcmVhdGVDYXNlQ29tbWVudCJdfSwiaHViODhfYm9fYmFja2VuZCI6eyJyb2xlcyI6WyJyZXBvcnRzIiwiaW52b2ljZV9wYXltZW50IiwiaW52b2ljZXMiLCJjYV9jeHBvcnRhbCIsImxlZ2FsIiwiZ2FtZXMiLCJodWJfd2FsbGV0Iiwid2FsbGV0cyIsImZyZWViZXRzIiwidHJhbnNhY3Rpb25zIiwiZGFzaGJvYXJkIl19LCJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6Im9wZW5pZCBlbWFpbCBib19zY29wZSBwcm9maWxlIiwic2lkIjoiZjNlZTJiNTYtYWExYi00ZGQzLTk4MTktYjM0NzA5ZmRlYWI4IiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJyZWRpcmVjdF9lbnZfdXJscyI6eyJldTEiOiJodHRwczovL2JvLmh1Yjg4LmlvIiwiYXMxIjoiaHR0cHM6Ly9iby5hczEuaHViODguaW8vIiwiYW0iOiJodHRwczovL2JvLmFtLmh1Yjg4LmlvLyIsImV1MiI6Imh0dHBzOi8vYm8uZmx5YmlyZC5pby8ifSwibmFtZSI6IkJydW5vIFBlcmVzIiwicHJlZmVycmVkX3VzZXJuYW1lIjoiYnJ1bm8ucGVyZXNAeW9sby5jb20iLCJnaXZlbl9uYW1lIjoiQnJ1bm8iLCJibyI6eyJ1ZSI6WyJldTEiLCJldTIiLCJhczEiLCJhbSJdLCJhcGlfdmVyc2lvbnMiOlsidjNfYXMxIl0sImFwaV92ZXJzaW9uIjoidjMiLCJkYyI6IkVVUiJ9LCJmYW1pbHlfbmFtZSI6IlBlcmVzIiwiZW1haWwiOiJicnVuby5wZXJlc0B5b2xvLmNvbSJ9.I2KmnZEy38epw5RCW5xchhSj04GXM0GKZvxV-Ude1i18BykHKQFSav83MBEvcy9EPdy508Fzj24gu8yHo-hw-C6OhFtNUYhY3ee1MVlfKfh0TA89afUJT4DeaenUONPz6vDOscSnrYpZKouqW-bUYRjUmykzu4LycFWzITXlVx1sTUor9k7AXTh1AiJ9sGLn96nlNgMeMGhKqGw5IGnh3mJ4pBOQEkD7nLQZceOdZbJcmWZFU6_8NYoP979iIj5llekszme6iRUluHl383QHVp3csmQP4SuJQ1ftT40R2Z-IsyaWmRZ-K7oEXROiQZPgssMerDyHgUQE-xzqUpwgpg';

// Function to generate a payload with different parameters
function generatePayload(productCode = 'bmg', startTime = '2025-09-11T00:00:00Z', endTime = '2025-09-11T23:59:59Z') {
  return {
    query: query,
    operationName: 'transactions',
    variables: {
      first: 50,
      limit: 50,
      orderBy: {
        order: 'ASC',
        field: 'INSERTED_AT'
      },
      filter: {
        startTime: startTime,
        endTime: endTime,
        statuses: ['TS_SUCCESS'],
        productCodes: [productCode]
      }
    }
  };
}

// Main function that is executed for each virtual user
export default function() {
  // Set up the headers
  const headers = {
    'accept': 'application/graphql+json, application/json',
    'accept-language': 'en-US,en;q=0.9,pt;q=0.8',
    'authorization': `Bearer ${authToken}`,
    'content-type': 'application/json',
    'origin': 'https://bo-v3.hub88.io',
    'referer': 'https://bo-v3.hub88.io/transactions',
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'
  };

  // Use the environment URL or fallback to a default
  const url = `${baseUrl || 'https://bo-v3.hub88.io'}/api_v3`;
  
  // Generate the payload with default parameters
  const payload = generatePayload();
  
  // Make the request
  const response = http.post(url, JSON.stringify(payload), { headers });
  
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
