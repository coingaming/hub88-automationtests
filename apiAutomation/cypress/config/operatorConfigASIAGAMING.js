import crypto from 'crypto';

// Europe Game Launcher
export const baseUrl = 'https://api.hub88.io';
export const operatorID = 220;

// Panel to test Game Launcher
export const currencyCode = 'VND, IDR';
export const gameCode = 'asg_baccaratb1, asg_bullbull, asg_lobby, asg_baccaratn16, asg_baccaratn06';
export const countryCode = 'JP';
export const langCode = 'jp';

// Panel to test Freebets API
export const operatorIDfreeBets = 220;
export const currencyCodefreeBets = 'VND, IDR';
export const gameCodefreeBets = 'asg_baccaratb1, asg_bullbull';


// Asia Game Launcher Asia Env
export const baseUrlAsia = 'https://api.as1.hub88.io';
export const operatorIDAsia = 221;
export const gameCodeAsia = 'asg_baccaratn72, asg_micardbaccaratm90, asg_baccaratn08, asg_baccaratn06, asg_speedbaccaratm73';


// Command to run Recorded Tests in the Terminal:
// npx cypress run --record --key c0520a37-0f02-43be-8d7d-c78f740590ea --spec "cypress/e2e/operator/operatorASIAGAMINGTest.cy.js"

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