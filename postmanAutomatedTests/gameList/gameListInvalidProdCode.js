pm.test("Check response status is 400", function () {
    pm.response.to.have.status(400);
});

pm.test("Check response is JSON", function () {
    pm.response.to.be.json;
});

// Updated test to check if the response has an 'error' parameter
pm.test("Response has an 'error' parameter", function () {
  pm.expect(pm.response.json()).to.have.property('error');
});

// Updated test to check if the 'error' parameter contains the string 'product_code' regardless of case sensitivity
pm.test("The 'error' parameter contains the string 'product_code' with a proper message (case insensitive)", function () {
  pm.expect(pm.response.json().error.toLowerCase()).to.include('product_code');
});