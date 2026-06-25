# Prompt — AI-Generated Checkout Service

Build a Node.js microservice called `stripe-checkout-service` that integrates
with the Stripe API to support a SaaS product catalog and checkout flow.

Requirements:
- Use the official Stripe Node.js SDK (v16+)
- Implement a products service: list active products, list prices by product ID
- Implement a checkout service: create a PaymentIntent given amount, currency,
  price ID, and quantity
- The Stripe SDK base URL must be overridable via environment variables
  (STRIPE_API_HOST, STRIPE_API_PROTOCOL, STRIPE_API_PORT) so the service can
  be redirected to a mock in test environments without code changes
- Include a minimal Express HTTP server exposing the services as REST endpoints
- Write a Jest test suite with baseline tests and data-driven scenario tests
  (scenario tests are expected to fail until the mock is enhanced)
- Use CommonJS modules. Target Node 18+.
