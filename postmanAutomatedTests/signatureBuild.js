// Raw request body (the data to sign)
let rawBody = request.data;

// Your private key (should be kept secure!)
let privateKey = `
-----BEGIN RSA PRIVATE KEY-----
keyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy
-----END RSA PRIVATE KEY-----
`;

// Send the signing request
pm.sendRequest({
    url: 'http://localhost:3000',
    method: 'POST',
    header: {
        'Content-Type': 'application/json'
    },
    body: {
        mode: 'raw',
        raw: JSON.stringify({
            privateKey: privateKey,
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
