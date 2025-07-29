// Test 1: Check if the response status code is 200
pm.test("Status code is 200 OK", function () {
    pm.response.to.have.status(200);
});

// Test 2: Check if the response time is within an acceptable range (e.g., < 1000ms)
pm.test("Response time is less than 1000ms", function () {
    pm.expect(pm.response.responseTime).to.be.below(1000);
});

// Test 3: Check if the response matches the expected schema
pm.test("Response matches expected schema", function () {
    const response = pm.response.json();
    const schema = {
        type: "array",
        items: {
            type: "object",
            required: ["product_name", "product_code", "product_logo_url"],
            properties: {
                product_logo_url: { type: ["string", "null"] },
                product_name: { type: "string" },
                product_code: { type: "string" },
            },
            additionalProperties: false
        }
    };
    pm.expect(response).to.have.jsonSchema(schema);
});
