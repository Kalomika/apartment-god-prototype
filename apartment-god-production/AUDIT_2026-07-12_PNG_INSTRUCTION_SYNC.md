# Audit, PNG Instruction Sync

Created: 2026-07-12 03:39 PM CT
Branch: phaser-migration
Runtime files changed: no
Render playable branch updated: no
Main touched: no
Render settings changed: no
Protected repo touched: no

Files expected after this sync:

```txt
docs/APARTMENT_GOD_PNG_UPLOAD_FALLBACK.md
apartment-god-production/ONGOING_DESIGN_LOG_APPEND_2026-07-12_PNG_UPLOAD_FALLBACK.md
apartment-god-production/PNG_UPLOAD_INSTRUCTION_UPDATE_PROMPT_2026-07-12.md
apartment-god-production/backups/2026-07-12/png-upload-instruction-sync-backup-manifest.md
docs/APARTMENT_GOD_DEVELOPMENT_HANDBOOK_UPDATE_2026-07-12_PNG_UPLOAD_SYNC.md
apartment-god-production/DEVELOPMENT_MATRIX_UPDATE_2026-07-12_PNG_UPLOAD_SYNC.md
apartment-god-production/ONGOING_DESIGN_LOG_APPEND_2026-07-12_PNG_INSTRUCTION_SYNC.md
apartment-god-production/AUDIT_2026-07-12_PNG_INSTRUCTION_SYNC.md
```

Checklist:

```txt
[done] PNG fallback documented as a handbook supplement.
[done] Under 8K project instruction block created.
[done] File SHA backup manifest created for handbook, matrix, and ongoing log.
[done] Handbook merge patch created.
[done] Matrix merge patch created.
[done] Ongoing log append created.
[done] Runtime files avoided.
[done] Main avoided.
[done] Render settings avoided.
[done] Kalomika/ai-rpg-engine avoided.
[pending] Canonical handbook full-file merge.
[pending] Canonical matrix full-file merge.
[pending] Canonical ongoing log full-file merge.
```

Reason canonical merge is pending:

```txt
The available connector action for existing files replaces the whole file. The current handbook, matrix, and log are long living documents with active updates from other agents. Until a safe local checkout or patch-capable action is available, the patch files are the safer committed source of truth for exactly what to merge.
```

Next required action:

```txt
Use a local checkout, Agent/Codex session, or patch capable connector to apply the patch files into the canonical files, then audit with readback from phaser-migration before reporting complete.
```
