/**
 * SkillzHQ frequency signup worker handler.
 *
 * POST /api/frequency  ->  Kit API v4  ->  Skillz Frequency audience
 *
 * The Kit API key lives ONLY in this worker's environment (secret) — never
 * in the client bundle or UI. The frontend knows nothing but the same-origin
 * endpoint path. Kit handles subscriber storage, double opt-in confirmation,
 * unsubscribe, delivery and bounce management.
 *
 * Double opt-in is Kit's job: the subscriber is created inactive, then added
 * to the double opt-in form (form setting configured in the Kit dashboard);
 * Kit sends the confirmation email, and the subscriber becomes active on
 * confirm.
 *
 * Secrets (set via `wrangler secret put`, never committed):
 *   KIT_API_KEY   — Kit v4 API key (account settings > Developer, shown once)
 *
 * Non-secret var (wrangler.toml [vars]):
 *   KIT_FORM_ID   — the Skillz Frequency form id (integer)
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const KIT_BASE = "https://api.kit.com/v4";

function json(data, status) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...CORS },
  });
}

export async function handleFrequency(request, env) {
  if (request.method !== "POST") return json({ error: "method-not-allowed" }, 405);

  const { KIT_API_KEY, KIT_FORM_ID } = env;
  if (!KIT_API_KEY || !KIT_FORM_ID) {
    // Unconfigured deployment — never leak what is missing.
    return json({ error: "unconfigured" }, 501);
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return json({ error: "bad-request" }, 400);
  }

  const email = typeof payload?.email === "string" ? payload.email.trim() : "";
  if (!EMAIL_RE.test(email) || email.length > 200) {
    return json({ error: "invalid-email" }, 400);
  }

  const kitHeaders = {
    "X-Kit-Api-Key": KIT_API_KEY,
    "Content-Type": "application/json",
  };

  try {
    // 1. Upsert the subscriber as inactive — the form add below is what
    //    triggers the confirmation email for a double opt-in form.
    const created = await fetch(`${KIT_BASE}/subscribers`, {
      method: "POST",
      headers: kitHeaders,
      body: JSON.stringify({ email_address: email, state: "inactive" }),
    });
    if (!created.ok) {
      console.error("kit create failed", created.status, (await created.text().catch(() => "")));
      return json({ error: "delivery-failed" }, 502);
    }

    // 2. Add to the form — idempotent (200 already-added), never an error
    //    for an existing subscriber; a re-signup stays gracefully handled.
    const added = await fetch(`${KIT_BASE}/forms/${KIT_FORM_ID}/subscribers`, {
      method: "POST",
      headers: kitHeaders,
      body: JSON.stringify({ email_address: email }),
    });
    if (!added.ok) {
      console.error("kit form add failed", added.status, (await added.text().catch(() => "")));
      return json({ error: "delivery-failed" }, 502);
    }

    return json({ ok: true }, 200);
  } catch (err) {
    console.error("kit fetch failed", err);
    return json({ error: "delivery-failed" }, 502);
  }
}
