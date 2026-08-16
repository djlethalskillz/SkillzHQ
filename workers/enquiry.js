/**
 * SkillzHQ enquiry delivery worker.
 *
 * POST /api/enquiry  ->  Resend  ->  ENQUIRY_DESTINATION
 *
 * The destination email address and the Resend API key live ONLY in this
 * worker's environment (secrets) — never in the client bundle or UI. The
 * frontend knows nothing but the same-origin endpoint path.
 *
 * Secrets (set via `wrangler secret put`, never committed):
 *   RESEND_API_KEY         — Resend API key
 *   ENQUIRY_DESTINATION    — the email that receives enquiries
 *
 * Non-secret var (wrangler.toml [vars]):
 *   RESEND_FROM            — verified sender, e.g. "SkillzHQ <enquiries@djlethalskillz.com>"
 */

const BRIEFS = [
  "Performance",
  "Workshop / Masterclass",
  "Speaking",
  "Creative Collaboration",
  "Commission",
  "Media / Press",
  "Other",
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function json(data, status) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...CORS },
  });
}

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });
    if (request.method !== "POST") return json({ error: "method-not-allowed" }, 405);

    const { RESEND_API_KEY, ENQUIRY_DESTINATION, RESEND_FROM } = env;
    if (!RESEND_API_KEY || !ENQUIRY_DESTINATION) {
      // Unconfigured deployment — never leak what is missing.
      return json({ error: "unconfigured" }, 501);
    }

    let payload;
    try {
      payload = await request.json();
    } catch {
      return json({ error: "bad-request" }, 400);
    }

    const name = typeof payload?.name === "string" ? payload.name.trim() : "";
    const email = typeof payload?.email === "string" ? payload.email.trim() : "";
    const organization =
      typeof payload?.organization === "string" ? payload.organization.trim() : "";
    const details = typeof payload?.details === "string" ? payload.details.trim() : "";
    const category = typeof payload?.category === "string" ? payload.category : "";

    if (!BRIEFS.includes(category)) return json({ error: "invalid-category" }, 400);
    if (!name || name.length > 200) return json({ error: "invalid-name" }, 400);
    if (!EMAIL_RE.test(email) || email.length > 200) return json({ error: "invalid-email" }, 400);
    if (organization.length > 500) return json({ error: "invalid-organization" }, 400);
    if (!details || details.length > 5000) return json({ error: "invalid-details" }, 400);

    const subject = `Let's Collaborate · ${category}`;
    const text = [
      `Category: ${category}`,
      `Name: ${name}`,
      `Email: ${email}`,
      `Organization: ${organization || "—"}`,
      "",
      details,
    ].join("\n");

    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: RESEND_FROM || "SkillzHQ <enquiries@djlethalskillz.com>",
          to: [ENQUIRY_DESTINATION],
          reply_to: [email],
          subject,
          text,
        }),
      });
      if (!res.ok) {
        console.error("resend rejected", res.status, (await res.text().catch(() => "")));
        return json({ error: "delivery-failed" }, 502);
      }
      return json({ ok: true }, 200);
    } catch (err) {
      console.error("resend fetch failed", err);
      return json({ error: "delivery-failed" }, 502);
    }
  },
};
