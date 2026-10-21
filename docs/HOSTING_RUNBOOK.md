# Hosting runbook — djlethalskillz.com

How the site is hosted, which settings must not change, and how to check the booking form and newsletter after any change. Written 2026-10-21 from public DNS lookups, `wrangler.toml`, `workers/*.js` and the owner's account notes. Lock records and owner approvals win over this file.

## 1. The moving parts

| Part | Where it lives | What it does |
|---|---|---|
| Static site | GitHub Pages, repo `djlethalskillz/SkillzHQ`, built by `.github/workflows/deploy.yml` | Every push to `main` or `master` rebuilds and deploys `out/` |
| DNS + edge | Cloudflare zone `djlethalskillz.com` (nameservers `olga.ns.cloudflare.com`, `sid.ns.cloudflare.com`) | Proxies the apex so the Worker can run; handles Email Routing |
| Form Worker | Cloudflare Worker `skillzhq-enquiry` (`wrangler.toml`, `workers/enquiry.js`, `workers/frequency.js`) | `/api/enquiry` → Resend → owner inbox (the booking form on `/book` and on the HQ at `/#book`); `/api/frequency` → Kit (double opt-in, the newsletter in the footer of every page) |
| Outbound mail | Resend (sends through Amazon SES, subdomain `send.djlethalskillz.com`) | Delivers booking enquiries |
| Newsletter | Kit (ConvertKit) | Stores subscribers, sends the confirmation email |
| Inbound mail | Cloudflare Email Routing | Receives mail for `@djlethalskillz.com` addresses |

## 2. DNS layout

Public records as resolved on 2026-10-21 (Cloudflare DNS-over-HTTPS). The Proxy column is what the record must be set to in the Cloudflare dashboard.

| Name | Type | Points to (public answer) | Proxy | Why |
|---|---|---|---|---|
| `djlethalskillz.com` | A / AAAA | Origin: GitHub Pages (`185.199.108.153`–`185.199.111.153`). Public answer is Cloudflare (`172.67.193.141`, `104.21.49.211`, `2606:4700:…`) because it is proxied | **Proxied — must stay proxied** | The Worker routes only run on proxied traffic (section 3) |
| `www` | CNAME | `djlethalskillz.github.io` | DNS-only today; **proxy it as part of D-02** (section 6) | GitHub answers `301` to the apex |
| `djlethalskillz.com` | MX | `route1/2/3.mx.cloudflare.net` | n/a (MX is never proxied) | Cloudflare Email Routing |
| `djlethalskillz.com` | TXT | `v=spf1 include:_spf.mx.cloudflare.net ~all`; `google-site-verification=…` | n/a | Email Routing SPF; Search Console ownership |
| `send` | MX | `feedback-smtp.ap-northeast-1.amazonses.com` | n/a | Resend bounce handling |
| `send` | TXT | `v=spf1 include:amazonses.com ~all` | n/a | Resend SPF |
| `resend._domainkey` | TXT | DKIM public key | n/a | Resend DKIM |
| `ckespa` | CNAME | `spf.dm-7b0b64af.sg7.convertkit.com` | **DNS-only — must stay DNS-only** | Kit sender authentication; a proxied CNAME returns Cloudflare IPs and Kit's check fails |
| `cka._domainkey` | CNAME | `dkim.dm-951b52e1.sg7.convertkit.com` | **DNS-only — must stay DNS-only** | Kit DKIM; same reason |
| `_dmarc` | TXT | `v=DMARC1; p=none;` | n/a | DMARC (monitor only) |

Rules:
- Never set the apex to DNS-only. If it happens, both forms fail at once (finding D-01, 2026-10-21).
- Never proxy the ConvertKit CNAMEs (`ckespa`, `cka._domainkey`) or any `_domainkey` record.
- Records other than those listed may exist in the dashboard; public DNS cannot list a whole zone.

## 3. Why the apex must stay proxied

`/api/enquiry` and `/api/frequency` are not files on GitHub Pages. They are **Cloudflare Worker routes**: Cloudflare intercepts the request at its edge and runs `skillzhq-enquiry` before the request would reach GitHub. Worker routes only fire for hostnames whose traffic passes through Cloudflare, so the apex must be proxied (orange cloud).

