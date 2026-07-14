# Development Matrix Patch: Main Stabilization Audit

Status: NEEDS_BROWSER_CONFIRMATION
Branch: main
Runtime files changed: yes
Render settings changed: no
Manual Render deploy triggered: no
Backup branches:
- backup/main-before-main-stabilization-audit-2026-07-14
- backup/phaser-migration-before-main-stabilization-audit-2026-07-14

## Matrix rows to merge during next safe documentation sync

| System | Status | Files | Current state | Required test |
|---|---|---|---|---|
| Main playable boot | NEEDS_BROWSER_CONFIRMATION | `src/main.js` | Main currently boots `bootCanvasGame()`, preserving a safer playable path after the Phaser-host bridge black-screened. | Open Render link and confirm no black play canvas. |
| Sleep visual anchoring | NEEDS_BROWSER_CONFIRMATION | `src/renderEntities.js`, `src/actions.js` | Sleep-like visuals now draw on the bed object through `sleepObjectId`/bed fallback instead of drawing at the side-of-bed approach point. | Put actor to sleep and confirm the body/blanket are on the bed, not on the floor near the TV. |
| Private bathroom routing | NEEDS_BROWSER_CONFIRMATION | `src/autonomy.js`, `src/actions.js` | Bathroom object ranking now prioritizes same-floor private/master bathroom objects for upstairs actors and same-floor bath objects downstairs. Hand washing sink choice uses the same preference. | Trigger bladder/freshness upstairs. Resident should use master bathroom before downstairs bathroom unless blocked or occupied. |
| Action lifecycle stability | NEEDS_BROWSER_CONFIRMATION | `src/actions.js` | Stabilized action lifecycle preserves fetch, offsite completion, trash continuation, book completion, meal cleanup, robot vacuum, reactions, investments, queued tasks, and life activity recording while adding sleep object tracking. | Test fetch, trash, read, work/offsite, meal, shower, toilet, and queued follow-up actions. |
| Dog asset use on main | NEEDS_BROWSER_CONFIRMATION | `src/dogSpriteOverlay.js`, `assets/sprites/characters/dog/top_down_dog_atlas.svg` | Dog overlay now uses the committed dog atlas asset instead of runtime-only dog shape drawing on main. | Confirm dog appears from the asset and does not disappear while moving/resting. |
| Full Phaser/native asset rebuild | PLANNED_SEPARATE_BRANCH | Future branch | Main is stabilized for play/testing. Full Phaser-native rebuild should not continue directly on main. | Create or continue separate rebuild branch after main is confirmed playable. |

## Notes

This is a stabilization patch for the current playable branch, not the final visual conversion. Browser confirmation is required before marking stable.
