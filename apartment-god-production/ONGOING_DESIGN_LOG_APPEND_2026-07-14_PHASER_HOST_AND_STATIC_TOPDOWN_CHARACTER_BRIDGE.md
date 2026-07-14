# Ongoing Design Log Append: Phaser Host And Static Top-Down Character Bridge

## 2026-07-14, Phaser Host And Static Top-Down Character Bridge

Status: NEEDS_BROWSER_CONFIRMATION
Branch: phaser-migration and main after sync
Runtime files changed: yes
Render playable branch updated: pending main backup and sync
Render settings changed: no
Backup branch:
- backup/phaser-migration-before-full-phaser-conversion-2026-07-14

## Files changed

- src/main.js
- src/phaserRuntime.js
- src/renderEntities.js
- src/rendering.js
- apartment-god-production/ONGOING_DESIGN_LOG_APPEND_2026-07-14_FULL_PHASER_CONVERSION_STARTED.md
- apartment-god-production/APARTMENT_GOD_IDEA_BIBLE_APPEND_2026-07-14_ANIMATION_REBUILD_APPROVAL_LADDER.md
- apartment-god-production/ONGOING_DESIGN_LOG_APPEND_2026-07-14_PHASER_HOST_AND_STATIC_TOPDOWN_CHARACTER_BRIDGE.md

## Summary

Started the real Phaser conversion without repeating the old blank-screen failure. The active entry now boots a Phaser-hosted runtime. The existing Canvas frame renderer is temporarily rendered into a Phaser canvas texture as a bridge so simulation, UI, save, autonomy, actions, camera navigation, and object behavior stay alive while the engine host is moved to Phaser.

Also started the animation rebuild from a clean baseline: the old procedural human animation stack is no longer treated as the target. Human characters now use a simple static true top-down bridge: top of head, shoulders, compact body mass, and minimal props. Movement may slide for now by design, because Kam approved rebuilding the animation ladder one approved stage at a time.

## Implementation details

- `src/main.js`: now imports and boots `bootPhaserGame()`.
- `src/phaserRuntime.js`: replaced the disabled Phaser fallback file with `ApartmentGodPhaserBridgeScene`.
- `src/phaserRuntime.js`: Phaser owns the game loop, simulation step, background tick, refresh autosave, and input dispatch.
- `src/phaserRuntime.js`: current Canvas renderer draws to a Phaser CanvasTexture so the playable build is Phaser-hosted without throwing away working gameplay.
- `src/phaserRuntime.js`: emergency fallback to `bootCanvasGame()` remains if Phaser fails before or during scene creation.
- `src/renderEntities.js`: replaced the old procedural human animation stack with a static top-down human bridge. Dogs are skipped by this renderer so the dog atlas overlay remains responsible for dog visuals.
- `src/rendering.js`: removed the obsolete south-walk guard because the new static top-down bridge no longer uses the broken front/back walking pose system.
- `apartment-god-production/APARTMENT_GOD_IDEA_BIBLE_APPEND_2026-07-14_ANIMATION_REBUILD_APPROVAL_LADDER.md`: records Kam's staged animation rebuild approval rule.

## What this is

This is a Phaser-hosted playable bridge and the first static top-down character baseline.

## What this is not

This is not the final Phaser-native sprite renderer. It is not the final character animation set. It is not the final PNG character atlas. Those must now be built in stages:

1. Approve static top-down look.
2. Add walk cycle.
3. Add sitting.
4. Add object-specific activity poses.
5. Replace temporary Canvas bridge with Phaser-native sprite layers and manifests.

## Testing performed

- Verified by repository/code inspection through GitHub fetches and compare checks.
- No local `npm run build`, `npm test`, or browser Render test was available in this connector environment.

## Testing requested

Open https://apartment-god-phaser.onrender.com after Render rebuild and hard refresh.

Test:

1. Boot: page should not blank.
2. Confirm the game still runs under the same HUD and controls.
3. Move Resident and Girlfriend. They may slide, but they should read as static top-down bodies instead of side-view puppets, crawling, or swimming.
4. Confirm clicking/tapping actors and objects still opens menus.
5. Confirm floor buttons, map/up/down, pause, speed, save/load still respond.
6. Confirm TV screen correction still works.
7. Confirm dog atlas overlay still appears.
8. Let the game run for several minutes and watch for runtime recovery errors.

## Known risks

- Phaser-hosted bridge still draws the legacy world frame into a Phaser texture. It is a safe conversion checkpoint, not the end of the migration.
- Character animations are intentionally reduced to a static top-down bridge. Old per-action human poses are not the target anymore and should be rebuilt in approved stages.
- Browser confirmation is mandatory before calling this stable.
- If Phaser host fails in Render, emergency fallback should attempt to boot the Canvas runtime, but this must be browser tested.

## Follow ups

- Browser test the Phaser-hosted bridge.
- Once static top-down body read is approved, build the north/south/east/west walk cycle as the next isolated stage.
- Then build sitting as its own isolated approval stage.
- Move rendering from Canvas texture bridge into Phaser-native room, object, actor, lighting, and UI layers one system at a time.
