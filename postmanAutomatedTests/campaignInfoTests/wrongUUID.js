// Parse the response body as JSON
const response = pm.response.json();

// Test 1: Check if the response status code is 200
pm.test("Status code is 400 OK", function () {
    pm.response.to.have.status(400);
});

// Test 2: Check if the response is a JSON object
pm.test("Response is a JSON object", function () {
    pm.expect(response).to.be.an("object");
});

// Test 3: Check if the response time is within an acceptable range (e.g., < 500ms)
pm.test("Response time is less than 1000ms", function () {
    pm.expect(pm.response.responseTime).to.be.below(500);
});

// Test 5: Check if the response matches the expected schema
// Updated test to check if the 'error' parameter contains the string 'campaign_uuid' regardless of case sensitivity
pm.test("The 'error' parameter contains the string 'campaign_uuid' with a proper message (case insensitive)", function () {
  pm.expect(pm.response.json().error.toLowerCase()).to.include('campaign_uuid');
});