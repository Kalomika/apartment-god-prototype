# Ongoing Design Log Append, Dog Renderer Cache Fix

Date: 2026-07-14
Status: PATCHING
Branch: phaser-migration, then main after backup sync
Runtime files changed: yes
Render settings changed: no

## Summary

Mobile QA reported that the dog appeared reverted after the Canvas boot recovery. Repo inspection showed the upgraded dog module still exists and the generic entity renderer skips dog entities, so the suspected issue is stale browser/module cache after switching boot hosts.

## Planned runtime patch

- Version the HTML module entry point.
- Version the dog overlay import from the render graph.
- Keep Canvas boot as the Render playable boot path.

## Testing requested

After Render rebuild:

- Hard refresh the app.
- Confirm playfield renders.
- Select dog and move it left/right/up/down.
- Confirm the dog uses the upgraded shape renderer and not the old fallback.
