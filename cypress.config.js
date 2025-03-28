const { defineConfig } = require("cypress");
const fs = require('fs');
const path = require('path');

module.exports = defineConfig({
  projectId: 'hgdyuk',
  e2e: {
    setupNodeEvents(on, config) {
      on('task', {
        readPrivateKey() {
          const privateKeyPath = path.resolve(__dirname, './secure/private-key.pem');
          console.log(`🔍 Checking private key at: ${privateKeyPath}`);

          if (!fs.existsSync(privateKeyPath)) {
            throw new Error(`❌ Private key file not found at: ${privateKeyPath}`);
          }

          const key = fs.readFileSync(privateKeyPath, 'utf8');
          console.log('✅ Private key loaded successfully!');
          return key;
        }
      });
    },
  },
});
