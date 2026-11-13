// Finishes the Plaid Link connection and loads the demo bank with realistic subscription charges.
//
// Plaid's Sandbox test users come with generic transactions (coffee, flights, payroll).
// To make the demo about subscriptions, this route adds a believable year of monthly
// charges to the *test* account using /sandbox/transactions/create. Nothing here touches
// a real bank.
import { plaid, route, seal, HttpError } from './_plaid.js';
import { buildCharges } from './_demo.js';

export default route(async ({ public_token, institution, account_mask }) => {
  if (!public_token) throw new HttpError(400, 'Missing public_token from Plaid Link.');
  const { access_token } = await plaid('/item/public_token/exchange', { public_token });

  const charges = buildCharges();
  let added = 0;
  for (let i = 0; i < charges.length; i += 10) {
    const batch = charges.slice(i, i + 10);
    try {
      await plaid('/sandbox/transactions/create', { access_token, transactions: batch });
      added += batch.length;
    } catch (e) {
      // A $0.00 trial line is the only charge Plaid might refuse. Retry the batch without it.
      const withoutZero = batch.filter(t => t.amount !== 0);
      if (withoutZero.length === batch.length) throw e;
      await plaid('/sandbox/transactions/create', { access_token, transactions: withoutZero });
      added += withoutZero.length;
    }
  }
  return { token: seal(access_token), institution: institution || 'Demo bank', account_mask: account_mask || null, seeded: added };
});
