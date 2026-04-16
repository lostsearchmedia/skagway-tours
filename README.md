# Skagway Tours

Marketing site for Skagway Tours — built with [Astro](https://astro.build) and
ready to be edited in [CloudCannon](https://cloudcannon.com).

## Getting started

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # builds to ./dist
npm run preview
```

## Project layout

```
src/
  content/
    tours/       # one Markdown file per tour (appears on the homepage + /tours/<slug>/)
    posts/       # blog posts
    pages/       # About, Passport Requirements, Employment copy
    faqs/        # FAQ entries (one per question) — grouped by category
    site/
      settings.yml  # site-wide config: nav, contact, hero, promo banner
  components/    # Astro components (Header, Footer, Hero, TourCard, modals)
  layouts/       # Page layouts
  pages/         # Routes
  styles/        # global.css (design tokens + utility classes)
public/
  _redirects     # 301 redirects for removed WP URLs (Cloudflare/Netlify)
cloudcannon.config.yml  # how CloudCannon presents the collections in its editor
```

## Editing content

- **Tours**: add/edit files in `src/content/tours/`. The frontmatter schema is
  defined in `src/content.config.ts`.
- **Blog**: `src/content/posts/`.
- **FAQs**: `src/content/faqs/` — one file per question, grouped by `category`.
- **Site settings (nav, phone, booking)**: `src/content/site/settings.yml`.

Once the repo is connected to CloudCannon, all of the above is editable in a
visual CMS — no Markdown needed for non-developers.

## FareHarbor integration

The `BookButton` component builds FareHarbor URLs from the `fareharbor_shortname`
in `settings.yml`. Per-tour override: set `fareharbor_item_id` in the tour's
frontmatter. The FareHarbor lightframe script is included in `BaseLayout.astro`.

## Assets needed from the client

Search the repo for `REPLACE_ME` and `client to supply` to find every spot
that's waiting on a real asset or final copy. Top priorities:

- Homepage hero video (+ poster image)
- About page hero video
- Final "No passport, no tour, no kidding" graphic/animation
- Formspree (or equivalent) endpoint IDs for the pickup and contact forms
- Real FareHarbor short-name
- Final tour descriptions to match FareHarbor copy
- Revised passport requirements, cancellation, FAQ, and employment copy
