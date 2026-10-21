// Supabase Edge Function: send-nudges
// Runs every hour (pg_cron). Sends an empty "wake up" push to each phone whose weekly note is due;
// the phone's service worker picks the note itself from what the app saved on it.
//
// Secrets (Edge Functions → Secrets): VAPID_PUBLIC, VAPID_PRIVATE_JWK
// The caller must send the cron key in the x-cron-key header; the database checks it.
// Turn OFF "Verify JWT" for this function (the cron key does that job).

const SB_URL = 'https://rscxrxbcwxxqmqogzsop.supabase.co';
// Public "anon" key — the same one the app uses. The cron key is what unlocks push_due.
const SB_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJzY3hyeGJjd3h4cW1xb2d6c29wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIyNzU2MDEsImV4cCI6MjEwNzg1MTYwMX0.TRyJ7J7MC5H-V-KRNNkx314m0eAlh1GX0T37HuyVu8Y';
const SUBJECT = 'https://designsquared2-cell.github.io/your-garden/';

const b64u = (b: Uint8Array) => btoa(String.fromCharCode(...b)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const enc = (o: unknown) => b64u(new TextEncoder().encode(JSON.stringify(o)));

async function rpc(fn: string, args: Record<string, unknown>) {
  const r = await fetch(`${SB_URL}/rest/v1/rpc/${fn}`, {
    method: 'POST',
    headers: { apikey: SB_ANON, Authorization: `Bearer ${SB_ANON}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(args),
  });
  if (!r.ok) throw new Error(`${fn}: ${r.status} ${await r.text()}`);
  return r.status === 204 ? null : r.json();
}

// VAPID: a short-lived ES256 token proving the push comes from us
async function vapidHeader(endpoint: string, key: CryptoKey) {
  const unsigned = enc({ typ: 'JWT', alg: 'ES256' }) + '.' +
    enc({ aud: new URL(endpoint).origin, exp: Math.floor(Date.now() / 1000) + 12 * 3600, sub: SUBJECT });
  const sig = new Uint8Array(await crypto.subtle.sign({ name: 'ECDSA', hash: 'SHA-256' }, key, new TextEncoder().encode(unsigned)));
  return `vapid t=${unsigned}.${b64u(sig)}, k=${Deno.env.get('VAPID_PUBLIC')}`;
}

Deno.serve(async (req) => {
  const cronKey = req.headers.get('x-cron-key') ?? '';
  let force = false;
  try { force = !!(await req.json())?.force; } catch { /* no body */ }
  let endpoints: string[];
  try { endpoints = await rpc('push_due', { p_key: cronKey, p_force: force }); }
  catch (e) { return new Response(String(e), { status: 401 }); }

  const key = await crypto.subtle.importKey('jwk', JSON.parse(Deno.env.get('VAPID_PRIVATE_JWK')!),
    { name: 'ECDSA', namedCurve: 'P-256' }, false, ['sign']);
  let sent = 0, gone = 0, failed = 0;
  for (const endpoint of endpoints ?? []) {
    let ok = false, isGone = false;
    try {
      const r = await fetch(endpoint, {
        method: 'POST',
        headers: { TTL: '86400', Urgency: 'normal', Authorization: await vapidHeader(endpoint, key), 'Content-Length': '0' },
        body: '',
      });
      ok = r.ok; isGone = r.status === 404 || r.status === 410;
      if (!ok && !isGone) console.log('push failed', r.status, await r.text());
    } catch (e) { console.log('push error', String(e)); }
    ok ? sent++ : isGone ? gone++ : failed++;
    await rpc('push_result', { p_key: cronKey, p_endpoint: endpoint, p_ok: ok, p_gone: isGone }).catch(() => {});
  }
  return Response.json({ due: endpoints?.length ?? 0, sent, gone, failed });
});
