// @ts-check
import { test, expect } from '@playwright/test';
const { baseUrl } = require('../config/environment.js');

// GraphQL query for transactions
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

// Authorization token - in a real scenario, you might want to get this from a secure source
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

// Helper function to measure response time
async function measureResponseTime(request, payload) {
  const startTime = Date.now();
  const response = await request.post(`${baseUrl}/api_v3`, {
    data: payload,
    headers: {
      'accept': 'application/graphql+json, application/json',
      'authorization': `Bearer ${authToken}`,
      'content-type': 'application/json',
    }
  });
  const endTime = Date.now();
  const responseTime = endTime - startTime;
  
  return { response, responseTime };
}

// Helper function to log performance metrics
function logPerformanceMetrics(testName, responseTime, statusCode, dataSize) {
  console.log(`\n--- Performance Test: ${testName} ---`);
  console.log(`Response time: ${responseTime}ms`);
  console.log(`Status code: ${statusCode}`);
  console.log(`Response data size: ${dataSize} bytes`);
  console.log('-----------------------------------');
}

test.describe('Hub88 BO Transactions API Performance Tests', () => {
  // Test with default parameters
  test('Default query performance test', async ({ request }) => {
    const payload = generatePayload();
    const { response, responseTime } = await measureResponseTime(request, payload);
    
    // Verify response is valid
    expect(response.ok()).toBeTruthy();
    const responseBody = await response.json();
    expect(responseBody.data).toBeDefined();
    expect(responseBody.data.transactions).toBeDefined();
    
    // Log performance metrics
    logPerformanceMetrics(
      'Default Query', 
      responseTime, 
      response.status(), 
      JSON.stringify(responseBody).length
    );
    
    // Performance assertions
    expect(responseTime).toBeLessThan(2000); // Response should be under 2 seconds
  });
  
  // Test with different product code
  test('Different product code performance test', async ({ request }) => {
    const payload = generatePayload('pgp'); // Using Pragmatic Play instead of Booming Games
    const { response, responseTime } = await measureResponseTime(request, payload);
    
    expect(response.ok()).toBeTruthy();
    const responseBody = await response.json();
    
    logPerformanceMetrics(
      'Different Product Code (pgp)', 
      responseTime, 
      response.status(), 
      JSON.stringify(responseBody).length
    );
    
    expect(responseTime).toBeLessThan(2000);
  });
  
  // Test with larger time range
  test('Larger time range performance test', async ({ request }) => {
    // Using a 7-day range instead of 1 day
    const startTime = '2025-09-05T00:00:00Z';
    const endTime = '2025-09-11T23:59:59Z';
    const payload = generatePayload('bmg', startTime, endTime);
    
    const { response, responseTime } = await measureResponseTime(request, payload);
    
    expect(response.ok()).toBeTruthy();
    const responseBody = await response.json();
    
    logPerformanceMetrics(
      'Larger Time Range (7 days)', 
      responseTime, 
      response.status(), 
      JSON.stringify(responseBody).length
    );
    
    // Larger time ranges might take longer to process
    expect(responseTime).toBeLessThan(3000);
  });
  
  // Test with multiple product codes
  test('Multiple product codes performance test', async ({ request }) => {
    // Custom payload with multiple product codes
    const customPayload = {
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
          startTime: '2025-09-11T00:00:00Z',
          endTime: '2025-09-11T23:59:59Z',
          statuses: ['TS_SUCCESS'],
          productCodes: ['bmg', 'pgp', 'evo'] // Multiple product codes
        }
      }
    };
    
    const { response, responseTime } = await measureResponseTime(request, customPayload);
    
    expect(response.ok()).toBeTruthy();
    const responseBody = await response.json();
    
    logPerformanceMetrics(
      'Multiple Product Codes', 
      responseTime, 
      response.status(), 
      JSON.stringify(responseBody).length
    );
    
    // Queries with multiple product codes might take longer
    expect(responseTime).toBeLessThan(3000);
  });
});
