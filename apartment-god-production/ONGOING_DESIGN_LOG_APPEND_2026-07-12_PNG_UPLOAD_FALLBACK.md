# Ongoing Design Log Append, PNG Upload Fallback

Merge this entry into `apartment-god-production/ONGOING_DESIGN_LOG.md` during the next safe documentation sync.

---

## 2026-07-12 03:14 PM CT, PNG Upload Fallback Documented

Status: IMPLEMENTED
Branch: phaser-migration
Commit: 14fcc9dc0f5931d24b1c86f2035930e3bef72d2e
Files changed:
docs/APARTMENT_GOD_PNG_UPLOAD_FALLBACK.md
apartment-god-production/ONGOING_DESIGN_LOG_APPEND_2026-07-12_PNG_UPLOAD_FALLBACK.md
Runtime files changed: no
Render playable branch updated: no
Backup branch:
backup/phaser-migration-before-development-matrix-2026-07-11

Summary:
Documented the official fallback path for committing PNG sprites when Agent or Codex usage is limited and the native GitHub connector cannot directly transmit binary image streams.

Implementation details:
The new handbook supplement defines the Custom GPT Action or GitHub REST API workflow using Base64 PNG content, the corrected api.github.com server, the repository contents endpoint, branch discipline for phaser-migration, sha requirements for updates, token security, asset folder guidance, and future matrix and handbook sync notes.

Testing performed:
Documentation only. Confirmed repo access, phaser-migration file access, matrix file presence, and backup branch file access before adding the documentation file.

Testing requested:
None for runtime. Future PNG upload tests should start with a harmless test image on phaser-migration, confirm GitHub renders it as a normal PNG, then remove or replace the test asset before production use.

Known risks:
The fallback can bypass local build checks. Wrong branch, wrong path, missing sha on update, or careless overwrite could damage asset organization. This must be used with strict path, branch, and manifest discipline.

Follow ups:
Merge the supplement into the main handbook required reading list and development matrix during the next safe documentation sync. Then run a small PNG upload proof test on phaser-migration before using it for production sprite sets.
