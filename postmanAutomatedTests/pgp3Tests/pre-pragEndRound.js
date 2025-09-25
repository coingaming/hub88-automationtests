// Pre-request Script for Pragmatic Play API
(function () {
    // Get hash_secret from environment
    const hashSecret = pm.environment.get('secretPrag') || '';

    // Build params directly from env + fixed providerId
    const params = {
        gameId: pm.environment.get('gameIdPrag') || '',
        providerId: 'PragmaticPlay',
        userId: pm.environment.get('userIdPrag') || '',
        roundId: pm.environment.get('roundId') || '',
        token: pm.environment.get('tokenPrag') || ''
    };

    // HASH CALCULATION (Hub88 algorithm)
    // 1. Sort keys alphabetically
    const sortedKeys = Object.keys(params).sort();

    // 2. Build "key=value&key=value" string
    const paramString = sortedKeys.map(key => `${key}=${params[key]}`).join('&');

    // 3. Append hash_secret
    const rawString = paramString + hashSecret;

    // 4. MD5 -> lowercase hex
    const hash = CryptoJS.MD5(rawString).toString(CryptoJS.enc.Hex).toLowerCase();

    // Save hash into environment (optional)
    pm.environment.set('hash', hash);

    // ✅ Update body values (x-www-form-urlencoded)
    pm.request.body.urlencoded.clear();
    pm.request.body.urlencoded.add({ key: 'gameId', value: params.gameId });
    pm.request.body.urlencoded.add({ key: 'providerId', value: params.providerId });
    pm.request.body.urlencoded.add({ key: 'userId', value: params.userId });
    pm.request.body.urlencoded.add({ key: 'roundId', value: params.roundId });
    pm.request.body.urlencoded.add({ key: 'token', value: params.token });
    pm.request.body.urlencoded.add({ key: 'hash', value: hash });

    // Debug logs
    console.log('Parameters for hash calculation:', paramString);
    console.log('Hash secret (last 4 chars):', hashSecret.slice(-4));
    console.log('Generated hash:', hash);
})();
