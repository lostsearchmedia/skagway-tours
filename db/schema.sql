-- D1 schema for form submissions.
--
-- One-time setup (run from the repo root after installing wrangler):
--
--   npx wrangler d1 create skagway-tours-forms
--   # copy the database_id from the output, then:
--   npx wrangler d1 execute skagway-tours-forms --remote --file=./db/schema.sql
--
-- Then in the Cloudflare dashboard: Pages -> skagway-tours -> Settings ->
-- Bindings -> add a D1 binding named `DB` pointing at `skagway-tours-forms`
-- for both Preview and Production. The Pages Functions in /functions/api/
-- read from `env.DB`.
--
-- To re-run against a local dev DB instead, drop --remote.

CREATE TABLE IF NOT EXISTS contact_submissions (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  subject    TEXT,
  message    TEXT NOT NULL,
  user_agent TEXT,
  ip         TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_contact_created
  ON contact_submissions(created_at DESC);

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  email      TEXT NOT NULL UNIQUE,
  user_agent TEXT,
  ip         TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
