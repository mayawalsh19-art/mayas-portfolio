// Demo subscription charges, shared by the Plaid seeding route and the built-in demo bank.
// day = day of the month the service bills; from/to = months ago (0 = this month) it was active.
export const DEMO_CHARGES = [
  { desc: 'NETFLIX.COM 866-579-7172 CA', amount: 15.99, day: 21, from: 11, to: 0 },
  { desc: 'HULU 877-8244858 CA', amount: 7.99, day: 14, from: 11, to: 0 },
  { desc: 'SPOTIFY USA 877-778-1161', amount: 11.99, day: 18, from: 11, to: 0 },
  { desc: 'PELOTON* APP MEMBERSHIP', amount: 12.99, day: 28, from: 8, to: 0 },
  { desc: 'DISNEY PLUS 888-905-7888', amount: 9.99, day: 25, from: 11, to: 0 },
  { desc: 'GOOGLE *YouTubePremium', amount: 13.99, day: 2, from: 11, to: 0 },
  { desc: 'APPLE.COM/BILL ICLOUD STORAGE', amount: 2.99, day: 28, from: 11, to: 0 },
  { desc: 'DUOLINGO INC PITTSBURGH PA', amount: 6.99, day: 4, from: 7, to: 0 },
  { desc: 'GOOGLE *Google One', amount: 1.99, day: 9, from: 11, to: 0 },
  // Charges that stopped: the app offers to add these to the Graveyard.
  { desc: 'PARAMOUNT+ 888-274-5343', amount: 11.99, day: 9, from: 10, to: 3 },
  { desc: 'AUDIBLE*US ADBL.CO/PYMT', amount: 14.95, day: 12, from: 11, to: 4 },
  { desc: 'CALM.COM SAN FRANCISCO', amount: 14.99, day: 10, from: 9, to: 2 },
];

function iso(d) { return d.toISOString().slice(0, 10); }

export function buildCharges(today = new Date()) {
  const out = [];
  for (const c of DEMO_CHARGES) {
    for (let m = c.from; m >= c.to; m--) {
      const d = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth() - m, Math.min(c.day, 28)));
      if (d > today) continue; // Plaid rejects future dates
      out.push({ date_transacted: iso(d), date_posted: iso(d), amount: c.amount, description: c.desc, iso_currency_code: 'USD' });
    }
  }
  // A free trial that started a few days ago.
  const t = new Date(today); t.setUTCDate(t.getUTCDate() - 5);
  out.push({ date_transacted: iso(t), date_posted: iso(t), amount: 0, description: 'PEACOCK TV FREE TRIAL', iso_currency_code: 'USD' });
  return out;
}

