// K6 compatible environment configuration
let envName = 'default'; // Default environment

// Check if we're in K6 context
if (typeof __ENV !== 'undefined') {
  envName = __ENV.K6_ENV || 'default';
} 
// Check if we're in Node.js context
else if (typeof process !== 'undefined' && process.env) {
  envName = process.env.PLAYWRIGHT_ENV || process.env.NODE_ENV || 'default';
}

// Define all environments
const environments = {
  'bo-as': {
    baseUrl: 'https://bo-v3.as1.hub88.io',
    apiPath: '/api_v3',
    authToken: 'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJ1a3Z6ZmFPamp4ZjVVVkxhakdXUDM5NTI1UklsbXA1OGlxbTVOY0N3UFJBIn0',
    startTime: "2025-09-11T00:00:00Z",
    endTime: "2025-09-11T23:59:59Z",
    statuses: [],
    productCodes: [],
    transactionUuid: "fd710989-df65-5da4-bfb7-aa4fe01b224e",
    user: "",
    round: "",
    operatorCodes: [],
    currencyCodes: [],
    description: 'Hub88 BO Asia Environment',
    vusers: 3,
    responseTimeThreshold: 1500,
    minSuccessfulQueries: 50
  },
  'bo-eu': {
    baseUrl: 'https://bo-v3.hub88.io',
    apiPath: '/api_v3',
    authToken: 'fghdfghdfgh',
    startTime: "2025-09-11T00:00:00Z",
    endTime: "2025-09-11T23:59:59Z",
    statuses: [],
    productCodes: [],
    transactionUuid: "fd710989-df65-5da4-bfb7-aa4fe01b224e",
    user: "",
    round: "",
    operatorCodes: [],
    currencyCodes: [],
    description: 'Hub88 BO Europe Environment',
    vusers: 5,
    responseTimeThreshold: 1000,
    minSuccessfulQueries: 100
  },
  'default': {
    baseUrl: 'https://bo-v3.hub88.io',
    apiPath: '/api_v3',
    authToken: 'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJ1a3Z6ZmFPamp4ZjVVVkxhakdXUDM5NTI1UklsbXA1OGlxbTVOY0N3UFJBIn0.eyJleHAiOjE3NTc2NjkxMTEsImlhdCI6MTc1NzY2ODgxMSwiYXV0aF90aW1lIjoxNzU3NjY2MTY1LCJqdGkiOiIxNTExMmVkNC0yNTFlLTQwMDQtYTNhYi0zM2JlMjUwMmU0YjEiLCJpc3MiOiJodHRwczovL2F1dGgtYm8uaHViODguaW8vYXV0aC9yZWFsbXMvaHViODhfYm8iLCJhdWQiOlsiaHViLXdhbGxldCIsImh1Yjg4X2NsaWVudF9hcmVhIiwiaHViODhfYm9fYmFja2VuZCIsImFjY291bnQiXSwic3ViIjoiN2YyYmEyYWItMTg1OC00MWMzLWJhMmEtZDZlNDgxOGUzYzc2IiwidHlwIjoiQmVhcmVyIiwiYXpwIjoiaHViODhfYm9fd2ViIiwibm9uY2UiOiI5MWU0MTkwOC1mNzM5LTRiZWUtOGY2OC01NmNjY2JiM2NmODQiLCJzZXNzaW9uX3N0YXRlIjoiNTQxNmY1MjYtYmViNS00OWVkLWI4ZGYtYWFkNDA3MzgzMDkwIiwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbImRlZmF1bHQtcm9sZXMtaHViODhfYm8iLCJvZmZsaW5lX2FjY2VzcyIsInVtYV9hdXRob3JpemF0aW9uIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiaHViLXdhbGxldCI6eyJyb2xlcyI6WyJhcjpnZXRNeVBlbmRpbmdBcHByb3ZhbCIsImFyOmNyZWF0ZVJlbGF0ZWRBY2NvdW50VXNlciIsImFyOnVwZGF0ZU15QWNjb3VudFJlY2lwaWVudCIsImFyOmxpc3RNeVN0YXRlbWVudHMiLCJhcjpnZXRNeVBheW1lbnQiLCJhcjpyZWplY3RNeVBheW1lbnQiLCJhcjpyZWplY3RNeVdpdGhkcmF3YWwiLCJhcjphcHByb3ZlTXlXaXRoZHJhd2FsIiwiYXI6Z2V0TXlTdGF0ZW1lbnQiLCJhcjpsaXN0TXlXYWxsZXRzIiwiYXI6bGlzdE15V2l0aGRyYXdhbHMiLCJhcjpkZWxldGVNeUFjY291bnRSZWNpcGllbnQiLCJhcjpjcmVhdGVNeVdpdGhkcmF3YWwiLCJhcjpsaXN0TXlBY2NvdW50c1VzZXJzIiwiYXI6Z2V0TXlFeGNoYW5nZSIsImFyOm15U3VwcG9ydGVkQ3VycmVuY2llcyIsImFyOnJlamVjdE15RXhjaGFuZ2UiLCJhcjpsaXN0TXlQZW5kaW5nQXBwcm92YWxzIiwiYXI6Z2V0TXlBY2NvdW50VXNlciIsImFyOmNyZWF0ZU15RXhjaGFuZ2UiLCJhcjpsaXN0TXlQYXltZW50cyIsImFyOnVwZGF0ZVJlbGF0ZWRBY2NvdW50VXNlciIsImFyOmNyZWF0ZU15UGF5bWVudCIsImFyOmdldE15RGVwb3NpdEluZm8iLCJhcjpnZXRNeVdhbGxldCIsImFyOmxpc3RNeUFjY291bnRzUmVjaXBpZW50cyIsImFyOmNyZWF0ZU15QWNjb3VudFJlY2lwaWVudCIsImFyOnVwZGF0ZU15QWNjb3VudFVzZXIiLCJhcjpzdXBwb3J0ZWRDdXJyZW5jaWVzIiwiYXI6YXBwcm92ZU15RXhjaGFuZ2UiLCJhcjpsaXN0UmVsYXRlZEFjY291bnRzVXNlcnMiLCJhcjpsaXN0TXlBY2NvdW50cyIsImFyOmdldE15U3RhdGVtZW50UmVjZWlwdCIsImFyOmdldE15QWNjb3VudCIsImFyOmNhbGN1bGF0ZU15VHJhbnNhY3Rpb25GZWUiLCJhcjpsaXN0TXlFeGNoYW5nZXMiLCJhcjpnZXRNeVdpdGhkcmF3YWwiLCJhcjpwYWlyQ3VycmVuY3lJbmZvIiwidXNlciIsImFyOmFwcHJvdmVNeVBheW1lbnQiLCJhcjp1cGRhdGVNeUFjY291bnQiXX0sImh1Yjg4X2NsaWVudF9hcmVhIjp7InJvbGVzIjpbImFyOnBpbmciLCJjeHBvcnRhbCIsImFyOmdldEF0dGFjaG1lbnQiLCJhcjpnZXRFbnZpcm9ubWVudHMiLCJhcjpnZXRDYXNlIiwiYXI6Y3JlYXRlQ2FzZSIsImFyOnVwZGF0ZUNhc2UiLCJwcjpwb3J0YWwiLCJhcjpsaXN0Q2FzZXMiLCJhcjpjcmVhdGVDYXNlQ29tbWVudCJdfSwiaHViODhfYm9fYmFja2VuZCI6eyJyb2xlcyI6WyJyZXBvcnRzIiwiaW52b2ljZV9wYXltZW50IiwiaW52b2ljZXMiLCJjYV9jeHBvcnRhbCIsImxlZ2FsIiwiZ2FtZXMiLCJodWJfd2FsbGV0Iiwid2FsbGV0cyIsImZyZWViZXRzIiwidHJhbnNhY3Rpb25zIiwiZGFzaGJvYXJkIl19LCJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6Im9wZW5pZCBlbWFpbCBib19zY29wZSBwcm9maWxlIiwic2lkIjoiNTQxNmY1MjYtYmViNS00OWVkLWI4ZGYtYWFkNDA3MzgzMDkwIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJyZWRpcmVjdF9lbnZfdXJscyI6eyJldTEiOiJodHRwczovL2JvLmh1Yjg4LmlvIiwiYXMxIjoiaHR0cHM6Ly9iby5hczEuaHViODguaW8vIiwiYW0iOiJodHRwczovL2JvLmFtLmh1Yjg4LmlvLyIsImV1MiI6Imh0dHBzOi8vYm8uZmx5YmlyZC5pby8ifSwibmFtZSI6IkJydW5vIFBlcmVzIiwicHJlZmVycmVkX3VzZXJuYW1lIjoiYnJ1bm8ucGVyZXNAeW9sby5jb20iLCJnaXZlbl9uYW1lIjoiQnJ1bm8iLCJibyI6eyJ1ZSI6WyJldTEiLCJldTIiLCJhczEiLCJhbSJdLCJhcGlfdmVyc2lvbnMiOlsidjNfYXMxIl0sImFwaV92ZXJzaW9uIjoidjMiLCJkYyI6IkVVUiJ9LCJmYW1pbHlfbmFtZSI6IlBlcmVzIiwiZW1haWwiOiJicnVuby5wZXJlc0B5b2xvLmNvbSJ9.YdA3qxcvGJKapxAimnHEPrsQlaxwd25FtfX_Q9k9Rx6F9VW0vSx-s86jaVXwf7zOyzFtweyQgaDgo4KlBAgfdaRphsyIZpVOtg2tAoeOzP-e108q57RKzZbGDu9WV_Z894frt2ddwfJQXirzBX8ShsPjmuVLllq0Vgr4mVx3qY44s6MegiOEeYZFBrOQ3TCTljXfbwUDpc_IMFljmQKygwjwpjlq1Z8ezzdKmZJPNwi2O4z7kkPSssfv1ELfuJFMaTC7rcjIRZ3RoSDMtvPRC9Qwz8lPjt46aa-QoD2AupRQh9fgb5bQaxLlJv-Bzw8pbtdA3Ut4uqfbdyoTXh1W8g',
    // Fixed time range (can be overridden by dynamic time ranges in scripts)
    startTime: "2025-09-11T00:00:00Z",
    endTime: "2025-09-11T23:59:59Z",
    // Filter parameters
    statuses: [],
    productCodes: [],
    transactionUuid: "fd710989-df65-5da4-bfb7-aa4fe01b224e",
    user: "16253",
    round: "83466703916182",
    operatorCodes: [],
    currencyCodes: [],
    // Performance testing parameters
    description: 'Hub88 BO Default Environment',
    vusers: 4,
    responseTimeThreshold: 1200,
    minSuccessfulQueries: 4
  }
};

// Select the environment based on the environment name
const selectedEnv = environments[envName] || environments['default'];

// For K6 and ES modules
export default selectedEnv;

// npm run test:perf:bo-as
// npm run test:perf:bo-eu
