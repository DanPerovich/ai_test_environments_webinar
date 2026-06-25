'use strict';

const { listProducts, getPricesForProduct } = require('../src/products-service');
const { stripe } = require('../src/stripe-client');

// ------------------------------------------------------------
// Baseline tests — expected to pass after recording (Segment 2)
// ------------------------------------------------------------

describe('Products Service — baseline', () => {

  describe('listProducts()', () => {

    it('returns a Stripe list object', async () => {
      const result = await listProducts();
      expect(result.object).toBe('list');
      expect(Array.isArray(result.data)).toBe(true);
    });

    it('returns at least one active product', async () => {
      const result = await listProducts();
      expect(result.data.length).toBeGreaterThan(0);
      result.data.forEach(product => {
        expect(product.object).toBe('product');
        expect(product.active).toBe(true);
      });
    });

    it('each product has an id and name', async () => {
      const result = await listProducts();
      result.data.forEach(product => {
        expect(product.id).toBeTruthy();
        expect(product.name).toBeTruthy();
      });
    });

  });

  describe('getPricesForProduct()', () => {

    it('returns a Stripe list object', async () => {
      // Uses the first product ID returned from the catalog
      const products = await listProducts();
      const firstProductId = products.data[0].id;
      const result = await getPricesForProduct(firstProductId);
      expect(result.object).toBe('list');
      expect(Array.isArray(result.data)).toBe(true);
    });

    it('each price has a unit_amount and currency', async () => {
      const products = await listProducts();
      const firstProductId = products.data[0].id;
      const result = await getPricesForProduct(firstProductId);
      result.data.forEach(price => {
        expect(price.object).toBe('price');
        expect(typeof price.unit_amount).toBe('number');
        expect(price.unit_amount).toBeGreaterThan(0);
        expect(price.currency).toBeTruthy();
      });
    });

    it('prices are linked to the correct product', async () => {
      const products = await listProducts();
      const firstProductId = products.data[0].id;
      const result = await getPricesForProduct(firstProductId);
      result.data.forEach(price => {
        expect(price.product).toBe(firstProductId);
      });
    });

  });

});

// ------------------------------------------------------------
// Scenario test — expected to FAIL before Segment 4 enhancement.
// After enhancement the `List all products` stub serves responses
// from a CSV data source, returning multiple products.
// ------------------------------------------------------------

describe('Products Service — data-driven scenarios (requires enhancement)', () => {

  it('returns multiple products for the full-catalog scenario', async () => {
    const result = await stripe.products.list(
      { active: true },
      { headers: { 'X-Test-Scenario': 'full-catalog' } }
    );
    expect(result.data.length).toBeGreaterThan(1);
  });

});
