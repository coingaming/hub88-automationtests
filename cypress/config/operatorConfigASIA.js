import crypto from 'crypto';

// Generic Information to all Tests - Game List Parameter is Operator ID
export const baseUrl = 'https://api.as1.hub88.io';
export const operatorID = 221;

// Panel to test Game Launcher
export const currencyCode = 'USD, JPY';
export const gameCode = 'png_moonprincess100, nlc_duckhunters, nvm_5sevensholdwinchristmas, asg_baccaratn72, sbe_aviator, evo_bombayclubspeedroulette, bbl_baccarathighroller2, pgp_gatesofolympus1000, gmx_pilot, btsg_sportbetting, pgs_mahjongways2, tbg_mines, jdb_caishenfishing, hsg_wanteddeadorawild';
export const countryCode = 'JP';
export const langCode = 'jp';

// Panel to test Freebets API
export const operatorIDfreeBets = 221;
export const currencyCodefreeBets = 'USD';
export const gameCodefreeBets = 'klb_9blazingcashpots, png_moonprincess100, sbe_aviator, evo_bombayclubspeedroulette, bbl_baccarathighroller2, hsg_wanteddeadorawild';

// Command to run Recorded Tests in the Terminal:
// npx cypress run --record --key c0520a37-0f02-43be-8d7d-c78f740590ea --spec "cypress/e2e/operator/operatorGameLauncherASIATest.cy.js"
// npx cypress run --record --key c0520a37-0f02-43be-8d7d-c78f740590ea --spec "cypress/e2e/operator/operatorPrepaidsASIA.cy.js"

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