export async function generateSignature(payload) {
    const response = await fetch('http://server1.ih.testenv.io:3003', {
      method: 'POST', // Specify the HTTP method
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: JSON.stringify(payload) }), // Stringify the payload
    });

    // Check if the response was successful
    if (!response.ok) {
      throw new Error(`Failed to generate signature: ${response.status} - ${await response.text()}`);
    }

    const json = await response.json();
    // Check if the signature is present in the response
    if (!json || !json.signature) {
      throw new Error(`No signature found in response: ${JSON.stringify(json)}`);
    }

    return json.signature;
  }