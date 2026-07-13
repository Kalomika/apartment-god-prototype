# Top Shot Audit Report, 2026-07-12

Branch: `top-shot-anomaly-audit-2026-07-12`

Base branch for this audit: `top-shot-smoke-invalid-state-fix`

Backup branch already protecting the smoke-fix work: `backup/top-shot-coverage-matrix-2026-07-11-smoke-fix`

## Audit scope

This pass audited the full Top Shot game surface available in the repo branch, including repo workflow, docs, build scripts, tests, core simulation, CQC, stealth, AI, movement, combat, grenade/dive safety, arena/nav helpers, and the Three.js presentation layer.

Files and areas inspected included:

- `top-shot/AGENTS.md`
- `top-shot/docs/TOP_SHOT_HANDBOOK.md`
- `top-shot/docs/HANDOFF.md`
- `top-shot/docs/DEVELOPMENT_LOG.md`
- `top-shot/docs/FEATURE_INVENTORY.md`
- `top-shot/docs/ARCHITECTURE.md`
- `top-shot/docs/QA_CHECKLIST.md`
- `top-shot/docs/COVERAGE_MATRIX.md`
- Open Top Shot PR metadata, including PR #5, PR #23, PR #24, PR #25, and PR #26
- `top-shot/package.json`
- `top-shot/render.yaml`
- `top-shot/index.html`
- `top-shot/scripts/check.js`
- `top-shot/scripts/build.js`
- `top-shot/scripts/dev-server.js`
- `top-shot/src/config.js`
- `top-shot/src/archetypes.js`
- `top-shot/src/utils.js`
- `top-shot/src/arena.js`
- `top-shot/src/state.js`
- `top-shot/src/systems.js`
- `top-shot/src/main.js`
- `top-shot/src/brain.js`
- `top-shot/src/perception.js`
- `top-shot/src/tactics.js`
- `top-shot/src/combat.js`
- `top-shot/src/explosives.js`
- `top-shot/src/stealth.js`
- `top-shot/src/hiding.js`
- `top-shot/src/wounds.js`
- `top-shot/src/vitality.js`
- `top-shot/src/physicality.js`
- `top-shot/src/prestige.js`
- `top-shot/src/requests.js`
- `top-shot/src/navmesh.js`
- `top-shot/src/cameraAngles.js`
- `top-shot/src/cqcLab.js`
- `top-shot/src/three/topShot3D.js`
- `top-shot/src/three/actors3D.js`
- `top-shot/src/three/effects3D.js`
- `top-shot/tests/simSmoke.js`
- `top-shot/tests/cqcSmoke.js`
- `top-shot/tests/stealthSmoke.js`
- `top-shot/tests/modelSmoke.js`

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
- Fixed a test-side anomaly by making the sweep grounding setup deterministic. The test now boosts the attacker grapple and lowers defender balance so it verifies the grounded path instead of depending on a lucky random roll.

### 4. Stealth smoke used a stale fixed-phase expectation

PR #26 reports a known blocker where `stealthSmoke.js` expects the phase to remain `infiltration` after the first update, while runtime conditions can validly advance the stealth phase immediately.

Fix:

- Updated `top-shot/tests/stealthSmoke.js` to verify valid phase initialization and awareness setup instead of requiring a single hard-coded phase after one update.
- Kept the important behavior checks: shadow crouch detection must not be too strong, sound must build suspicion, clear sight must store last known position, and search planning must produce a destination.
- Added a guard so a jump to `alert` still requires hard visual confirmation.

## Audit findings that did not require a code patch in this pass

### State and systems

- `state.js` creates default `suit_operative` and `survival_commando` fighters with finite spawn/deploy fields.
- `systems.js` already sanitizes fighter state at key points in the update loop.
- The smoke-fix branch already hardens grenade/dive state in `explosives.js`.

### Movement and navigation

- `perception.js` and `navmesh.js` both use finite point guards and fallback routing.
- Movement still needs real smoke/browser verification because deterministic code inspection cannot prove every tactical path is fun or visually correct.

### CQC runtime

- `cqcLab.js` contains real support for body shots, sweeps, trips, throws, mounting, mount escape, ground punch, ground knife, limb grab, and disarm.
- The strengthened smoke test may now reveal real CQC defects that the old test missed.

### Three.js presentation

- `topShot3D.js`, `actors3D.js`, and `effects3D.js` are still placeholder production code compared with the Starshot visual target.
- The 3D presentation is not yet at the requested MGS2/PS2/PS3 hybrid 2.5D level on this audit branch.
- That work remains on the experimental Starshot/studio visual pipeline branches.

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

That work remains on `top-shot-starshot-engine` and the newer studio visual pipeline branch after smoke and browser checks are verified.

## Risk notes

- The strengthened CQC smoke may expose real CQC gaps that the previous smoke test missed.
- If `npm run smoke:cqc` fails, do not weaken the test until the failure is understood. The test now encodes explicit preservation targets from Kam's instructions.
- The stealth smoke now follows runtime behavior more accurately, but PR #26's studio visual pipeline branch still needs its own verification because it lives on a different branch.
- The live Render app may still show the previously deployed branch until Render deploys this work.

## Playable links

- Live app: [Top Shot live app](https://top-shot-prototype.onrender.com/)
- Audit branch: [top-shot-anomaly-audit-2026-07-12](https://github.com/Kalomika/apartment-god-prototype/tree/top-shot-anomaly-audit-2026-07-12/top-shot)
- Smoke fix PR: [PR #25, Harden Top Shot dive and grenade state](https://github.com/Kalomika/apartment-god-prototype/pull/25)
- Studio visual pipeline PR: [PR #26, Add Top Shot studio visual pipeline foundation](https://github.com/Kalomika/apartment-god-prototype/pull/26)

## Exact next step

Run `npm run smoke:cqc`, `npm run smoke:stealth`, and `npm run smoke:sim` first on `top-shot-anomaly-audit-2026-07-12`. If those pass, run the full check/smoke/build suite. If any fail, use the failure context to patch the exact issue instead of removing coverage.
