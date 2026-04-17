# Skagway Tours — Task Tracker

**This file is the source of truth for unfinished work.** Every Claude session
reads it at startup (see `AGENTS.md`). Edit it directly as tasks open and
close — keep commit messages small so git blame is useful.

## ⏳ In progress / blocked

### Brevo email notifications
_The code is live and dormant on `main`. Add the env vars to activate._

- [ ] Verify Brevo account (blocked — sign-up verification issue)
- [ ] Verify `skagway.tours` as a Brevo sender domain (3 DNS records in
  Cloudflare DNS)
- [ ] Generate Brevo v3 API key
- [ ] Add Cloudflare Pages env vars (both Production and Preview):
  - `BREVO_KEY` — encrypted secret
  - `NOTIFICATION_EMAIL` — inbox for form alerts (currently
    `zac@lostsearchmedia.com` for testing)
  - `BREVO_SENDER` — `forms@skagway.tours`
- [ ] Redeploy and smoke-test contact + newsletter forms

## 📋 Open — design

### Phase 3 polish (Wildmark reference)
- [ ] Polaroid-tilt treatment for a gallery / moments section
- [ ] Footer redesign with icon columns (Small groups / Local guides /
  All Aboard / Trusted)
- [ ] Optional: white-header-with-salmon-promo-bar header variant
- [ ] Consider: move hardcoded "Why us" + feature card copy into the
  CloudCannon home schema so editors can tweak it

### Tour detail pages
- [ ] Upload real tour hero images; set `featured_image` on each tour
  (uploads to `public/images/`)
- [ ] Optional: show `price_child` more prominently in tour cards

## 📋 Open — content & CMS

### Pickup / find-us
- [ ] Wire the dock-specific pickup copy (Broadway, Ore Dock, Railroad
  Aft, Railroad Front) + embedded instructional videos into
  `/find-us/` (currently just a map + pickup form)
- [ ] Move `/find-us/` pickup form off the `REPLACE_ME` Formspree URL
  onto a new `/api/pickup` Pages Function backed by D1 (matches
  `/api/contact` + `/api/newsletter`)

### Shared policies
- [ ] Either expand `/faqs/` to cover accessibility, cancellation,
  All Aboard guarantee, No Passport policy — _or_ create a
  `/tour-policies/` page. Tour detail pages already link to `/faqs/`
  via the "Before your tour" block.

## 📋 Open — SEO & analytics

- [ ] JSON-LD structured data for tours (`schema.org/TouristTrip` or
  `Product`) — high-leverage for rich results in Google
- [ ] Install Google Tag Manager sitewide with an editable `gtm_id`
  field in `cloudcannon.config.yml`
- [ ] Sitemap priority/changefreq tuning per collection
- [ ] Cloudflare Turnstile on forms (only if spam starts showing up)

## 📋 Open — ops

- [ ] Enable Cloudflare Email Routing for `hello@skagway.tours` (free,
  forwards to a destination inbox)
- [ ] Delete the test row from `contact_submissions` in D1 (`DELETE FROM
  contact_submissions WHERE email = 'test@example.com';`)

## ✅ Recently completed

- 2026-04-17 — 3-col tour grid, card clamp, logo image, placeholders,
  accordion'd tour detail pages (#14)
- 2026-04-17 — Phase 2 homepage rebuild (moss-green "Why us", feature
  cards, splash heading) (#14)
- 2026-04-17 — Phase 1 design foundation: Caveat script, moss palette,
  tour card redesign (#13)
- 2026-04-17 — 7 production tour content files + shared "Before your
  tour" block (#12)
- 2026-04-17 — Salmon + navy palette, 16px radius, pill buttons (#11)
- 2026-04-17 — Montserrat site-wide + 17px base (#10)
- 2026-04-17 — seo: blocks populated on every content file so
  CloudCannon renders the SEO section (#9)
- 2026-04-17 — Editable SEO fields (meta_title, meta_description,
  og_image, noindex) + editable favicon (#8)
- 2026-04-16 — Brevo email scaffolding (dormant until env vars set) (#7)
- 2026-04-16 — "More" dropdown fix + Contact in nav + hover interaction (#6)
- 2026-04-16 — Contact + newsletter forms wired to D1 + `/thanks/` page (#5)

## 🔒 Known issues / decisions of record

- **CloudCannon sync conflict risk.** If someone edits a content file in
  the CloudCannon UI at the same time a PR modifies that file, `git pull`
  inside CloudCannon can conflict (we hit this on `welcome.md` during the
  SEO block migration). Fix: resolve via CloudCannon's UI ("discard local
  changes" or merge manually), or contact CloudCannon support.
- **Logo and placeholders** point at `spcdn.shortpixel.ai` URLs for now.
  Self-host these when the final assets are ready.
- **Brevo integration is dormant, not broken.** Functions write to D1
  regardless; email only fires if env vars are set.
- **D1 binding variable name is `DB`** — must be identical in Production
  and Preview. Mismatch = 500s on form submit.
