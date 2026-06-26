const Razorpay = require('razorpay');

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return res.status(500).json({ error: 'Razorpay API keys are not configured in Vercel' });
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const { amount, currency = 'INR', receipt } = req.body;

    // Validate amount (minimum 100 paise = ₹1)
    if (!amount || amount < 100) {
      return res.status(400).json({ error: 'Amount must be at least 100 paise (₹1)' });
    }

    const order = await razorpay.orders.create({
      amount: Math.round(amount),
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
    });

    return res.status(200).json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error('Razorpay create order error:', error);

    if (error.statusCode === 401) {
      return res.status(401).json({ error: 'Razorpay authentication failed' });
    }

    return res.status(500).json({ error: 'Failed to create order' });
  }
};
