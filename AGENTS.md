# Agent Instructions

This repository is the source of truth for Apartment God Prototype work. Do not rely on a chat transcript as the only handoff.

## Scope

Work only in `Kalomika/apartment-god-prototype` unless Kam explicitly says otherwise. Do not touch `Kalomika/ai-rpg-engine`.

## Project identity boundary

This repository currently contains legacy Top Shot branches as well as Apartment God branches. That shared hosting does not make them one game.

- Apartment God is the true top down 2D sprite game.
- Top Shot is the separate 3D model game.
- When working on Apartment God, do not read Top Shot branches as Apartment God requirements and do not import Top Shot model, rig, renderer, combat, camera, or animation pipeline instructions.
- Branches beginning with `top-shot`, `backup/top-shot`, `codex-wip/top-shot`, or `diag/top-shot` belong to Top Shot unless Kam explicitly says otherwise.
- Confirm the game name, active branch, and destination repository before every visual or engine pass.
- Follow `docs/APARTMENT_GOD_TOP_SHOT_REPOSITORY_SEPARATION.md` for the eventual repository split. Do not move or delete shared history without Kam's explicit approval.

## Required workflow

1. Create or confirm a backup branch before risky changes.
2. Work on a development branch for large changes.
3. Keep `main` deployable because Render uses it for the live static site.
4. Run checks before pushing.
5. Commit every meaningful change with a clear message.
6. Update repo memory files before ending a coding pass.

## Repo memory rule

Every coding pass must update at least:

- `docs/DEVELOPMENT_LOG.md`
- `docs/HANDOFF.md`

Large structural changes should also update:

- `docs/ARCHITECTURE.md`
- `docs/QA_CHECKLIST.md`
- `CHANGELOG.md`

## Build rules

Render is a Static Site. Preserve compatibility with:

- Build command: `npm install && npm run build`
- Publish directory: `dist`

## Current priority

Normalize the prototype into a modular codebase so future patches do not require replacing one giant `src/main.js` file.
