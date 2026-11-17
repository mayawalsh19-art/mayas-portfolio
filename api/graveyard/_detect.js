// Plot's detector: group charges by service, then keep the ones that repeat on a steady
// schedule for about the same amount. Streams that stopped are returned separately.
const KNOWN = [
  [/netflix/i, 'Netflix'], [/hulu/i, 'Hulu'], [/spotify/i, 'Spotify'], [/peloton/i, 'Peloton App'],
  [/disney/i, 'Disney+'], [/youtube ?tv/i, 'YouTube TV'], [/youtube/i, 'YouTube Premium'], [/icloud/i, 'iCloud+'], [/duolingo/i, 'Duolingo'],
  [/google \*?google one|google one/i, 'Google One'], [/paramount/i, 'Paramount+'], [/audible/i, 'Audible'],
  [/calm\.com/i, 'Calm'], [/crunchyroll/i, 'Crunchyroll'], [/peacock/i, 'Peacock'], [/\bmax\.com|hbo ?max/i, 'Max'],
  [/headspace/i, 'Headspace'], [/apple tv/i, 'Apple TV+'], [/amazon prime|prime video/i, 'Amazon Prime'],
];

// Add-ons billed *through* another subscription, e.g. a Starz channel bought inside Amazon Prime.
// Each entry: [pattern, parent subscription, add-on name]. Checked before KNOWN so the
// channel name (Starz, Max, Paramount+…) doesn't get mistaken for its own subscription.
const CH = 'channels?|channel subscriptions?';
const ADDONS = [];
const chan = (prefix, parent) => [
  ['starz', 'Starz'], ['hbo|\\bmax\\b', 'HBO Max'], ['paramount', 'Paramount+ Premium'], ['amc', 'AMC+'], ['mgm', 'MGM+'],
  ['britbox', 'BritBox'], ['acorn', 'Acorn TV'], ['shudder', 'Shudder'], ['cinemax', 'Cinemax'], ['discovery', 'discovery+'],
  ['hallmark', 'Hallmark+'], ['masterpiece|pbs', 'PBS Masterpiece'], ['crunchyroll', 'Crunchyroll'], ['apple ?tv', 'Apple TV'],
  ['peacock', 'Peacock Premium Plus'],
].forEach(([word, name]) => ADDONS.push([new RegExp(`${prefix}.*\\b(${word})`, 'i'), parent, name]));
// Channels billed separately through a parent subscription.
chan(`(amazon|amzn|prime video) (${CH})\\b`, 'Amazon Prime');
chan(`apple tv (${CH})\\b`, 'Apple TV+');
chan(`youtube (primetime )?(${CH})\\b`, 'YouTube Premium');
chan(`youtube ?tv\\b`, 'YouTube TV');
ADDONS.push(
  [new RegExp(`(amazon|amzn|prime video) (${CH})`, 'i'), 'Amazon Prime', 'Prime Video Channel'],
  [/prime video (ad[- ]?free|ultra)/i, 'Amazon Prime', 'Prime Video Ultra (no ads)'],
  [/youtube ?tv\b.*4k/i, 'YouTube TV', '4K Plus'],
  [/youtube ?tv\b.*sports/i, 'YouTube TV', 'Sports Plus'],
  [/netflix.*extra member/i, 'Netflix', 'Extra member (no ads)'],
  [/spotify.*audiobooks/i, 'Spotify', 'Audiobooks+'],
);

// Free-trial length (days) and the usual monthly price after it, for guessing when a trial
// turns into a charge. Unknown services fall back to 7 days.
const TRIAL_DAYS = {
  'Amazon Prime': 30, 'Hulu': 30, 'Spotify': 30, 'YouTube Premium': 30, 'Audible': 30, 'Peloton App': 30,
  'Duolingo': 14, 'Headspace': 14, 'Apple TV+': 7, 'Paramount+': 7, 'Peacock': 7, 'YouTube TV': 7,
  'Calm': 7, 'Crunchyroll': 7, 'iCloud+': 30, 'Google One': 30,
};
const PRICE_AFTER = {
  'Netflix': 17.99, 'Hulu': 11.99, 'Spotify': 11.99, 'Disney+': 11.99, 'YouTube Premium': 13.99, 'YouTube TV': 82.99,
  'iCloud+': 2.99, 'Apple TV+': 12.99, 'Google One': 1.99, 'Paramount+': 8.99, 'Peacock': 7.99, 'Audible': 14.95,
  'Peloton App': 12.99, 'Duolingo': 12.99, 'Calm': 14.99, 'Crunchyroll': 7.99, 'Max': 10.99, 'Headspace': 12.99,
  'Amazon Prime': 14.99,
  // add-ons / channels
  'Starz': 10.99, 'HBO Max': 10.99, 'Paramount+ Premium': 13.99, 'AMC+': 9.99, 'MGM+': 6.99, 'BritBox': 8.99,
  'Acorn TV': 8.99, 'Shudder': 8.99, 'Cinemax': 9.99, 'discovery+': 4.99, 'Hallmark+': 7.99, 'PBS Masterpiece': 5.99,
'Apple TV': 12.99, 'Peacock Premium Plus': 16.99, '4K Plus': 9.99, 'Sports Plus': 10.99,
  'Audiobooks+': 11.99, 'Prime Video Ultra (no ads)': 4.99,
};

