# Top Shot Audit Report, 2026-07-12

Branch: `top-shot-anomaly-audit-2026-07-12`

Base branch for this audit: `top-shot-smoke-invalid-state-fix`

Backup branch already protecting the smoke-fix work: `backup/top-shot-coverage-matrix-2026-07-11-smoke-fix`

## Audit scope

This pass audited Top Shot repo workflow, documentation expectations, smoke tests, CQC preservation coverage, and selected core runtime entry points.

Files and areas inspected included:

- `top-shot/AGENTS.md`
- `top-shot/docs/TOP_SHOT_HANDBOOK.md`
- `top-shot/docs/HANDOFF.md`
- `top-shot/docs/DEVELOPMENT_LOG.md`
- `top-shot/docs/FEATURE_INVENTORY.md`
- `top-shot/docs/ARCHITECTURE.md`
- `top-shot/docs/QA_CHECKLIST.md`
- `top-shot/docs/COVERAGE_MATRIX.md`
- Open Top Shot PR metadata, including PR #5, PR #23, PR #24, and PR #25
- `top-shot/src/main.js`
- `top-shot/src/state.js`
- `top-shot/src/systems.js`
- `top-shot/src/cqcLab.js`
- `top-shot/src/config.js`
- `top-shot/src/three/topShot3D.js`
- `top-shot/src/three/actors3D.js`
- `top-shot/src/cameraAngles.js`
- `top-shot/tests/simSmoke.js`
- `top-shot/tests/cqcSmoke.js`
- `top-shot/tests/stealthSmoke.js`
- `top-shot/tests/modelSmoke.js`
- `top-shot/package.json`
- `top-shot/render.yaml`

## Fixed anomalies

### 1. Playable link reporting was not encoded in repo rules

Kam reminded that Top Shot reports must always include clickable playable links.

Fix:

- Updated `top-shot/AGENTS.md` with a playable-link rule.
- Updated `top-shot/docs/TOP_SHOT_HANDBOOK.md` with the same requirement.
- Completion reports now require clickable links, not code-block-only URLs.

### 2. Required checks were stale in top-level instructions

The smoke-fix branch split smoke scripts, but `AGENTS.md` and the handbook still only listed the old check/smoke/build rhythm.

Fix:

- Updated `AGENTS.md` and `TOP_SHOT_HANDBOOK.md` to list:
  - `npm run check`
  - `npm run smoke:sim`
  - `npm run smoke:cqc`
  - `npm run smoke:stealth`
  - `npm run smoke:model`
  - `npm run smoke`
  - `npm run build`

### 3. CQC smoke did not fully protect Kam's CQC preservation targets

The old CQC smoke checked that actions could fire and fighters did not enter blocked prop space. It did not strongly verify:

- body shot zone tracking
- sweep/trip grounding behavior
- mount lock geometry
- ground attacks from mount
- escape mount integrity
- numeric validity of CQC fields and hitboxes

Fix:

- Rewrote `top-shot/tests/cqcSmoke.js` to assert body-shot zones, grounding attempts, mount spacing, grounded bottom state, top mount pose, ground punch/knife from mount, escape integrity, CQC numeric validity, and hitbox numeric validity.
- Kept the old action coverage and auto CQC coverage.

## Deferred findings

### Full automated checks were not run here

This connector environment can edit and inspect GitHub, but did not run a real local checkout.

Needed from `top-shot/`:

```bash
npm run check
npm run smoke:sim
npm run smoke:cqc
npm run smoke:stealth
npm run smoke:model
npm run smoke
npm run build
```

### Browser/render audit remains manual

The Render link and local browser still need manual confirmation for:

- no console errors
- match mode load
- CQC Lab load
- D debug overlay where present
- C collision debug where present
- top-down readability
- no visual squashing
- no mount clipping

### MGS2/2.5D presentation target is not implemented on this branch

This audit branch is a safety and coverage pass. It does not implement the Starshot presentation engine.

That work remains on `top-shot-starshot-engine` after the smoke fix is verified.

## Risk notes

- The strengthened CQC smoke may expose real CQC gaps that the previous smoke test missed.
- If `npm run smoke:cqc` fails, do not weaken the test until the failure is understood. The test now encodes explicit preservation targets from Kam's instructions.
- The live Render app may still show the previously deployed branch until Render deploys this work.

## Playable links

- Live app: [Top Shot live app](https://top-shot-prototype.onrender.com/)
- Audit branch: [top-shot-anomaly-audit-2026-07-12](https://github.com/Kalomika/apartment-god-prototype/tree/top-shot-anomaly-audit-2026-07-12/top-shot)
- Smoke fix PR: [PR #25, Harden Top Shot dive and grenade state](https://github.com/Kalomika/apartment-god-prototype/pull/25)

## Exact next step

Run `npm run smoke:cqc` and `npm run smoke:sim` first on `top-shot-anomaly-audit-2026-07-12`. If both pass, run the full check/smoke/build suite. If either fails, use the failure context to patch the exact issue instead of removing coverage.
