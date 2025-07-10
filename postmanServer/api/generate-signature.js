import forge from 'node-forge';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    let rawBody = '';

    req.on('data', chunk => {
      rawBody += chunk;
    });

    req.on('end', () => {
      try {
        const parsedBody = JSON.parse(rawBody);

        const { privateKey, data } = parsedBody;

        if (!privateKey || !data) {
          return res.status(400).json({ error: 'Missing privateKey or data in request body' });
        }

        const privateKeyObj = forge.pki.privateKeyFromPem(privateKey);
        const md = forge.md.sha256.create();
        md.update(data, 'utf8');
        const signature = privateKeyObj.sign(md);
        const signatureBase64 = forge.util.encode64(signature);

        return res.status(200).json({ signature: signatureBase64 });
      } catch (error) {
        return res.status(400).json({ error: 'Failed to process request', details: error.message });
      }
    });
  } catch (err) {
    return res.status(500).json({ error: 'Unexpected error', details: err.message });
  }
}
