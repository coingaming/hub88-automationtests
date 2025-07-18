// Parse the response body as JSON
const response = pm.response.json();

// Test 1: Check if the response status code is 200
pm.test("Status code is 200 OK", function () {
    pm.response.to.have.status(200);
});

// Test 2: Check if the response is a JSON object
pm.test("Response is a JSON object", function () {
    pm.expect(response).to.be.an("object");
});

// Test 3: Check if the payload is not empty
pm.test("Payload is not empty", function () {
    const url = new URL(response.url);
    const payload = url.searchParams.get("payload");
    pm.expect(payload).to.not.be.empty;
});

// Test 4: Check if the response time is within an acceptable range (e.g., < 500ms)
pm.test("Response time is less than 1000ms", function () {
    pm.expect(pm.response.responseTime).to.be.below(500);
});

// Test 5: Check if the response body only contains the 'url' key (no unexpected keys)
pm.test("Response body contains only 'url' key", function () {
    const keys = Object.keys(response);
    pm.expect(keys).to.have.lengthOf(1);
    pm.expect(keys).to.include("url");
});

// Test 6: Check if the response does not contain any null or undefined values
pm.test("Response does not contain null or undefined values", function () {
    pm.expect(response.url).to.not.be.null;
    pm.expect(response.url).to.not.be.undefined;
});

// Test 7: Check if the response matches the expected schema (basic JSON schema validation)
pm.test("Response matches expected schema", function () {
    const schema = {
        type: "object",
        required: ["url"],
        properties: {
            url: { type: "string" }
        },
        additionalProperties: false
    };
    pm.expect(response).to.have.jsonSchema(schema);
});

// Test 8: Check if the URL hostname matches the expected value
pm.test("URL hostname is correct", function () {
    const url = new URL(response.url);
    pm.expect(url.hostname).to.equal("launcher.server1.ih.testenv.io");
});

// Test 9: Check if the URL protocol is HTTPS
pm.test("URL uses HTTPS protocol", function () {
    const url = new URL(response.url);
    pm.expect(url.protocol).to.equal("https:");
});