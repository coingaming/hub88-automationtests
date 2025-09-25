pm.test("Response status code is 200", function () {
    pm.response.to.have.status(200);
  });
  
  // Updated test to check if the response is a JSON
  pm.test("Response is a JSON", function () {
    pm.response.to.be.json;
  });
  
  // Updated test to check if the response has the expected keys
  pm.test("Response has the expected keys", function () {
    const response = pm.response.json();
    const expectedKeys = ['bonus', 'cash', 'currency', 'description', 'error', 'transactionId'];
    pm.expect(Object.keys(response)).to.have.members(expectedKeys);
  });
  
  // Updated test to check if the 'error' parameter is always 0
  pm.test("The 'error' parameter is 0", function () {
    pm.expect(pm.response.json().error).to.equal(0);
  });
  
  // Updated test to check if the 'currency' parameter is a valid ISO code
  pm.test("The 'currency' parameter is a valid ISO currency code", function () {
    const currencyCode = pm.response.json().currency;
    pm.expect(currencyCode).to.match(/^[A-Z]{3}$/);
  });
  
  // Updated test to check if the 'description' parameter is always 'Success'
  pm.test("The 'description' parameter is 'Success'", function () {
    pm.expect(pm.response.json().description).to.equal('Success');
  });