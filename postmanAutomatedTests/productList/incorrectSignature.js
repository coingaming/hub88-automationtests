// Test 1: Check if the response status code is 200
pm.test("Status code is 401 OK", function () {
    pm.response.to.have.status(401);
});

// Test 2: Check if the response time is within an acceptable range (e.g., < 1000ms)
pm.test("Response time is less than 1000ms", function () {
    pm.expect(pm.response.responseTime).to.be.below(1000);
});

// Test 3: Check if the response matches the expected schema
pm.test("The 'error' parameter contains the string 'signature' with a proper message (case insensitive)", function () {
  pm.expect(pm.response.json().error.toLowerCase()).to.include('signature');
});