import crypto from 'crypto';

// Panel to test Game code and Game List
export const baseUrl = 'https://api.server1.ih.testenv.io';
export const operatorID = 1205;
export const currencyCode = 'EUR, mBTC, ARS';
export const gameCode = 'wzn_arcade, wzn_babylontreasure';
export const countryCode = 'FI';
export const langCode = 'en, es';

// Panel to test Freebets API
export const operatorIDfreeBets = 1205;
export const currencyCodefreeBets = 'EUR, USD';
export const gameCodefreeBets = 'wzn_arcade, wzn_babylontreasure';

// Variable to store the private key
let privateKey = null;

// Function to load the private key
export const loadPrivateKey = () => {
  return cy.task('readPrivateKey').then((key) => {
    if (!key) {
      throw new Error('❌ Failed to load private key from cy.task');
    }
    privateKey = key;
    return key; // For chaining if needed
  });
};

export async function generateSignature(payload) {
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