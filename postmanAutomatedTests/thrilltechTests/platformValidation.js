pm.test("Response status code is 400", function () {
  pm.response.to.have.status(400);
});

// Updated test to check if the response is a JSON
pm.test("Response is a JSON", function () {
  pm.response.to.be.json;
});

// Updated test to check if the response has an 'error' parameter
pm.test("Response has an 'error' parameter", function () {
  pm.expect(pm.response.json()).to.have.property('error');
});

// Updated test to check if the 'error' parameter contains the string 'currency' regardless of case sensitivity
pm.test("The 'error' parameter contains the string 'platform' (case insensitive)", function () {
  pm.expect(pm.response.json().error.toLowerCase()).to.include('platform');
});