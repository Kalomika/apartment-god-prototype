# Ongoing Design Log Append, PNG Instruction Sync

Merge this entry into `apartment-god-production/ONGOING_DESIGN_LOG.md` during the next safe documentation sync.

---

## 2026-07-12 03:38 PM CT, PNG Instruction Sync Patch Files Added

Status: IMPLEMENTED
Branch: phaser-migration
Commit: latest connector commits
Files changed:
apartment-god-production/PNG_UPLOAD_INSTRUCTION_UPDATE_PROMPT_2026-07-12.md
apartment-god-production/backups/2026-07-12/png-upload-instruction-sync-backup-manifest.md
docs/APARTMENT_GOD_DEVELOPMENT_HANDBOOK_UPDATE_2026-07-12_PNG_UPLOAD_SYNC.md
apartment-god-production/DEVELOPMENT_MATRIX_UPDATE_2026-07-12_PNG_UPLOAD_SYNC.md
apartment-god-production/ONGOING_DESIGN_LOG_APPEND_2026-07-12_PNG_INSTRUCTION_SYNC.md
Runtime files changed: no
Render playable branch updated: no
Backup branch:
backup/phaser-migration-before-development-matrix-2026-07-11 and file SHA manifest under apartment-god-production/backups/2026-07-12/

Summary:
Added a compact under 8K instruction block for project or member instructions and created explicit patch files for merging PNG upload fallback rules into the handbook and development matrix.

Implementation details:
The instruction block tells future agents not to depend only on Agent or Codex for PNG asset delivery, and to use the documented Base64 GitHub API PNG fallback when needed. The handbook patch identifies the required reading update and the new PNG Asset Upload Fallback section. The matrix patch identifies the Sprite replacement pipeline row update, proof test row, risk row, update rule addition, and new PNG Upload Fallback Rule section.

Testing performed:
Documentation only. Readback audit required after commits to confirm files exist on phaser-migration. No runtime files changed.

Testing requested:
None for runtime. A future proof test should upload a harmless PNG through the Custom GPT Action or equivalent GitHub REST API path on phaser-migration.

Known risks:
The main handbook and matrix still need their full file merge when a safe patch or local checkout workflow is available. The patch files prevent the instruction details from being lost and avoid unsafe whole file replacement through the current connector.

Follow ups:
Merge the patch files into the actual handbook and matrix, then remove or archive the patch files after the canonical files are updated and audited.
