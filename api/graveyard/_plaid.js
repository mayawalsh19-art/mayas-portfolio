// Shared helpers for the Plaid API routes.
//
// SAFETY: this app is a demo. It is hard-wired to Plaid's Sandbox, which only
// ever returns test data. Even if production keys were configured by mistake,
// requests could not reach a real bank, because the base URL below is fixed.
import crypto from 'node:crypto';

const PLAID_BASE = 'https://sandbox.plaid.com';

export function env(name) {
  const v = process.env[name];
  if (!v) throw new HttpError(500, `Server is missing ${name}. Add it to .env.local (local) or the Vercel project settings.`);
  return v;
}

export class HttpError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}

export async function plaid(path, body) {
  const res = await fetch(PLAID_BASE + path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'PLAID-CLIENT-ID': env('PLAID_CLIENT_ID'),
      'PLAID-SECRET': env('PLAID_SECRET'),
    },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new HttpError(res.status >= 500 ? 502 : 400, data.error_message || `Plaid request failed (${path})`);
    err.code = data.error_code;
    throw err;
  }
  return data;
}

// The Plaid access token never goes to the browser in plain text. The browser
// only holds a sealed copy that this server can open with TOKEN_KEY.
function key() {
  const raw = Buffer.from(env('TOKEN_KEY'), 'base64');
  if (raw.length !== 32) throw new HttpError(500, 'TOKEN_KEY must be 32 random bytes, base64-encoded.');
  return raw;
}
export function seal(text) {
  const iv = crypto.randomBytes(12);
  const c = crypto.createCipheriv('aes-256-gcm', key(), iv);
  const enc = Buffer.concat([c.update(text, 'utf8'), c.final()]);
  return Buffer.concat([iv, c.getAuthTag(), enc]).toString('base64url');
}
export function unseal(token) {
  const k = key();
  try {
    const buf = Buffer.from(String(token), 'base64url');
    const d = crypto.createDecipheriv('aes-256-gcm', k, buf.subarray(0, 12));
    d.setAuthTag(buf.subarray(12, 28));
    return Buffer.concat([d.update(buf.subarray(28)), d.final()]).toString('utf8');
  } catch {
    throw new HttpError(401, 'This bank connection is no longer valid. Connect the demo bank again.');
  }
}

export function route(handler) {
  return async (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    if (req.method !== 'POST') return res.status(405).json({ error: 'Use POST.' });
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
      res.status(200).json(await handler(body));
    } catch (e) {
      res.status(e.status || 500).json({ error: e.message || 'Something went wrong.', code: e.code });
    }
  };
}
