# Apartment God And Top Shot Repository Separation

Status: current build migrated to `Kalomika/top-shot` on 2026-07-24. Original Top Shot branches preserved in this repository, nothing deleted.

## Migration Record (2026-07-24)

Top Shot now has its own private repository: `https://github.com/Kalomika/top-shot`.

- Source: `top-shot-full-stabilization-2026-07-21` at commit `b1079369375dc145863890fe87f0a9da14d066f6` (newest verified Top Shot build).
- The `top-shot/` subdirectory was lifted to the repository root using a history-preserving `git subtree split` (276 commits of Top Shot history carried over). No Apartment God files were included.
- New repository `main` head: `e58e23d` (root `46d21b0` from the split, plus one commit fixing `render.yaml` `rootDir` now that `top-shot/` is the root).
- Verified in the new repository: `npm run build` succeeds and `npm run smoke` passes (sim, CQC, stealth, model).
- Contents migrated: `TOP_SHOT_HANDBOOK.md`, `COVERAGE_MATRIX.md`, `FEATURE_HANDBOOK.md`, `AI_DEVELOPMENT_HANDBOOK.md`, `STARSHOT_ROADMAP.md`, all other docs, the full `src/` (including `three/` and `starshot/`), tests, scripts, `AGENTS.md`, and all 20 reference-image assets. 111 files total.

Preservation and safety:

- All 34 `top-shot*` and `backup/top-shot*` branches remain intact in `Kalomika/apartment-god-prototype`. None were moved, rewritten, or deleted.
- No Apartment God branch was touched. `main`, Render settings, and repository visibility of this repository were not changed.
- Backup branches and full commit history remain available here until Kam confirms the new repository is verified and authorizes any archival of the legacy Top Shot branches.

Remaining manual steps for Kam (require account/dashboard access this session does not have):

- Point the Render service `top-shot-prototype` at the new `Kalomika/top-shot` repository (the migrated `render.yaml` builds from the repository root).
- If desired, mirror the additional Top Shot development and backup branches into the new repository (currently they stay here as backups).

---

Status: migration required, no destructive migration authorized yet

## Root Cause

Apartment God and Top Shot were hosted as branches inside `Kalomika/apartment-god-prototype`. This made branch history, backups, handoff context, and production rules appear related even though they belong to different games.

This shared hosting caused a real production error on 2026-07-13 when Top Shot's 3D model direction was written into Apartment God's visual standard. That error was corrected immediately.

## Permanent Game Boundary

| Game | Visual Pipeline | Current Repository Situation |
|---|---|---|
| Apartment God | True top down 2D sprites, 2D effects, painterly 2D environments, anime timing | Active development remains in `Kalomika/apartment-god-prototype` on Apartment God branches. |
| Top Shot | Highly rigged 3D models and 3D gameplay systems combined with intentional 2D anime presentation, 2D effects, painterly 2D backgrounds, outline-free color and lighting separation, and effective 8 fps timing | Legacy active and backup branches are still hosted inside the Apartment God repository and need a separate repository. |

## Top Shot Rules That Must Remain Intact

This separation document does not replace Top Shot's own handbook, logs, matrices, code, or branch instructions. Those sources remain authoritative for Top Shot. The split must preserve, not simplify, the rules Kam already established.

The confirmed Top Shot visual and operational direction includes:

1. Fighters use highly rigged 3D models with a real human joint structure and grounded, Metal Gear Solid-like anatomical integrity.
2. The 3D models are presented with a 2D anime look.
3. Toon shading uses no heavy outlines. Color, value, and lighting separate forms.
4. Wind Waker is a reference for graphic color and lighting clarity, not for toy proportions. Model integrity remains grounded and adult.
5. Backgrounds may be painterly 2D art.
6. Effects are 2D.
7. Animation should support an effective 8 fps anime feel where directed.
8. The default camera is Top Down. Existing High Tactical, Oblique, and Isometric camera presets remain Top Shot options and must not be confused with Apartment God's fixed true overhead rule.
9. Top Shot source work stays inside `top-shot/` on Top Shot branches until migration.
10. The Top Shot Render target is `https://top-shot-prototype.onrender.com/`.
11. Top Shot's AI versus AI, no direct fighter control design and its combat, cover, hearing, line of sight, damage, extraction, and coaching rules remain Top Shot rules. Repository separation does not authorize redesigning them.

Shared aesthetic words do not merge the games. Both projects can use anime timing, 2D effects, painterly art, or top down cameras while still using different asset and runtime pipelines.

## Confirmed Top Shot Branch Families In This Repository

The 2026-07-13 audit found these branch families:

```txt
top-shot-*
backup/top-shot-*
codex-wip/top-shot-*
diag/top-shot-*
```

Confirmed active or development branches include:

```txt
top-shot-anomaly-audit-2026-07-12
top-shot-combat-pose-states
top-shot-coverage-matrix
top-shot-debug-overlay
top-shot-grok-debug-overlay
top-shot-smoke-invalid-state-fix
top-shot-starshot-engine
top-shot-studio-pipeline
top-shot-v0-1
top-shot-v0-2-test-board
codex-wip/top-shot-nav-movement-cqc-pass
diag/top-shot-connector-block-test
```

There are also many `backup/top-shot-*` restore branches. They must be preserved until the new repository has been verified.

## Safe Separation Plan

1. Kam confirms the destination Top Shot repository name and owner.
2. Create the new repository without changing Apartment God.
3. Mirror the Top Shot active branches and backup branches into the new repository while preserving commit history.
4. Inventory Top Shot Actions, deployment settings, binary assets, documentation, secrets, and external links.
5. Run build and smoke tests from the new Top Shot repository.
6. Add a Top Shot specific `AGENTS.md`, handbook, handoff, backup policy, and project identity marker.
7. Copy all existing Top Shot production rules without reducing its hybrid 3D plus 2D direction to a generic 3D label.
8. Freeze Top Shot branches in the Apartment God repository during a verification period.
9. Only after Kam approves the verified migration, archive or delete the old Top Shot branches from the Apartment God repository.

## Safety Rules

- Do not delete or rewrite Top Shot branches during the inventory phase.
- Do not move Apartment God branches into the Top Shot repository.
- Do not change `main`, Render settings, deployments, repository visibility, Actions secrets, or protected branches without explicit approval.
- Preserve backup branches and commit history.
- Compare branch heads before and after migration.
- Record every migrated branch and its original and destination commit SHA.

## Immediate Enforcement

Until separation is complete, every agent working in this repository must identify the game before reading branch history or production rules. Apartment God work must ignore Top Shot branch requirements. Top Shot work must not alter Apartment God branches.
