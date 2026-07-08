const https = require('https');

module.exports = async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const orderId = req.query.order_id;
  if (!orderId) {
    return res.status(400).json({ error: 'Missing order_id' });
  }

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    return res.status(500).json({ error: 'Razorpay keys not configured' });
  }

  const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');

  const options = {
    hostname: 'api.razorpay.com',
    port: 443,
    path: `/v1/orders/${orderId}`,
    method: 'GET',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/json'
    }
  };

  return new Promise((resolve, reject) => {
    const request = https.request(options, (response) => {
      let data = '';
      response.on('data', (chunk) => {
        data += chunk;
      });

      response.on('end', () => {
        try {
          const order = JSON.parse(data);
          return resolve(res.status(response.statusCode).json(order));
        } catch (e) {
          return resolve(res.status(500).json({ error: 'Failed to parse response' }));
        }
      });
    });

    request.on('error', (e) => {
      return resolve(res.status(500).json({ error: e.message }));
    });

    request.end();
  });
};
