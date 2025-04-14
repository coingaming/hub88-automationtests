import crypto from 'crypto';

// Panel to test Game code and Game List
export const baseUrl = 'https://api.as1.hub88.io'; //'https://api.server1.ih.testenv.io';
export const operatorID = 221;
export const currencyCode = 'USD, JPY';
export const gameCode = 'klb_9blazingcashpots';
export const countryCode = 'JP';
export const langCode = 'jp';

// Panel to test Freebets API
export const operatorIDfreeBets = 221;
export const currencyCodefreeBets = 'JPY, USD';
export const gameCodefreeBets = 'klb_9blazingcashpots';

// npx cypress run --record --key c0520a37-0f02-43be-8d7d-c78f740590ea --spec "cypress/e2e/operator/operatorGameLauncherTest.cy.js, cypress/e2e/operator/operatorGameListTest.cy.js, cypress/e2e/operator/operatorFreebetsAPI.cy.js"

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