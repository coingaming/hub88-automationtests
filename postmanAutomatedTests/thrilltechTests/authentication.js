pm.test("Response status code is 200", function () {
  pm.response.to.have.status(200);
});

// Updated test to check if the response is a JSON
pm.test("Response is a JSON", function () {
  pm.response.to.be.json;
});
var responseJSON = pm.response.json();

// Test the response body structure and values
pm.test("Response contains only expected keys with valid types", function () {
    const expectedKeys = ["api_url", "instance_id", "optin", "wss_url", "sdk_init_token"];
    const actualKeys = Object.keys(responseJSON);

    // Find unexpected and missing keys
    const unexpectedKeys = actualKeys.filter(key => !expectedKeys.includes(key));
    const missingKeys = expectedKeys.filter(key => !actualKeys.includes(key));

    // Log details
    if (unexpectedKeys.length > 0) {
        console.log("Unexpected keys in response:", unexpectedKeys);
    }

    if (missingKeys.length > 0) {
        console.log("Missing expected keys in response:", missingKeys);
    }

    // Assert no unexpected or missing keys
    pm.expect(unexpectedKeys, `Unexpected keys found: ${unexpectedKeys.join(", ")}`).to.be.empty;
    pm.expect(missingKeys, `Missing expected keys: ${missingKeys.join(", ")}`).to.be.empty;

    // Validate each field type only if all keys are correct
    if (unexpectedKeys.length === 0 && missingKeys.length === 0) {
        pm.expect(responseJSON.api_url).to.be.a('string');
        pm.expect(responseJSON.instance_id).to.be.a('string');
        pm.expect(responseJSON.optin).to.be.a('boolean');
        pm.expect(responseJSON.wss_url).to.be.a('string');
        pm.expect(responseJSON.sdk_init_token).to.be.a('string');
    }
});

