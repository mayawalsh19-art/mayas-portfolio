// Plot's built-in demo bank: works with no Plaid account. It makes a year of realistic
// (fake) transactions, then runs the same subscription detector the Plaid route uses.
import { route } from './_plaid.js';
import { buildCharges } from './_demo.js';
import { detect } from './_detect.js';

const EVERYDAY = [
  ['Starbucks', 6.45], ['Trader Joe’s', 54.20], ['Uber', 18.30], ['Target', 37.99], ['Chipotle', 13.85],
  ['Shell Oil', 41.10], ['Amazon.com', 24.99], ['Sweetgreen', 15.75], ['CVS Pharmacy', 9.48], ['Lyft', 12.60],
];

export default route(async () => {
  const today = new Date();
  const txns = buildCharges(today).map(c => ({ name: c.description, original_description: c.description, merchant_name: null, amount: c.amount, date: c.date_posted, pending: false }));
  // Everyday spending, so the detector has to tell subscriptions apart from normal purchases.
  for (let d = 1; d <= 360; d += 3) {
    const [name, base] = EVERYDAY[(d * 7) % EVERYDAY.length];
    const day = new Date(today); day.setUTCDate(day.getUTCDate() - d);
    txns.push({ name, merchant_name: name, amount: Math.round((base * (0.7 + ((d * 13) % 7) / 10)) * 100) / 100, date: day.toISOString().slice(0, 10), pending: false });
  }
  await new Promise(ok => setTimeout(ok, 1200)); // feels like a bank, not a lookup table
  return detect(txns);
});
