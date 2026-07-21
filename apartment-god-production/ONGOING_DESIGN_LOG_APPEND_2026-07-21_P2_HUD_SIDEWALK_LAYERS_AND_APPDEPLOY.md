# Ongoing Design Log Append: P2 HUD, Side Walk, Wardrobe Layers, and AppDeploy Update

## 2026-07-21

Status: DEPLOYED_FOR_TESTING, NEEDS_KAM_BROWSER_APPROVAL
Branch: phaser-migration-2
Runtime files changed: yes
Main touched: no
Render playable branch updated: no
Render settings changed: no
Manual Render deployment triggered: no
Protected repository touched: no
Backup branch: backup/phaser-migration-2-before-hud-and-layered-walk-fix-2026-07-21

## Kam-reported defects

Kam reported that Phaser Migration 2 had time and money information covering the playable game screen, and that people walking east or west did not turn their full bodies. The old west/east rows left the torso facing forward while shifting or leaning the head. Kam also expected a layered character system so clothing can change.

## Audit findings

- `index.html` placed `hud-calendar-pill` inside `game-wrap` with absolute positioning.
- `src/phaserMigration2Runtime.js` also created `statusText` containing time, money, autonomy, floor, selected actor, and action inside the Phaser scene.
- The runtime also created a bottom `runtimeText` diagnostic inside the playfield.
- `src/phaserMigration2GameplayParityBridge.js` created a third overlay named `hud-resource-strip`, containing money, power, and tidiness, and appended it over `game-wrap`.
- The current character manifest used four frames per direction played at 8 FPS. Eight FPS was incorrectly easy to interpret as eight frames.
- Existing west/east human rows largely reused the forward-facing body while altering the head and small pose offsets.
- No synchronized wardrobe sprite layer renderer existed. Wardrobe data only stored outfit names and colors.

## Implemented corrections

### HUD placement

- Moved date/time and money into `hud-status-strip` inside the side HUD.
- Removed those elements from `game-wrap`.
- Added `src/phaserMigration2HudPlacement.js` to destroy the Phaser `statusText` and `runtimeText` display objects and synchronize the side-HUD date and money fields.
- Removed the dynamically created `hud-resource-strip` canvas overlay from `src/phaserMigration2GameplayParityBridge.js`.
- Retained money, power, tidiness, and autonomy in the side utility panel.

### Full-body side walking

Added complete horizontal human walk sheets:

- `resident_side_8fps_sheet.svg`
- `girlfriend_side_8fps_sheet.svg`
- `lab_subject_side_8fps_sheet.svg`

East movement uses the complete side-body asset. West movement mirrors the complete side-body asset. The head, shoulders, torso, arms, legs, and shoes now turn as one visual unit instead of leaving the torso forward while leaning the head.

The current walk loop remains four frames per direction, played at 8 FPS. The documentation and manifest now state this explicitly.

### Wardrobe layers

Added synchronized tintable layers:

- `human_vertical_top_layer.svg`
- `human_vertical_bottom_layer.svg`
- `human_side_top_layer.svg`
- `human_side_bottom_layer.svg`

The layer renderer uses `entity.wardrobe.colors[entity.wardrobe.currentDay]` for the upper garment color and derives a darker coordinated lower garment color. Position, scale, origin, depth, frame index, direction, and east/west mirroring are synchronized with the character body.

This is the first wardrobe layer architecture. It does not yet provide authored silhouette swaps for shirts, jackets, dresses, shoes, hair, hats, or accessories.

### Fallback safety

Added `src/phaserMigration2LayerFallbackSafety.js`. Optional clothing layers that fail to load are hidden instead of displaying Phaser's missing-texture box over the base actor.

### Cache correction

Updated `src/main.js` and `index.html` cache versions so the HUD and side-walk corrections are requested instead of stale July 19 modules.

## Primary implementation commits

- da154af4a7c00cc998db43365a905c98b62b763b
- 17bbd83f921b9d8b6ecb9dd288910cc22514da5c
- 9d21caec4dd7fd5664a9c246ab1bfe8f020773cb
- 318c0f65ebd83cf2973ce3bb2faa9cd7909baa0a
- eec84a364693e2a03fe8b3665564d4419ac7b550
- 8690c30264d546830a263a3441e6cd8fe27d490a
- f8dcd174f368c2a3f09b64d738e1a69dee7f9b4f
- 4b3f9aa2eeee44c7d8e75a54d9a72b0be1d499b2
- 84c024e5b1696a4fddb4501396207d171ae4b820
- 1462239f468fd85837bd710eab410551d239fee8
- d58b246854eb6720632ff60e550e04ae08699cc2
- 47d3f83678832021701f0e12df164c26d72511d3
- d8bac1b06cbd91e6aa2ca34c8a6f2efe1306fb1f
- f9b19b87c1505e932d8e48f7387df00bc9e0fa20
- 1f160e5e81efafe05fedbdbcd39a99d6e58c9773
- 76ad970f5cea02f17ba61cb0693a6735d87067ae
- a8d4ad8ca8acfb767261ebde5a15b14b88760d15
- bfdebd538ab0c30553359ae649844706410173e9
- c42b41296a21c7164041cde1b9729b502c91f147
- e3d1e631f2b8d44214884b3107c517f09f5fb8db
- b1f12bd6537ee55e80753d116b6fef43897182f0

## AppDeploy preview

Live URL: https://31e6d4932a52c800f3.v2.appdeploy.ai/

The launcher was updated to runtime commit `b1f12bd6537ee55e80753d116b6fef43897182f0`, the latest user-visible runtime commit in this correction range. Later P2 commits at deployment time only added scripts/tests and did not change the visible runtime.

AppDeploy status:

- READY
- E2E tests: 3 of 3 passed
- Frontend errors reported: none
- Network errors reported: none

## Testing performed

- GitHub source inspection.
- Branch state and commit comparison.
- Added structural Vitest coverage in `tests/phaser-migration-2-hud-and-layered-walk.test.js`.
- Updated AppDeploy launcher tests.
- AppDeploy deployment and automated E2E checks passed 3 of 3.
- Local repository checks could not be executed because the local tool environment could not resolve GitHub to clone the public repository.

## Testing requested from Kam

Open and hard refresh:

https://31e6d4932a52c800f3.v2.appdeploy.ai/

Then:

1. Confirm time, money, power, and tidiness no longer cover the playable canvas.
2. Walk Resident east and west and confirm the entire body turns.
3. Repeat with Girlfriend.
4. Confirm west is a clean mirror of east rather than a forward body with a leaning head.
5. Change clothing or advance the wardrobe day and confirm top and bottom colors change without layer drift.
6. Check north and south walking for overlay alignment.
7. Confirm no missing-texture box appears if an optional wardrobe layer is unavailable.
8. Test on phone in portrait and landscape.

## Known risks

- Current side and wardrobe SVGs are temporary bridge assets, not approved final authored character art.
- Browser visual approval is still required for crop, scale, anatomy, layer alignment, and mobile readability.
- Clothing currently changes color layers, not garment silhouettes.
- The local full repository check, unit-test suite, and build were not run in this connector environment.

## Follow ups

After Kam's browser test, correct any remaining visible crop, alignment, direction, layering, or mobile-layout issues on `phaser-migration-2` only. Do not update main or Render without explicit instruction.
