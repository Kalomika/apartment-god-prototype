# Agent Instructions

This repository is the source of truth for Apartment God Prototype work. Do not rely on a chat transcript as the only handoff.

## Scope

Work only in `Kalomika/apartment-god-prototype` unless Kam explicitly says otherwise. Do not touch `Kalomika/ai-rpg-engine`.

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
