# Demo Runbook — AI Test Environments Webinar

**Total duration:** 12–15 minutes  
**Dan runs all commands. Tom narrates from the slides.**

Open in Cursor before starting: `src/stripe-client.js`, `tests/products.test.js`,
`tests/checkout.test.js`. These are the files shown to the audience.

Keep two terminal panes visible:

- **Terminal A** — test runner
- **Terminal B** — Claude Code (for Segment 4)

---

## Segment 1 — Generate from OpenAPI Spec (Slide 24)

**Narrative:** "The coding agent wrote this service from a single prompt. The
test suite already exists. Now let's give it a test environment — generated
from the Stripe OpenAPI spec in under a minute."

**Step 1: Show the service in Cursor**

Navigate briefly through these three files — 5 seconds each:

- `src/stripe-client.js` — point out the three env vars
- `src/products-service.js` — two functions, wraps the SDK
- `tests/products.test.js` — tests already exist

**Step 2: Generate stubs in WireMock Cloud UI**

Switch to the WireMock Cloud browser tab (Mock API 1 — `stripe-api-openapi`).
Import the Stripe OpenAPI spec (`stripe-openapi.json`).
WMC generates stubs for all Stripe endpoints instantly.
Show the stub list briefly.

`import @stripe-openapi-slim.json in mockapi id 911q8`

**Step 3: Run tests against Mock API 1**

```bash
npm run test:mock1
```

Expected result: some tests pass, some fail. The checkout tests that rely on
response body echoing (amount, status) are the most likely to fail.

**What to say:** "Spec-based generation is fast — we got a mock in seconds.
But the spec describes the shape of the API, not its behavior. The SDK expects
certain values and patterns that only real traffic can teach the mock. Let's
fix that."

---

## Segment 2 — Generate from Recording (Slide 27)

**Narrative:** "Instead of the spec alone, let's anchor the mock to real Stripe
behavior — by recording actual traffic from the sandbox."

**Step 1: Start recording in WireMock Cloud UI**

Switch to Mock API 2 (`stripe-api-main`) in the browser.
Navigate to Record. Click **Start Recording**.
The mock is now a live proxy to `api.stripe.com`.

**Step 2: Run the tests through the proxy**

```bash
npm run test:mock2
```

Traffic flows: Jest → Stripe SDK → WireMock Cloud (proxy) → real Stripe sandbox.
WMC captures each request/response pair as a stub.

**Step 3: Stop recording**

Click **Stop Recording** in WMC UI.
Show the captured stubs list — real Stripe responses, grounded in actual API
behavior.

**Step 4: Run the tests again against the recorded stubs**

```bash
npm run test:mock2
```

Expected result: baseline tests pass.

**What to say:** "Baseline tests green. The recorded stubs reflect real Stripe behavior."

---

## Segment 3 — Validate Against OpenAPI Contract (Slide 25)

**Narrative:** "We have a mock grounded in real behavior. Now let's add a
guardrail that prevents it from drifting out of contract."

**Step 1: Enable OpenAPI validation in WMC UI**

In Mock API 2 settings, navigate to API Governance / OpenAPI.
Upload `stripe-openapi.json`.
Enable response validation.

**Step 2: Re-run the baseline tests**

```bash
npm run test:mock2
```

**What to say:** "Every response from that mock just passed validation against
the official Stripe spec. If a future update to the mock introduces a field
type mismatch or drops a required property, this validation catches it before
it ever causes a production bug. AI generates fast — the spec keeps it honest."

**Step 3 (optional): Force Validation Error**

Edit the `Get /v1/products` responde body so that the first `created` attribute
value is a string instead of a int/long and save the stub.

**Step 4 (optional): Re-run the baseline tests**

```bash
npm run test:mock2
```

**What to say:** "WireMock Clouds VALIDATION feature in HARD mode causes our
tests to fail due to a response-side contract validation error.

**Step 5 (optional): Fix the broken stub**

Edit the `Get /v1/products` responde body so that the first `created` attribute
value by removing the quotes and save the stub.

---

## Segment 4 — Enhance via Claude Code + WMC Skills (Slide 26)

**Narrative:** "Now let's go further. Our scenario test is failing because the
mock returns a static recorded response. We want the mock to serve responses
from a real data source. A WireMock skill can do this."

**Step 1: Invoke the skill in Claude Code (Terminal B)**

Open Claude Code. Invoke:  
`enhance the Get v1 products stubs in mockapi id gdd07 to use a data source based on @stripe-checkout-service/demo/products.csv`

The skill will:

- Create a CSV data source from `demo/products.csv` in Mock API 2
- Enhance the `GET /v1/products` stub to serve responses templated from
the CSV rows

**Step 2: Run the full test suite**

```bash
npm run test:mock2
```

Expected result: `getPricesForProduct()` tests fail.

**What to say:** "One skill invocation. A CSV data source was wired into the
mock, and now it serves responses from real data — deterministically, without
touching production Stripe. But there is still something wrong with the
responses the mock API is sending back."

**Step 3: Ask AI to help triage and fix the mock API**

In Claude Code, invoke:  
`all getPricesForProduct() tests are failing now`

Expected result: AI fixes dynamic response templating and matching criteria.

**What to say:** "Triaging mock APIs is easy and quick with the help of AI."

**Step 4: Run the full test suite**

```bash
npm run test:mock2
```

Expected result: all tests green, including the `full-catalog` scenario test
that was failing since Segment 2.

**What to say:** "AI works with WireMock Cloud to triage and fix mock APIs
that aren't working the way we'd expect them to."