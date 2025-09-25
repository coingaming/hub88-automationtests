// Updated Pre-request Script for Pragmatic Play API (handles url-encoding & placeholders)
(function () {
    // helpers
    function isEncoded(s) {
        return /%[0-9A-Fa-f]{2}/.test(s);
    }

    // Generate basic dynamic values
    const timestamp = Date.now().toString();
    const roundId = (Math.floor(Math.random() * 9_000_000_000) + 1_000_000_000).toString();
    const reference = CryptoJS.MD5(Math.random().toString()).toString(CryptoJS.enc.Hex);

    // secret
    const hashSecret = pm.environment.get('secretPrag') || '';

    // store env
    pm.environment.set('timestamp', timestamp);
    pm.environment.set('roundId', roundId);
    pm.environment.set('reference', reference);

    // Build params from the request body (urlencoded)
    let bodyMembers = [];
    if (pm.request.body && pm.request.body.urlencoded && pm.request.body.urlencoded.members) {
        // preferred: members array (preserves original input)
        bodyMembers = pm.request.body.urlencoded.members.filter(m => !m.disabled);
    } else if (pm.request.body && pm.request.body.urlencoded && typeof pm.request.body.urlencoded.toObject === 'function') {
        // fallback: toObject -> convert to members
        const obj = pm.request.body.urlencoded.toObject();
        bodyMembers = Object.keys(obj).map(k => ({ key: k, value: obj[k], disabled: false }));
    } else {
        throw new Error('Unable to read urlencoded body members.');
    }

    const params = {};

    bodyMembers.forEach(member => {
        const key = member.key;
        if (key === 'hash') return; // skip hash param
        // replace Postman variables inside the value
        let value = pm.variables.replaceIn(String(member.value || ''));

        // If value already contains percent-encoding like %3C, assume it's already encoded
        if (!isEncoded(value)) {
            // encode to match x-www-form-urlencoded that Postman will send
            value = encodeURIComponent(value).replace(/%20/g, '+');
        } else {
            // If already encoded, make sure spaces are '+' (if any)
            value = value.replace(/%20/g, '+');
        }

        params[key] = value;
    });

    // Ensure dynamic values are used (and encoded same way)
    params.timestamp = encodeURIComponent(timestamp).replace(/%20/g, '+');
    params.roundId = encodeURIComponent(roundId).replace(/%20/g, '+');
    params.reference = encodeURIComponent(reference).replace(/%20/g, '+');

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

    // Debug logs (open Postman Console)
    // console.log('Sorted keys:', sortedKeys);
    // console.log('Parameter string used for hash:', paramString);
    // console.log('Appended secret (last 4 chars):', hashSecret.slice(-4));
    // console.log('Raw string hashed:', rawString);
    // console.log('Generated hash:', hash);
})();
