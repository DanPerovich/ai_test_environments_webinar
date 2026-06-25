'use strict';

require('dotenv').config();

const express = require('express');
const { listProducts, getPricesForProduct } = require('./products-service');
const { createPaymentIntent } = require('./checkout-service');

const app = express();
app.use(express.json());

app.get('/products', async (req, res) => {
  try {
    const products = await listProducts();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/products/:id/prices', async (req, res) => {
  try {
    const prices = await getPricesForProduct(req.params.id);
    res.json(prices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/checkout', async (req, res) => {
  try {
    const { amount, currency, priceId, quantity } = req.body;
    const result = await createPaymentIntent({ amount, currency, priceId, quantity });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`stripe-checkout-service listening on port ${PORT}`);
  console.log(`Stripe API host: ${process.env.STRIPE_API_HOST || 'api.stripe.com'}`);
});

module.exports = app;
