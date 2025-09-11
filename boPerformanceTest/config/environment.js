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
    authToken: 'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJ1a3Z6ZmFPamp4ZjVVVkxhakdXUDM5NTI1UklsbXA1OGlxbTVOY0N3UFJBIn0.eyJleHAiOjE3NTc1OTY5NTAsImlhdCI6MTc1NzU5NjY1MCwiYXV0aF90aW1lIjoxNzU3NTk0NTc3LCJqdGkiOiI4MmYwODZmYi0yOTcwLTQ3NTQtYWNmNC0yZDkwYmMyYzQ4ZWUiLCJpc3MiOiJodHRwczovL2F1dGgtYm8uaHViODguaW8vYXV0aC9yZWFsbXMvaHViODhfYm8iLCJhdWQiOlsiaHViLXdhbGxldCIsImh1Yjg4X2NsaWVudF9hcmVhIiwiaHViODhfYm9fYmFja2VuZCIsImFjY291bnQiXSwic3ViIjoiN2YyYmEyYWItMTg1OC00MWMzLWJhMmEtZDZlNDgxOGUzYzc2IiwidHlwIjoiQmVhcmVyIiwiYXpwIjoiaHViODhfYm9fd2ViIiwibm9uY2UiOiI1M2JiOWY5NC0xYTdhLTRkZDktOGJiYy1jNmIyNWFjZDc2MmEiLCJzZXNzaW9uX3N0YXRlIjoiMzBhOGZjODAtZDUxYy00Y2M1LWE4MmMtZGU1MDJlOWVmOWI5IiwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbImRlZmF1bHQtcm9sZXMtaHViODhfYm8iLCJvZmZsaW5lX2FjY2VzcyIsInVtYV9hdXRob3JpemF0aW9uIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiaHViLXdhbGxldCI6eyJyb2xlcyI6WyJhcjpnZXRNeVBlbmRpbmdBcHByb3ZhbCIsImFyOmNyZWF0ZVJlbGF0ZWRBY2NvdW50VXNlciIsImFyOnVwZGF0ZU15QWNjb3VudFJlY2lwaWVudCIsImFyOmxpc3RNeVN0YXRlbWVudHMiLCJhcjpnZXRNeVBheW1lbnQiLCJhcjpyZWplY3RNeVBheW1lbnQiLCJhcjpyZWplY3RNeVdpdGhkcmF3YWwiLCJhcjphcHByb3ZlTXlXaXRoZHJhd2FsIiwiYXI6Z2V0TXlTdGF0ZW1lbnQiLCJhcjpsaXN0TXlXYWxsZXRzIiwiYXI6bGlzdE15V2l0aGRyYXdhbHMiLCJhcjpkZWxldGVNeUFjY291bnRSZWNpcGllbnQiLCJhcjpjcmVhdGVNeVdpdGhkcmF3YWwiLCJhcjpsaXN0TXlBY2NvdW50c1VzZXJzIiwiYXI6Z2V0TXlFeGNoYW5nZSIsImFyOm15U3VwcG9ydGVkQ3VycmVuY2llcyIsImFyOnJlamVjdE15RXhjaGFuZ2UiLCJhcjpsaXN0TXlQZW5kaW5nQXBwcm92YWxzIiwiYXI6Z2V0TXlBY2NvdW50VXNlciIsImFyOmNyZWF0ZU15RXhjaGFuZ2UiLCJhcjpsaXN0TXlQYXltZW50cyIsImFyOnVwZGF0ZVJlbGF0ZWRBY2NvdW50VXNlciIsImFyOmNyZWF0ZU15UGF5bWVudCIsImFyOmdldE15RGVwb3NpdEluZm8iLCJhcjpnZXRNeVdhbGxldCIsImFyOmxpc3RNeUFjY291bnRzUmVjaXBpZW50cyIsImFyOmNyZWF0ZU15QWNjb3VudFJlY2lwaWVudCIsImFyOnVwZGF0ZU15QWNjb3VudFVzZXIiLCJhcjpzdXBwb3J0ZWRDdXJyZW5jaWVzIiwiYXI6YXBwcm92ZU15RXhjaGFuZ2UiLCJhcjpsaXN0UmVsYXRlZEFjY291bnRzVXNlcnMiLCJhcjpsaXN0TXlBY2NvdW50cyIsImFyOmdldE15U3RhdGVtZW50UmVjZWlwdCIsImFyOmdldE15QWNjb3VudCIsImFyOmNhbGN1bGF0ZU15VHJhbnNhY3Rpb25GZWUiLCJhcjpsaXN0TXlFeGNoYW5nZXMiLCJhcjpnZXRNeVdpdGhkcmF3YWwiLCJhcjpwYWlyQ3VycmVuY3lJbmZvIiwidXNlciIsImFyOmFwcHJvdmVNeVBheW1lbnQiLCJhcjp1cGRhdGVNeUFjY291bnQiXX0sImh1Yjg4X2NsaWVudF9hcmVhIjp7InJvbGVzIjpbImFyOnBpbmciLCJjeHBvcnRhbCIsImFyOmdldEF0dGFjaG1lbnQiLCJhcjpnZXRFbnZpcm9ubWVudHMiLCJhcjpnZXRDYXNlIiwiYXI6Y3JlYXRlQ2FzZSIsImFyOnVwZGF0ZUNhc2UiLCJwcjpwb3J0YWwiLCJhcjpsaXN0Q2FzZXMiLCJhcjpjcmVhdGVDYXNlQ29tbWVudCJdfSwiaHViODhfYm9fYmFja2VuZCI6eyJyb2xlcyI6WyJyZXBvcnRzIiwiaW52b2ljZV9wYXltZW50IiwiaW52b2ljZXMiLCJjYV9jeHBvcnRhbCIsImxlZ2FsIiwiZ2FtZXMiLCJodWJfd2FsbGV0Iiwid2FsbGV0cyIsImZyZWViZXRzIiwidHJhbnNhY3Rpb25zIiwiZGFzaGJvYXJkIl19LCJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6Im9wZW5pZCBlbWFpbCBib19zY29wZSBwcm9maWxlIiwic2lkIjoiMzBhOGZjODAtZDUxYy00Y2M1LWE4MmMtZGU1MDJlOWVmOWI5IiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJyZWRpcmVjdF9lbnZfdXJscyI6eyJldTEiOiJodHRwczovL2JvLmh1Yjg4LmlvIiwiYXMxIjoiaHR0cHM6Ly9iby5hczEuaHViODguaW8vIiwiYW0iOiJodHRwczovL2JvLmFtLmh1Yjg4LmlvLyIsImV1MiI6Imh0dHBzOi8vYm8uZmx5YmlyZC5pby8ifSwibmFtZSI6IkJydW5vIFBlcmVzIiwicHJlZmVycmVkX3VzZXJuYW1lIjoiYnJ1bm8ucGVyZXNAeW9sby5jb20iLCJnaXZlbl9uYW1lIjoiQnJ1bm8iLCJibyI6eyJ1ZSI6WyJldTEiLCJldTIiLCJhczEiLCJhbSJdLCJhcGlfdmVyc2lvbnMiOlsidjNfYXMxIl0sImFwaV92ZXJzaW9uIjoidjMiLCJkYyI6IkVVUiJ9LCJmYW1pbHlfbmFtZSI6IlBlcmVzIiwiZW1haWwiOiJicnVuby5wZXJlc0B5b2xvLmNvbSJ9.FFb4KrZtrbFJRd8ZsZrxRFfzdjO52VDUtiEwpIOK76oxQj8mLwT0dZUmyQEoVmRso7l4CRCmJDVAuunJIkS6AOLFPysS1n_lM5bf7AsffUPMFEUUTEf2XjO7SS3Z14EmOXORnpaKsqgjRiH4NdqC6QIBlB9hPdF8g0TZiqh983J97fscdAxELb1okmobNzQPzPq-XbOxL-QOlsx_keEEC8oBENBnsMSbvti4k_1mjucEenNtJ2kPGvZkmXYAyDRN045a4N1AbN8EERKW67C6PB6akc7cuxVDD2XZ1StxAAjlQv09ajcSj6Lh5hGRK9bv4rf4r9_hBA6VTONktq6EoA',
    startTime: "2025-09-11T00:00:00Z",
    endTime: "2025-09-11T23:59:59Z",
    statuses: [],
    productCodes: [],
    transactionUuid: "fd710989-df65-5da4-bfb7-aa4fe01b224e",
    user: "",
    round: "",
    operatorCodes: [],
    currencyCodes: [],
    description: 'Hub88 BO Default Environment',
    vusers: 10,
    responseTimeThreshold: 1200,
    minSuccessfulQueries: 10
  }
};

// Select the environment based on the environment name
const selectedEnv = environments[envName] || environments['default'];

// For K6 and ES modules
export default selectedEnv;

// npm run test:perf:bo-as
// npm run test:perf:bo-eu
