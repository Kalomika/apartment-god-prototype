# Agent Instructions

This repository is the source of truth for Apartment God Prototype work. Do not rely on a chat transcript as the only handoff.

## Scope

Work only in `Kalomika/apartment-god-prototype` unless Kam explicitly says otherwise. Do not touch `Kalomika/ai-rpg-engine`.

## Project identity boundary

This repository currently contains legacy Top Shot branches as well as Apartment God branches. That shared hosting does not make them one game.

- Apartment God is the true top down 2D sprite game.
- Top Shot is the separate hybrid production: highly rigged 3D models presented with intentional 2D anime elements, including 2D effects, painterly 2D backgrounds, outline-free color and lighting separation, and an effective 8 fps feel.
- When working on Apartment God, do not read Top Shot branches as Apartment God requirements and do not import Top Shot model, rig, renderer, combat, camera, or animation pipeline instructions.
- When working on Top Shot, preserve its complete 3D plus 2D pipeline. Do not remove its 2D effects, painterly background, anime timing, or outline-free rendering rules merely because its fighters are 3D.
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

## Apartment God Studio Protocol

Before any Apartment God assignment, read `studio/START_HERE.md` and follow the repository-native studio protocol.

A worker must inspect the current branch head, recent commits, active pull requests, append files, development matrix, tasks, and claims before selecting work. Claim one eligible bounded assignment before implementation, obey department ownership, record evidence, update both human-readable and machine-readable studio state, and release or hand off the claim after work.

The studio protocol does not authorize runtime edits, updates to `main`, deployment, Render setting changes, or work in `Kalomika/ai-rpg-engine`.

## Repo memory rule

Every coding pass must update at least:

- `docs/DEVELOPMENT_LOG.md`
- `docs/HANDOFF.md`

Apartment God work must also update the canonical production memory required by its handbook, including `apartment-god-production/ONGOING_DESIGN_LOG.md` and `apartment-god-production/DEVELOPMENT_MATRIX.md`, or clearly named sidecar append and patch files when canonical editing is unsafe.

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
