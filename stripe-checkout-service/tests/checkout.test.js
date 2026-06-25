'use strict';

const { createPaymentIntent } = require('../src/checkout-service');

describe('Checkout Service — baseline', () => {

  it('returns a PaymentIntent with a client secret', async () => {
    const result = await createPaymentIntent({
      amount: 999,
      currency: 'usd',
      priceId: 'price_test_monthly',
      quantity: 1,
    });
    expect(result.id).toBeTruthy();
    expect(result.clientSecret).toBeTruthy();
  });

  it('returns the correct currency', async () => {
    const result = await createPaymentIntent({
      amount: 999,
      currency: 'usd',
      priceId: 'price_test_monthly',
      quantity: 1,
    });
    expect(result.currency).toBe('usd');
  });

  it('returns a status of requires_payment_method', async () => {
    const result = await createPaymentIntent({
      amount: 999,
      currency: 'usd',
      priceId: 'price_test_monthly',
      quantity: 1,
    });
    expect(result.status).toBe('requires_payment_method');
  });

  it('calculates the correct total for multiple units', async () => {
    const result = await createPaymentIntent({
      amount: 999,
      currency: 'usd',
      priceId: 'price_test_monthly',
      quantity: 3,
    });
    // amount * quantity = 999 * 3 = 2997
    expect(result.amount).toBe(2997);
  });

});
