# Development Matrix Patch, 2026-07-14, Procedural Top Down Character Proof

Status: NEEDS_BROWSER_TESTING
Branch: phaser-migration
Backup branch: backup/phaser-migration-before-procedural-topdown-character-proof-2026-07-14

## Matrix rows affected

| Matrix area | Row | Previous state | New state | Notes |
|---|---|---|---|---|
| System Matrix | Secret Lab East | NEEDS_TESTING | NEEDS_TESTING | Secret Lab now contains a man, woman, and dog visual proof set using the flat true top down procedural style. |
| System Matrix | Sprite replacement pipeline | PARTIAL | PARTIAL, NEEDS_BROWSER_TESTING | This is not a PNG sprite pass. It is a procedural Canvas proof to validate the flat top down silhouette language before broad sprite replacement. |
| Animation Matrix | Character sprite integrity | NEEDS_TESTING | NEEDS_BROWSER_TESTING | Lab-only entities now use the new procedural top down Bible look, with adult proportions, clean overhead silhouettes, and no chibi or mascot body language. |
| Test Matrix | Secret Lab navigation | NEEDS_TESTING | NEEDS_BROWSER_TESTING | Browser test should open the Secret Lab, confirm the man, woman, and dog are visible, selectable where applicable, not crashing, and stylistically closer to the provided flat top down reference. |
| Risk Matrix | Renderer changes | HIGH | HIGH, GUARDED | Change is limited to renderEntities.js and state.js with a backup branch created first. Main, Render settings, and ai-rpg-engine were not touched. |

## Required browser checks

```txt
Open https://apartment-god-phaser.onrender.com only after this branch is made playable or tested locally.
Use the Secret Lab button.
Confirm Secret Lab boots without blank canvas.
Confirm Test Man, Test Woman, and Test Dog are visible in the lab.
Confirm the lab characters read as flat true top down, not chibi, mascot, toy, emoji, or side view.
Confirm the normal household still boots and the real cast remains playable.
Confirm selecting or navigating does not crash.
```

## Follow up if approved

If Kam likes the test lab proof, create a separate broader pass to apply the approved style to Resident, Girlfriend, and Dog, then rebuild activity-specific poses from the same Bible.
