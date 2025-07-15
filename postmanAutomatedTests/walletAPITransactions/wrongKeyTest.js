//PRE REQUEST SCRIPT
// Function to generate a standard 16-byte UUID (v4)
function generateUUID() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

// Ensure the request body is valid and add request_uuid
let requestBody;
try {
    // Parse the raw request body if it exists
    requestBody = pm.request.body.raw ? JSON.parse(pm.request.body.raw) : {};
} catch (e) {
    console.error('Error parsing request body:', e);
    requestBody = {}; // Fallback to empty object if parsing fails
}

// Add or update the request_uuid in the request body
requestBody.request_uuid = generateUUID();

// Update the request body in Postman
pm.request.body.raw = JSON.stringify(requestBody);

// Use the updated request body for signing
let rawBody = pm.request.body.raw;

// Send the signing request (no private key sent)
pm.sendRequest({
    url: 'http://server1.ih.testenv.io:3003',
    method: 'POST',
    header: {
        'Content-Type': 'application/json'
    },
    body: {
        mode: 'raw',
        raw: JSON.stringify({
            data: rawBody
        })
    }
}, function (err, res) {
    if (err) {
        console.error('Signature generation failed:', err);
        return;
    }

    try {
        const json = res.json();
        const signature = json.signature;

        if (!signature) {
            console.error('No signature found in response:', json);
            return;
        }

        // Set signature in header
        pm.request.headers.upsert({
            key: 'x-hub88-signature',
            value: signature
        });
    } catch (e) {
        console.error('Error parsing signature response:', e);
    }
});




// POST RESPONSE TESTS
pm.test("Status code is 401 Unauthorized", function () {
    pm.response.to.have.status(401);
});

pm.test("Verify response status is RS_ERROR_INVALID_SIGNATURE", function () {
    const response = pm.response.json();
    pm.expect(response.status).to.equal("RS_ERROR_INVALID_SIGNATURE");
});