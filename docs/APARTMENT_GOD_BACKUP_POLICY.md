# Apartment God Backup Policy

Last update: 2026-07-13 backup retention increased to 10 routine backups

Purpose: keep Apartment God safe during development without filling the repo with endless backup branches.

---

## Core Rule

Before any major overhaul, create a backup branch first.

Major overhaul includes:

- Actor AI
- Autonomy
- Movement
- Pathfinding
- Save system
- Phone UI
- Menus
- Vehicle system
- House layout
- Routing
- Phaser renderer
- Any change likely to affect playability

---

## Backup Types

### Routine backups

Routine backups are rotating restore points for active development.

Examples:

```txt
backup/phaser-migration-before-ai-overhaul-YYYY-MM-DD
backup/phaser-migration-before-pathfinding-overhaul-YYYY-MM-DD
backup/main-before-render-update-YYYY-MM-DD
```

Routine backups can be pruned after enough newer backups exist.

### Milestone backups

Milestone backups are protected snapshots.

Use milestone backups for:

- A verified playable build
- A stable clone checkpoint
- A pre Phaser renderer checkpoint
- A successful major feature completion
- Any state Kam explicitly says to preserve

Example:

```txt
milestone/playable-clone-before-phaser-YYYY-MM-DD
```

Do not delete milestone backups unless Kam explicitly approves it.

---

## Retention Rule

Keep the latest 10 routine backups per major work stream.

A major work stream means a category like:

```txt
phaser-migration-ai
phaser-migration-pathfinding
phaser-migration-ui
phaser-migration-save-system
phaser-migration-renderer
phaser-migration-vehicle-system
main-render-access
```

When creating an 11th routine backup in the same work stream, prune or replace the oldest routine backup in that stream, unless Kam says to keep it.

Do not prune milestone backups as part of routine cleanup.

If a backup is connected to a scary regression, blank screen fix, save corruption fix, vehicle/garage regression, routing regression, or Render recovery, keep it until Kam confirms it can be deleted.

---

## Why 10 Backups

Ten routine backups gives safer rollback depth for Apartment God because even a small-looking gameplay change can expose or stack with a separate regression somewhere else. Four or five backups can rotate out too quickly when multiple agents are touching runtime, visuals, vehicles, routing, and documentation in the same week.

Git branches are lightweight because Git shares underlying objects. The branch list can still become cluttered, so the rule is not infinite backups. It is a deeper 10-backup safety window per major work stream, with milestone backups protected separately.

---

## Before Updating Main

Because `main` is currently the Render playable branch, before moving `main`:

1. Verify repo is `Kalomika/apartment-god-prototype`.
2. Verify source branch is the intended playable branch, usually `phaser-migration`.
3. Create or confirm a current `main` backup.
4. Confirm Kam wants Render playable access updated.
5. Move `main` only after the backup exists.
6. Log the action in `apartment-god-production/ONGOING_DESIGN_LOG.md`.

---

## Logging Backup Actions

Every backup creation or pruning action should be logged with:

```txt
Date and time with timezone
Backup branch name
Source branch
Reason for backup
Whether it is routine or milestone
Whether any older backup was pruned
```

---

## Restore Rule

If a major change breaks the game, restore from the newest appropriate backup branch or compare against that backup to recover the broken files.

Do not guess. Use the backup as the known checkpoint.
