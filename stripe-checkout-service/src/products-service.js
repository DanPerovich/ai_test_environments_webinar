'use strict';

const { stripe } = require('./stripe-client');

async function listProducts(options = {}) {
  return stripe.products.list({
    active: true,
    limit: options.limit || 10,
    ...options,
  });
}

async function getPricesForProduct(productId) {
  return stripe.prices.list({
    product: productId,
    active: true,
  });
}

module.exports = { listProducts, getPricesForProduct };
