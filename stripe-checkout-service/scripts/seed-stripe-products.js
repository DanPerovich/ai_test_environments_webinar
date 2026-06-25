'use strict';

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.live') });

const Stripe = require('stripe');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { telemetry: false });

// The three SaaS plans the demo tests expect.
// Prices are monthly recurring in USD (unit_amount is cents).
const DESIRED_PRODUCTS = [
  {
    name: 'Starter',
    description: 'Perfect for individuals and small teams',
    price: { unit_amount: 900, currency: 'usd', recurring: { interval: 'month' } },
  },
  {
    name: 'Pro',
    description: 'For growing teams that need more power',
    price: { unit_amount: 2900, currency: 'usd', recurring: { interval: 'month' } },
  },
  {
    name: 'Enterprise',
    description: 'Advanced features for large organizations',
    price: { unit_amount: 9900, currency: 'usd', recurring: { interval: 'month' } },
  },
];

async function fetchAllActiveProducts() {
  const products = [];
  let page = await stripe.products.list({ active: true, limit: 100 });
  products.push(...page.data);
  while (page.has_more) {
    page = await stripe.products.list({ active: true, limit: 100, starting_after: page.data[page.data.length - 1].id });
    products.push(...page.data);
  }
  return products;
}

async function seed() {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_SECRET_KEY.startsWith('sk_test_')) {
    console.error('ERROR: STRIPE_SECRET_KEY in .env.live must be a valid sk_test_... key.');
    process.exit(1);
  }

  console.log('Fetching existing active products from Stripe sandbox...');
  const existing = await fetchAllActiveProducts();
  const existingNames = new Set(existing.map(p => p.name.toLowerCase()));

  console.log(`Found ${existing.length} existing active product(s): ${existing.map(p => p.name).join(', ') || '(none)'}\n`);

  for (const desired of DESIRED_PRODUCTS) {
    if (existingNames.has(desired.name.toLowerCase())) {
      console.log(`  SKIP  "${desired.name}" — already exists`);
      continue;
    }

    process.stdout.write(`  CREATE "${desired.name}"...`);
    const product = await stripe.products.create({
      name: desired.name,
      description: desired.description,
    });

    await stripe.prices.create({
      product: product.id,
      ...desired.price,
    });

    const amount = (desired.price.unit_amount / 100).toFixed(2);
    console.log(` done (id: ${product.id}, price: $${amount}/month)`);
  }

  console.log('\nDone. Re-run `npm run test:live` to verify baseline products tests pass.');
}

seed().catch(err => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
