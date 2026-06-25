'use strict';

const Stripe = require('stripe');

const config = {
  telemetry: false,
};

if (process.env.STRIPE_API_HOST) {
  config.host = process.env.STRIPE_API_HOST;
}

if (process.env.STRIPE_API_PROTOCOL) {
  config.protocol = process.env.STRIPE_API_PROTOCOL;
}

if (process.env.STRIPE_API_PORT) {
  config.port = parseInt(process.env.STRIPE_API_PORT, 10);
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, config);

module.exports = { stripe };
