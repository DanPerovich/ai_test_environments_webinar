'use strict';

const path = require('path');
const dotenv = require('dotenv');

const envFile = process.env.DOTENV_FILE || '.env.mock2';
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

// Stripe SDK v16 dropped 'headers' from per-request RequestOptions, making
// { headers: { 'X-Test-Scenario': '...' } } throw "Unknown arguments".
// This patch restores custom-header passthrough so scenario tests can route
// by header without modifying the test files or the application code.
// Load utils via absolute path — stripe's exports map doesn't expose this subpath
const stripeUtils = require(path.join(path.dirname(require.resolve('stripe')), 'utils.js'));
const _origGetOptionsFromArgs = stripeUtils.getOptionsFromArgs;
stripeUtils.getOptionsFromArgs = function patchedGetOptionsFromArgs(args) {
  const last = args.length > 0 ? args[args.length - 1] : null;
  if (last && typeof last === 'object' && 'headers' in last && !stripeUtils.isOptionsHash(last)) {
    const custom = args.pop();
    const opts = _origGetOptionsFromArgs(args);
    Object.assign(opts.headers, custom.headers);
    return opts;
  }
  return _origGetOptionsFromArgs(args);
};
