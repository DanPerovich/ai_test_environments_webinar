# stripe-checkout-service

A Node.js checkout microservice backed by Stripe, built to demonstrate
AI-accelerated test environment setup with WireMock Cloud.

## Quick Start

```bash
npm install
npm run test:mock2   # runs against WireMock Cloud mock (default)
npm run test:mock1   # runs against OpenAPI-generated mock
npm run test:live    # runs against real Stripe sandbox
```

## How the Mock Redirect Works

`src/stripe-client.js` reads three environment variables at startup:

| Variable | Purpose | Example |
|---|---|---|
| `STRIPE_API_HOST` | Override Stripe API hostname | `abc123.wiremock.cloud` |
| `STRIPE_API_PROTOCOL` | Protocol | `https` |
| `STRIPE_API_PORT` | Port | `443` |

When all three are unset the SDK targets `api.stripe.com` directly.
Only `src/stripe-client.js` changes between mock and live modes — all other
application code is unmodified.

## Mock APIs

| Env file | Mock API | Purpose |
|---|---|---|
| `.env.mock1` | `stripe-api-openapi` | Generated from Stripe OpenAPI spec |
| `.env.mock2` | `stripe-api-main` | Recording, validation, enhancement |
| `.env.live` | — | Real Stripe test sandbox |

## Pushing Enhanced Stubs

After running WMC skills in Claude Code:

```bash
wiremock push --mock-api-id {mock2-id}
```

## Project Structure

```
src/
  stripe-client.js      SDK instantiation with configurable host
  products-service.js   listProducts(), getPricesForProduct()
  checkout-service.js   createPaymentIntent()
  server.js             Express HTTP server
tests/
  products.test.js      product catalog tests (baseline + scenario)
  checkout.test.js      payment intent tests
demo/
  DEMO-RUNBOOK.md       step-by-step presenter guide
  codegen-prompt.md     the prompt that generated this service
```
