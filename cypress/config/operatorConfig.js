import crypto from 'crypto';

// Generic Information to all Tests - Game List Parameter is Operator ID
export const baseUrl = 'https://api.server1.ih.testenv.io';
export const operatorID = 1205;

// Panel to test Game Launcher
export const currencyCode = 'GLD, SS1';
export const gameCode = 'pgp_5lionsgold, pgp_6jokers, pgp_7piggies';
export const countryCode = 'US, DE';
export const langCode = 'en, es';

// Panel to test Freebets API
export const operatorIDfreeBets = 1205;
export const currencyCodefreeBets = 'EUR, USD';
export const gameCodefreeBets = 'wzn_arcade, wzn_babylontreasure';

// Command to run Recorded Tests in the Terminal:
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