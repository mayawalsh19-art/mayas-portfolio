// Creates a Plaid Link token so the app can open Plaid's real "connect your bank" screen (Sandbox only).
import crypto from 'node:crypto';
import { plaid, route } from './_plaid.js';

export default route(async () => {
  const data = await plaid('/link/token/create', {
    client_name: 'Subscription Graveyard',
    user: { client_user_id: 'demo-' + crypto.randomUUID() },
    products: ['transactions'],
    transactions: { days_requested: 365 },
    country_codes: ['US'],
    language: 'en',
  });
  return { link_token: data.link_token, expiration: data.expiration };
});
