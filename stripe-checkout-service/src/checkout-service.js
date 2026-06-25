'use strict';

const { stripe } = require('./stripe-client');

/**
 * Create a Stripe PaymentIntent.
 *
 * @param {object} params
 * @param {number} params.amount    - Amount in smallest currency unit (e.g. cents)
 * @param {string} params.currency  - ISO 4217 currency code, defaults to 'usd'
 * @param {string} params.priceId   - Stripe Price ID, stored in metadata
 * @param {number} params.quantity  - Number of units, defaults to 1
 */
async function createPaymentIntent({ amount, currency = 'usd', priceId, quantity = 1 }) {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount * quantity,
    currency,
    metadata: {
      price_id: priceId,
      quantity: String(quantity),
    },
  });

  return {
    id: paymentIntent.id,
    clientSecret: paymentIntent.client_secret,
    amount: paymentIntent.amount,
    currency: paymentIntent.currency,
    status: paymentIntent.status,
  };
}

module.exports = { createPaymentIntent };