If the apex is DNS-only, browsers talk straight to GitHub Pages, which has no `/api/*`: `GET` returns `404` and `POST`/`OPTIONS` return `405` from `Server: GitHub.com`. The form shows "Something went wrong — please try again, or email bookings@djlethalskillz.com." to every visitor. The address in that message is the only way an enquiry still gets through.

The trade-off: GitHub Pages renews its certificate only when the apex points straight at GitHub. Section 6 explains how to live with that.

## 4. Worker routes

From `wrangler.toml` (zone `djlethalskillz.com`):

| Route pattern | Handler |
|---|---|
| `djlethalskillz.com/api/enquiry` | `workers/enquiry.js` (booking form) |
| `djlethalskillz.com/api/frequency` | `workers/frequency.js` via `handleFrequency` (newsletter) |

The patterns are exact paths with no wildcard. `www.djlethalskillz.com/api/*` is not routed, so the site must always post to the apex (it does: `site.enquiryEndpoint` / `site.frequencyEndpoint` are same-origin paths).

## 5. Worker secrets and variables (names only; values never go in the repo)

| Name | Kind | Used by | Where it is set |
|---|---|---|---|
| `RESEND_API_KEY` | Secret | enquiry | Cloudflare dashboard → Workers & Pages → `skillzhq-enquiry` → Settings → Variables and Secrets |
| `ENQUIRY_DESTINATION` | Secret | enquiry | Same place. It was missing until 2026-10-21 (finding D-01b), so the form answered `501` |
| `KIT_API_KEY` | Secret | frequency | Same place |
| `RESEND_FROM` | Variable (plain text) | enquiry | `wrangler.toml` `[vars]`, also shown in the dashboard |
| `KIT_FORM_ID` | Variable (plain text) | frequency | `wrangler.toml` `[vars]`, also shown in the dashboard |

Notes:
- `wrangler deploy` uploads `[vars]` from `wrangler.toml` and replaces plain-text variables set in the dashboard. It does not touch secrets. Change variables in `wrangler.toml`, not only in the dashboard.
- Workers Logs are on (invocation logs, sampling 1, persisted; traces off). `wrangler.toml` `[observability]` mirrors this so a deploy keeps it.
- The Worker deploys separately from the site. A push to GitHub never deploys it; only `wrangler deploy`, run by the owner, does.

## 6. Certificate expiry and the D-02 plan

- GitHub Pages' certificate for the apex and `www` was issued during a DNS-only window on 2026-10-21 and **expires 2027-01-19**. While the apex is proxied, GitHub cannot renew it (its check sees Cloudflare, not GitHub: `bad_authz`).
- Visitors are not affected directly: they see Cloudflare's edge certificate. What breaks is the hop from Cloudflare to GitHub once GitHub's certificate expires, if Cloudflare is strict about it.
- **Plan (D-02), to finish before about December 2026:**
  1. Cloudflare → SSL/TLS → Overview → encryption mode **Full** (not "Full (strict)"). Full encrypts the hop to GitHub but accepts an expired or mismatched origin certificate, so the site keeps working after 2027-01-19.
  2. Set `www` to **Proxied**, so visitors to `www` also get Cloudflare's certificate instead of GitHub's expiring one.
  3. Run the checks in section 7, plus `curl -sI https://www.djlethalskillz.com/` → `301` to the apex.
- Expected side effect: GitHub Pages settings will show a certificate warning after the expiry. The site keeps working.
- The step-by-step clicks, risks and rollback are in the D-02 decision record. The alternative, moving the Worker to its own hostname such as `api.djlethalskillz.com`, needs a lock amendment.

## 7. Post-release check (sends no mail)

Run after every site release, Worker deploy, DNS change or Cloudflare setting change. An empty JSON body fails validation before the Worker contacts Resend or Kit, so no email is sent and nobody is subscribed. The Worker checks its secrets **before** validating, so a `400` also proves the secrets are present.

```
curl -s -i -X OPTIONS https://djlethalskillz.com/api/enquiry
curl -s -i -X OPTIONS https://djlethalskillz.com/api/frequency
curl -s -i -X POST -H "Content-Type: application/json" -d "{}" https://djlethalskillz.com/api/enquiry
curl -s -i -X POST -H "Content-Type: application/json" -d "{}" https://djlethalskillz.com/api/frequency
curl -sI https://djlethalskillz.com/
```

