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

const DAY = 864e5;
const days = (a, b) => Math.round((new Date(b) - new Date(a)) / DAY);
const median = xs => { const s = [...xs].sort((a, b) => a - b); return s[Math.floor(s.length / 2)]; };

function nameFor(t) {
  const text = `${t.merchant_name || ''} ${t.name || ''} ${t.original_description || ''}`;
  for (const [re, parent, addon] of ADDONS) if (re.test(text)) return `${parent}\u0000${addon}`;
  for (const [re, name] of KNOWN) if (re.test(text)) return name;
  return (t.merchant_name || t.name || '').trim();
}

export function detect(txns) {
  const today = new Date().toISOString().slice(0, 10);
  const groups = new Map(); const trials = [];
  for (const t of txns) {
    if (t.pending) continue;
    const name = nameFor(t);
    if (!name) continue;
    const desc = `${t.name} ${t.original_description || ''}`;
    if (t.amount === 0 && /trial/i.test(desc)) { trials.push({ name, started: t.date }); continue; }
    if (t.amount <= 0) continue; // money coming in
    if (!groups.has(name)) groups.set(name, []);
    groups.get(name).push({ date: t.date, amount: t.amount });
  }

  const active = [], stopped = [];
  for (const [name, list] of groups) {
    if (list.length < 3) continue;
    list.sort((a, b) => a.date.localeCompare(b.date));
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
  return { ready: true, scanned: txns.length, subscriptions: active, stopped, trials };
}
