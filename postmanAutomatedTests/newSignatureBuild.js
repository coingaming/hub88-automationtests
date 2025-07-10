// Raw request body (the data you want to sign)
let rawBody = request.data;

// Send the signing request
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
