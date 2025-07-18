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

// Test 3: Check if the response time is within an acceptable range (e.g., < 500ms)
pm.test("Response time is less than 500ms", function () {
    pm.expect(pm.response.responseTime).to.be.below(500);
});

// Test 4: Check if the response does not contain any null or undefined values
pm.test("Prepaid UUID is not null or undefined", function () {
    pm.expect(response.prepaid_uuid).to.not.be.null;
    pm.expect(response.prepaid_uuid).to.not.be.undefined;
});

// Test 5: Verify if the campaign_uuid in the response matches the campaign_uuid in the request body
const requestBody = pm.request.body.raw ? JSON.parse(pm.request.body.raw) : {};

pm.test("Campaign UUID matches the request", function () {
    pm.expect(response.campaign_uuid).to.equal(requestBody.campaign_uuid);
});

// Test 6: Check if the response matches the expected schema
pm.test("Response matches expected schema", function () {
    const schema = {
        type: "object",
        required: ["prepaid_uuid", "name", "currency", "campaign_uuid", "bet_value"],
        properties: {
            start_time: { type: ["string", "null"] },
            prepaid_uuid: { type: "string" },
            name: { type: "string" },
            game_code: { type: "string" },
            end_time: { type: ["string", "null"] },
            currency: { type: "string" },
            campaign_uuid: { type: "string" },
            bet_value: { type: "number" },
            bet_count: { type: ["number", "null"] },
            game_id: { type: "number" }
        },
        additionalProperties: false
    };
    pm.expect(response).to.have.jsonSchema(schema);
});
