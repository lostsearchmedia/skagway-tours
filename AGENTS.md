# Agent notes for skagway-tours

This is an Astro 5 static site edited in **CloudCannon**. Every CloudCannon
change should keep the editing experience working — not just make the build
pass. Before making CloudCannon-related changes, read the relevant skill docs
vendored into this repo.

## CloudCannon agent skills (vendored from tomrcc/agent-tooling)

The `.cloudcannon/agent-skills/` directory is a mirror of the
[tomrcc/agent-tooling](https://github.com/tomrcc/agent-tooling) skills at the
time of import. Treat them as the source of truth for CloudCannon patterns.

Reading order for CloudCannon work:

1. `.cloudcannon/agent-skills/migrating-to-cloudcannon/SKILL.md` — phase
   orchestration and handoff expectations.
2. `.cloudcannon/agent-skills/migrating-to-cloudcannon/astro/overview.md` — the
   five Astro migration phases.
3. `.cloudcannon/agent-skills/cloudcannon-configuration/astro/configuration.md`
   — how to structure `cloudcannon.config.yml`, with the verification checklist
   at the bottom. **Run the checklist before declaring config work done.**
4. `.cloudcannon/agent-skills/cloudcannon-configuration/astro/configuration-gotchas.md`
   — common pitfalls. Skim every time.
5. `.cloudcannon/agent-skills/cloudcannon-visual-editing/SKILL.md` and
   `astro/visual-editing.md` — when wiring up or debugging editable regions.
6. `.cloudcannon/agent-skills/cloudcannon-snippets/SKILL.md` — when adding MDX
   components or snippets to content.

The `.cloudcannon/agent-skills/migrating-to-cloudcannon/scripts/audit-astro.sh`
script generates a site audit. Re-run it before major CloudCannon changes.

## Project conventions (current state)

- Astro 5, static output, MDX enabled.
- Content collections in `src/content/`: `tours`, `posts`, `pages`, `faqs`,
  `site` (single-file YAML data).
- `cloudcannon.config.yml` uses the unified config format:
  - `output: true` on collections is **defunct** — don't reintroduce it. A
    `url` pattern already implies output; `disable_url: true` turns it off.
  - Every array input in `_inputs` has a matching `_structures` entry. If you
    add a new array field, add its structure too, or editors can't add items.
  - `_enabled_editors` order is the default editor — `visual` first for page
    collections, `data` only for the `site` settings collection.
  - New tours/posts use `editor: content` on `add_options` because they have
    a `draft` field and drafts aren't built (so there's no preview URL).
- Schema templates for the **+ Add** button live in `.cloudcannon/schemas/`.
  Keep their frontmatter aligned with the Zod schema in
  `src/content.config.ts`.
- Images: global `paths.uploads: public/images`. If you add `<Image>` (from
  `astro:assets`) usage that needs `src/assets/` storage, add a per-input path
  override — see configuration.md § Image path configuration.

## Visual editing (not yet wired)

`@cloudcannon/editable-regions` is **not installed yet**. When you do wire it
up, follow `.cloudcannon/agent-skills/cloudcannon-visual-editing/scripts/setup-editable-regions.sh`
and the Astro workflow doc. Do the section census first — inline text and
images on `BaseLayout`, `Hero`, `TourCard`, `PageHero`, `SiteHeader`,
`SiteFooter`, the homepage, and the blog/tour detail templates are the
obvious candidates.

## Before you commit

- Run `npm run build`. A passing build is the bar for configuration changes.
- If you touched CloudCannon config or schemas, re-read the configuration
  verification checklist and tick items off mentally.
- Keep commits focused on one CloudCannon concern at a time so the editor UI
  is reviewable in isolation.
