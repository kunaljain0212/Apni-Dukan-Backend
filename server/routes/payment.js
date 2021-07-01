import express from 'express';
import uuidv1 from 'uuid/v1';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { isSignedin, isAuthenticated } from '../controllers/auth';
import { getUserById } from '../controllers/user';

const router = express.Router();

router.param('userId', getUserById);

const razorpay = new Razorpay({
  key_id: process.env.KEY_ID,
  key_secret: process.env.KEY_SECRET,
});

router.post('/payments/order/:userId', isSignedin, isAuthenticated, async (req, res) => {
  const { amount } = req.body;
  const paymentCapture = 1;
  const currency = 'INR';

  const options = {
    amount: (amount * 100).toString(),
    currency,
    receipt: uuidv1(),
    payment_capture: paymentCapture,
  };
  try {
    const response = await razorpay.orders.create(options);
    console.log(response);
    res.json({
      id: response.id,
      currency: 'INR',
      amount: response.amount,
    });
  } catch (error) {
    console.log(error);
  }
});

router.post('/payment/verification', (req, res) => {
  const secret = process.env.PAYMENT_SECRET;
  const shasum = crypto.createHmac('sha256', secret);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest('hex');
  console.log(digest, req.headers['x-razorpay-signature']);

  if (digest === req.headers['x-razorpay-signature']) {
    res.status(200).json({ message: 'Payment verification successful' });
  } else {
    res.status(500).json({ error: 'Payment verification failed' });
  }
});

export default router;
