const express = require('express');
const forge = require('node-forge');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
const port = 3001;

// Read private key once during server startup
const privateKeyPem = fs.readFileSync('./private_key.pem', 'utf8');
const privateKeyObj = forge.pki.privateKeyFromPem(privateKeyPem);

// Middleware to parse raw JSON body
app.use(bodyParser.json());

app.post('/', (req, res) => {
  const { data } = req.body;

  if (!data) {
    return res.status(400).json({ error: 'Missing data in request body' });
  }

  // Sign the data
  const md = forge.md.sha256.create();
  md.update(data, 'utf8');
  const signature = privateKeyObj.sign(md);
  const signatureBase64 = forge.util.encode64(signature);

  return res.status(200).json({ signature: signatureBase64 });
});

// Catch all other methods
app.all('/', (req, res) => {
  res.setHeader('Allow', ['POST']);
  return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
