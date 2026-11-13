// Reads the demo bank's transactions and finds the subscriptions in them.
// Plot's detector: group charges by service, then keep the ones that repeat on a steady
// schedule for about the same amount. Streams that stopped are returned separately so the
// app can offer to add them to the Graveyard.
import { plaid, route, unseal, HttpError } from './_plaid.js';
import { detect } from './_detect.js';

async function allTransactions(access_token) {
  let cursor; const added = [];
  for (let i = 0; i < 20; i++) {
    const page = await plaid('/transactions/sync', { access_token, cursor, count: 500, options: { include_original_description: true } });
    added.push(...page.added);
    cursor = page.next_cursor;
    if (!page.has_more) break;
  }
  return added;
}

export default route(async ({ token }) => {
  if (!token) throw new HttpError(400, 'Missing bank connection.');
  const access_token = unseal(token);

  let txns;
  try { txns = await allTransactions(access_token); }
  catch (e) { if (e.code === 'PRODUCT_NOT_READY') return { ready: false }; throw e; }
  if (!txns.length) return { ready: false };

  return detect(txns);
});
