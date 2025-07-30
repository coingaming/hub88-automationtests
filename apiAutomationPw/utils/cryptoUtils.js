const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

let privateKey = null;

function loadPrivateKey() {
  if (!privateKey) {
    const keyPath = path.resolve(__dirname, '../private.key');
    privateKey = fs.readFileSync(keyPath, 'utf8');
  }
  return privateKey;
}

function generateSignature(payload) {
  if (!privateKey) loadPrivateKey();

  const sign = crypto.createSign('RSA-SHA256');
  const normalizedPayload = JSON.stringify(payload).replace(/\s+/g, '').trim();
  sign.update(normalizedPayload);
  return sign.sign(privateKey, 'base64');
}

module.exports = {
  loadPrivateKey,
  generateSignature
};
