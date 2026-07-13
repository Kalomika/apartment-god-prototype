# Backup Manifest: Visual State Logic Cleanup

Status: BACKUP_MANIFEST_ONLY
Date: 2026-07-13
Branch protected: phaser-migration
Reason: current GitHub tool set in this chat exposes file update actions but not real branch creation. Per project backup fallback rule, this manifest records the exact files and blob SHAs protected before runtime edits.

## Protected files and SHAs before edits

| File | Blob SHA |
|---|---|
| src/mainFloorLayoutPolish.js | cf0d32467e41c514cad678e17d29d82612a5ac71 |
| src/realismCorrectionPass.js | f9d051d1f6cb4a66499d91fb11a2594a14184967 |
| src/renderEntities.js | b0095ce70281b05bf3caf9966d60dcfea2a1879d |
| src/renderObjects.js | 11f12912776dbac048b1361ebf7636bf09905b2c |
| src/rendering.js | d6cd0d5b91d2ef121a8e96af50046e71c90e1187 |
| src/world.js | f6b28828475bfb90649a5d67c462955160336f51 |

## Scope protected

This manifest protects the current runtime state before fixing:

- TV glow state logic
- office desk chair layering
- couch sitting anchor/readability
- dining overlap cleanup
- porch and pet/robot nook layout
- upstairs sink/vanity shape readability
- sleeping head/body orientation mismatch
- dog top-down sprite readability

## Restore note

If this pass regresses boot, movement, visual stack, or Render playability, restore these files to the listed blob SHAs or compare against the commit immediately before this manifest.
