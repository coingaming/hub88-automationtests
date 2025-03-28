import crypto from 'crypto';

export const baseUrl = 'https://api.server1.ih.testenv.io';
export const operatorID = 1205;
export const currencyCode = 'EUR';
export const gameCode = 'clt_astrowild, clt_basketballpro';
export const countryCode = 'FI';
export const langCode = 'en';

let privateKeyPromise;

// ✅ Load the private key before tests start
before(() => {
  privateKeyPromise = cy.task('readPrivateKey');
});

export async function generateSignature(payload) {
  const privateKey = await privateKeyPromise; // ✅ Wait until the key is loaded

  if (!privateKey) {
    throw new Error('❌ Private key not loaded');
  }

  const sign = crypto.createSign('RSA-SHA256');

  // Normalize the payload
  const normalizedPayload = JSON.stringify(payload)
    .replace(/\s+/g, '') // Remove spaces, newlines, and tabs
    .trim();

  sign.update(normalizedPayload);
  return sign.sign(privateKey, 'base64');
}