| Check | Expected |
|---|---|
| `OPTIONS /api/enquiry` | `204`, `Server: cloudflare` |
| `OPTIONS /api/frequency` | `204`, `Server: cloudflare` |
| `POST {}` `/api/enquiry` | `400` body `{"error":"invalid-category"}` |
| `POST {}` `/api/frequency` | `400` body `{"error":"invalid-email"}` |
| `HEAD /` | `200`, `Server: cloudflare` |

The **Form monitor** workflow (`.github/workflows/form-monitor.yml`) runs exactly these checks once a day and on demand (section 9).

To prove real delivery, send one genuine enquiry from `https://djlethalskillz.com/book` and confirm it arrives. Only the owner should do this.

Also check after a site release: `https://djlethalskillz.com/book`, one film page (for example `/life-archive/01`) and `https://djlethalskillz.com/sitemap.xml` all return `200`. These are static files on GitHub Pages; a missing one means the release did not include the new routes.

## 8. Troubleshooting

| Status (on `/api/*`) | Server / body | Meaning | Fix |
|---|---|---|---|
| `404` | `Server: GitHub.com`, HTML | GitHub Pages answered, so the Worker never ran. Usually the apex is DNS-only | Cloudflare → DNS → set the apex A/AAAA records to **Proxied** |
| `405` | `Server: GitHub.com`, HTML (on `POST`/`OPTIONS`) | Same cause as `404`: GitHub Pages rejects the method | Same fix as `404` |
| `405` | `Server: cloudflare`, `{"error":"method-not-allowed"}` (on `GET`) | Normal. The Worker accepts only `POST` and `OPTIONS` | Nothing to fix; use `POST` |
| `501` | `{"error":"unconfigured"}` | The Worker runs but a secret or variable is missing. Enquiry needs `RESEND_API_KEY` and `ENQUIRY_DESTINATION`; newsletter needs `KIT_API_KEY` and `KIT_FORM_ID`. The response never says which | Dashboard → `skillzhq-enquiry` → Variables and Secrets: add the missing name. Saving it in the dashboard applies it without `wrangler deploy` (this is how D-01b was fixed) |
| `502` | `{"error":"delivery-failed"}` | The Worker reached Resend or Kit and was refused, or the call failed: revoked or expired API key, sending domain no longer verified in Resend, wrong Kit form ID | Workers Logs show `resend rejected <status>` or `kit … failed <status>`. Fix the key or domain in Resend/Kit, then update the secret |
| `502`/`520`–`526` | Cloudflare HTML error page (pages, not `/api/*`) | Cloudflare cannot reach GitHub or rejects its certificate. `526` = mode is "Full (strict)" and GitHub's certificate is expired or invalid | Set SSL/TLS mode to **Full** (section 6) |
| `403` | Cloudflare challenge page | A WAF, Bot Fight Mode or rate-limit rule blocked the request. This is the likely cause if only the Form monitor fails (GitHub runner IPs) while a browser works | Check Security → Events; add a skip rule for the probe paths if needed |
| `400` | `invalid-category` / `invalid-email` on an empty body | Normal. This is the healthy answer to the probes | — |

## 9. Form monitor (GitHub Actions)

- `.github/workflows/form-monitor.yml` runs daily at 02:17 UTC and can be started by hand: GitHub → Actions → **Form monitor** → **Run workflow**. It needs no secrets.
- The job fails if any check in section 7 does not match exactly. The run log shows the expected and actual status and body for each check.
- **Who gets the email:** GitHub emails a failed scheduled run to the person who created the workflow, or to whoever last changed its `cron` line. That person needs Actions email notifications on (GitHub → Settings → Notifications → System → Actions).
- **Scheduled runs only start from the default branch.** The monitor starts working once this file is on the default branch.
- **60-day pause:** this repository is public, and GitHub automatically disables scheduled workflows in a public repository after 60 days with no repository activity. To re-enable: GitHub → Actions → **Form monitor** (left sidebar) → **Enable workflow**, or `gh workflow enable form-monitor.yml`. Any push also counts as activity.
- A failing monitor does not take anything down. It only reports.