const DAY = 864e5;
const days = (a, b) => Math.round((new Date(b) - new Date(a)) / DAY);
const median = xs => { const s = [...xs].sort((a, b) => a - b); return s[Math.floor(s.length / 2)]; };

// Returns [name, recognized]. Add-ons come back as "Parent\u0000Add-on".
function nameFor(t) {
  const text = `${t.merchant_name || ''} ${t.name || ''} ${t.original_description || ''}`;
  for (const [re, parent, addon] of ADDONS) if (re.test(text)) return [`${parent}\u0000${addon}`, true];
  for (const [re, name] of KNOWN) if (re.test(text)) return [name, true];
  return [(t.merchant_name || t.name || '').trim(), false];
}
const addDaysIso = (iso, n) => new Date(new Date(iso).getTime() + n * DAY).toISOString().slice(0, 10);

export function detect(txns) {
  const today = new Date().toISOString().slice(0, 10);
  const groups = new Map(); const trialStarts = new Map(); const recognized = new Set();
  for (const t of txns) {
    if (t.pending) continue;
    const [name, known] = nameFor(t);
    if (!name) continue;
    if (known) recognized.add(name);
    const desc = `${t.name} ${t.original_description || ''}`;
    // A free trial shows up as a $0 charge or a $1-or-less card check from a subscription
    // service, or anything small that says "trial" / "free".
    const small = t.amount >= 0 && t.amount <= 1;
    if (small && (known || /\b(free )?trial\b|\bfree\b/i.test(desc))) {
      if (!trialStarts.has(name) || trialStarts.get(name) < t.date) trialStarts.set(name, t.date);
      continue;
    }
    if (t.amount <= 0) continue; // money coming in
    if (!groups.has(name)) groups.set(name, []);
    groups.get(name).push({ date: t.date, amount: t.amount });
  }

  const active = [], stopped = [];
  for (const [name, list] of groups) {
    list.sort((a, b) => a.date.localeCompare(b.date));
    if (list.length < 3) {
      // Brand-new subscription (or a trial that just turned paid): a known service charged
      // in the last ~5 weeks. Show it now instead of waiting three months.
      const last = list[list.length - 1];
      if (!recognized.has(name) || days(last.date, today) > 35) continue;
      const gap = list.length === 2 ? days(list[0].date, last.date) : 30;
      if (gap > 40) continue;
      active.push({ name, price: last.amount, cadence: 'monthly', first: list[0].date, last: last.date, next: addDaysIso(last.date, gap || 30), charges: list, isNew: true });
      continue;
    }
    const gaps = list.slice(1).map((x, i) => days(list[i].date, x.date));
    const gap = median(gaps);
    const monthly = gap >= 26 && gap <= 35, yearly = gap >= 350 && gap <= 380;
    if (!monthly && !yearly) continue;
    const amounts = list.map(x => x.amount);
    const last = list[list.length - 1];
    if (Math.max(...amounts) - Math.min(...amounts) > last.amount * 0.15) continue; // not a steady price
    const sinceLast = days(last.date, today);
    const next = new Date(new Date(last.date).getTime() + gap * DAY).toISOString().slice(0, 10);
    const item = { name, price: last.amount, cadence: monthly ? 'monthly' : 'yearly', first: list[0].date, last: last.date, next, charges: list };
    (sinceLast > gap * 1.5 ? stopped : active).push(item);
  }
  // Fold add-ons into the subscription they're billed through.
  const isAddon = x => x.name.includes('\u0000');
  const parents = new Map([...active, ...stopped].filter(x => !isAddon(x)).map(x => [x.name, x]));
  for (const list of [active, stopped]) {
    for (let i = list.length - 1; i >= 0; i--) {
      const x = list[i]; if (!isAddon(x)) continue;
      const [parent, addon] = x.name.split('\u0000');
      list.splice(i, 1);
      const p = parents.get(parent);
      const a = { ...x, name: addon };
      if (p) { if (list === active) (p.addons ||= []).push(a); }
      else if (list === active) active.push({ ...a, name: `${addon} (via ${parent})` }); // parent not found: still show it
    }
  }
  active.sort((a, b) => b.price - a.price);

  // Trials still running: no paid charge since the trial began, and not long over.
  const trials = [];
  for (const [key, started] of trialStarts) {
    const paidSince = (groups.get(key) || []).some(c => c.date >= started);
    if (paidSince) continue; // it already turned into a paid subscription
    const [parent, addon] = key.includes('\u0000') ? key.split('\u0000') : [null, key];
    const name = addon;
    const length = parent ? 7 : (TRIAL_DAYS[name] || 7);
    const ends = addDaysIso(started, length);
    if (days(ends, today) > 3) continue; // ended a while ago with no charge: it was cancelled
    trials.push({ name, parent, started, ends, days: length, price: PRICE_AFTER[name] || null });
  }
  return { ready: true, scanned: txns.length, subscriptions: active, stopped, trials };
}
