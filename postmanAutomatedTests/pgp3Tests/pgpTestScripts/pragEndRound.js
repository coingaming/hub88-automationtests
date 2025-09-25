pm.test("Response status code is 200", function () {
    pm.response.to.have.status(200);
});

// Post-request Script for Pragmatic Play API
pm.test("Response body is valid JSON", function () {
  pm.response.to.be.json;
});

pm.test("Response body has the expected keys", function () {
  const response = pm.response.json();
  const expectedKeys = ['bonus', 'cash', 'description', 'error'];
  pm.expect(Object.keys(response)).to.have.members(expectedKeys);
});

pm.test("The 'bonus' parameter is 0.0", function () {
  pm.expect(pm.response.json().bonus).to.equal(0.0);
});

pm.test("The 'cash' parameter is 9999.0", function () {
  pm.expect(pm.response.json().cash).to.equal(9999.0);
});

pm.test("The 'description' parameter is 'Success'", function () {
  pm.expect(pm.response.json().description).to.equal('Success');
});

pm.test("The 'error' parameter is 0", function () {
  pm.expect(pm.response.json().error).to.equal(0);
});