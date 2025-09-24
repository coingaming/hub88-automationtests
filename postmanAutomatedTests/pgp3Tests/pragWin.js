// Pre-request Script for Pragmatic Play API
(function () {
    // Generate basic values
    const timestamp = Date.now().toString();
    const reference = CryptoJS.MD5(Math.random().toString()).toString(CryptoJS.enc.Hex);

    // Get hash_secret from environment
    const hashSecret = pm.environment.get('secretPrag') || '';

    // Store basic values in environment variables
    pm.environment.set('timestamp', timestamp);
    pm.environment.set('reference', reference);

    // Create a parameters object with all request parameters
    const params = {};

    // Get existing form parameters from the request body
    const body = pm.request.body.urlencoded.toObject();

    // Replace variable placeholders like {{var}} with actual values
    Object.keys(body).forEach(key => {
        if (key !== 'hash') {
            params[key] = pm.variables.replaceIn(body[key]);
        }
    });

    // Update with dynamic values
    params.timestamp = timestamp;
    params.reference = reference;

    // HASH CALCULATION - following Hub88's algorithm
    // 1. Sort keys alphabetically
    const sortedKeys = Object.keys(params).sort();

    // 2. Build parameter string in "key=value&key=value" format
    const paramString = sortedKeys.map(key => `${key}=${params[key]}`).join('&');

    // 3. Append hash_secret (no separator)
    const rawString = paramString + hashSecret;

    // 4. Calculate MD5 hash and convert to lowercase hex
    const hash = CryptoJS.MD5(rawString).toString(CryptoJS.enc.Hex).toLowerCase();

    // Store the hash
    pm.environment.set('hash', hash);

    // Log debug info
    console.log('Parameters for hash calculation:', paramString);
    console.log('Hash secret (last 4 chars):', hashSecret.slice(-4));
    console.log('Generated hash:', hash);
})();
