# Backup Branch Request, PNG Instruction Sync

Created: 2026-07-12 03:45 PM CT
Branch: phaser-migration

Requested backup branch name:

```txt
backup/phaser-migration-before-png-instruction-sync-2026-07-12
```

Purpose:

```txt
Preserve the phaser-migration state before any canonical full-file merge of the PNG upload fallback into the handbook, development matrix, and ongoing log.
```

Files to protect before canonical merge:

```txt
docs/APARTMENT_GOD_DEVELOPMENT_HANDBOOK.md
apartment-god-production/DEVELOPMENT_MATRIX.md
apartment-god-production/ONGOING_DESIGN_LOG.md
```

This branch should be created before the canonical full-file merge is attempted in a local checkout or patch-capable tool.
