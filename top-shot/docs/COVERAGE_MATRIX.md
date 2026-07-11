# Top Shot Coverage Matrix

This matrix is the control board for Top Shot. It connects each major gameplay, engine, workflow, and documentation area to the files that own it, the tests that protect it, the current risk level, and the next action.

Use this file after reading the handbook and before editing code. The goal is to stop agents from guessing, duplicating work, or breaking old gameplay while building bigger systems.

## Status legend

| Status | Meaning |
| --- | --- |
| Baseline | Already part of the v0.1 stable purpose and must be preserved. |
| PR open | Implemented on an open pull request or branch, not stable yet. |
| Experimental | Work may exist on Starshot or another experimental branch, not merge ready. |
| Planned | Desired and documented, but not implemented yet. |
| Needs verification | Claimed or expected, but must be checked in current code before relying on it. |
| Known issue | Broken, unstable, failing checks, or blocked by a documented problem. |

## Risk legend

| Risk | Meaning |
| --- | --- |
| Low | Documentation, isolated helpers, or read-only tools. |
| Medium | Feature logic can regress if edited carelessly. |
| High | Core runtime, simulation state, CQC, AI, build, or branch safety can break. |
| Starshot | Ambitious experimental work that requires backup, isolation, and extra testing. |

## How to use this matrix

Before editing a Top Shot file, answer these questions from the matrix:

1. What feature or responsibility am I touching?
2. Which branch is the current source for that work?
3. Which files own it?
4. Which automated and manual checks prove it still works?
5. What risk level does the change carry?
6. Which docs must be updated after the change?
7. What should the next agent do if the work is unfinished?

If a feature is missing from this matrix, add it during the same pass that touches the feature.

## Branch and workflow matrix

| ID | Area | Responsibility | Status | Branch source | Key files | Protection check | Risk | Next action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| WF-001 | Project isolation | Keep Top Shot isolated from Apartment God main. | Baseline | `top-shot-v0-1` | `top-shot/AGENTS.md`, `top-shot/docs/TOP_SHOT_HANDBOOK.md` | Verify touched files are under `top-shot/` unless Kam explicitly asks otherwise. | High | Keep this rule in every handoff. |
| WF-002 | Stable branch | Keep `top-shot-v0-1` deployable. | Baseline | `top-shot-v0-1` | repo branch refs, docs | Run checks before stable merge. | High | Do risky work on a focused or experimental branch. |
| WF-003 | Backup branch | Maintain rollback branch before risky or Starshot work. | Baseline | `backup/top-shot-v0-1-2026-07-11-coverage-matrix` for this pass | branch refs, handoff | Confirm backup branch exists before risky work. | High | Create a fresh dated backup when stable moves. |
| WF-004 | Starshot branch | Ambitious engine work lives away from stable. | Experimental | `top-shot-starshot-engine` | Starshot files, docs | Handoff, development log, automated checks, browser QA. | Starshot | Treat as not merge ready until verified. |
| WF-005 | Open Top Shot v0.1 PR | Main Top Shot prototype PR remains open and draft. | Known issue | PR #5, `top-shot-v0-1` | full `top-shot/` folder | `npm run smoke` currently has documented failure in PR body. | High | Investigate invalid fighter state before merge. |
| WF-006 | Debug overlay PR | Telemetry overlay work is open against stable. | PR open | PR #23, `top-shot-debug-overlay` | `src/three/debugOverlay3D.js`, `src/three/effects3D.js` | `D` toggle, no gameplay mutation, visual sanity. | Medium | Review and test before merge. |
| WF-007 | Required reading | Agents must read docs, recent commits, open PRs, then exact files. | Baseline | `top-shot-v0-1` | `AGENTS.md`, handbook, this matrix | Completion report should confirm inspected scope. | Medium | Keep this matrix in the required reading list. |

## Gameplay feature matrix

| ID | Area | Feature or purpose | Status | Branch source | Key files | Preservation target | Automated check | Manual QA | Risk | Next action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| GP-001 | Match mode | One on one AI versus AI arena match. | Baseline | `top-shot-v0-1` | `src/main.js`, `src/state.js`, `src/systems.js` | Match starts, fighters spawn, fight progresses. | `npm run smoke` once fixed. | Start match mode and observe full engagement. | High | Protect during state and AI edits. |
| GP-002 | Fighter selection | Pick fighters before match start. | Baseline | `top-shot-v0-1` | `src/main.js`, `src/state.js` | Selection changes active fighter setup. | `npm run check` plus smoke where covered. | Change fighters and start match. | Medium | Keep UI state stable. |
| GP-003 | Coach style support | Fighter A can receive coach style support. | Baseline | `top-shot-v0-1` | `src/main.js`, `src/systems.js`, support modules where present | Support choices influence match without breaking simulation. | Needs verification. | Trigger support and watch effect. | Medium | Map exact support files during next touch. |
| GP-004 | Commander ethos | Commander ethos selector affects command flavor. | Baseline | `top-shot-v0-1` | `src/main.js`, `src/state.js` | Ethos is selectable and does not crash. | Needs verification. | Switch ethos and run match. | Medium | Confirm current data flow. |
| GP-005 | CQC Lab | Isolated manual and auto CQC test mode. | Baseline | `top-shot-v0-1` | `src/cqcLab.js`, `src/main.js`, `src/three/actors3D.js` | Lab loads, actions trigger, auto and slow mode work. | `npm run check`; smoke if covered. | Run CQC Lab checklist. | High | Keep isolated and testable. |
| GP-006 | Body shots | Body shot actions affect zones and reactions. | Baseline | `top-shot-v0-1` | `src/cqcLab.js`, `src/combat.js`, `src/three/actors3D.js` | Body zones are hit, visible reaction is readable. | Needs verification. | Use body shot in CQC Lab. | Medium | Add timing and reaction clarity later. |
| GP-007 | Sweeps and trips | Fighter can be grounded by sweep or trip. | Baseline | `top-shot-v0-1` | `src/cqcLab.js`, `src/combat.js`, actors files | Fighter enters grounded state correctly. | Needs verification. | Trigger sweep, verify grounded pose. | High | Preserve before adding new animations. |
| GP-008 | Mounting | Top fighter mounts without clipping through body. | Baseline | `top-shot-v0-1` | `src/cqcLab.js`, `src/three/actors3D.js`, `src/three/effects3D.js` | Mount pose places fighter on body, not through body. | Needs verification. | Trigger mount, rotate view if available, verify no clipping. | High | Use as regression gate for animation work. |
| GP-009 | Mount escape | Mounted fighter can attempt escape. | Baseline | `top-shot-v0-1` | `src/cqcLab.js`, combat files | Escape attempt changes state or pressure. | Needs verification. | Trigger mount escape in lab. | High | Protect during grapple refactor. |
| GP-010 | Limb grabs and disarms | CQC includes limb grab and disarm purpose where implemented. | Baseline | `top-shot-v0-1` | `src/cqcLab.js`, `src/combat.js` | Disarm changes weapon or control state. | Needs verification. | Trigger limb or disarm action. | High | Map exact function names before edit. |
| GP-011 | Ranged fire | Gunfire and projectiles are represented. | Baseline | `top-shot-v0-1` | `src/systems.js`, `src/combat.js`, `src/three/effects3D.js` | Shots resolve and visible effects appear. | Smoke once valid. | Run ranged archetype match. | High | Do not break during effects work. |
| GP-012 | Projectile retrieval | Arrows or shurikens can be retrieved where implemented. | Baseline | `top-shot-v0-1` | `src/systems.js`, projectile helpers where present | Retrieval does not corrupt inventory or position. | Needs verification. | Run archer or ninja match. | Medium | Confirm exact file ownership. |
| GP-013 | Damage model | Health, stamina, block, dodge, bleed, recovery caps, incapacitation. | Baseline | `top-shot-v0-1` | `src/state.js`, `src/systems.js`, `src/combat.js` | Damage changes state without NaN or invalid fighter state. | `npm run smoke`, currently blocked by known issue. | Observe match until finish. | High | Investigate smoke failure first. |
| GP-014 | Fight ending | Fight can end or reach clear state. | Baseline | `top-shot-v0-1` | `src/systems.js`, `src/state.js` | Match resolves without infinite broken state. | Smoke once fixed. | Watch full match. | High | Add clearer failure telemetry. |

## AI and simulation matrix

| ID | Area | Feature or purpose | Status | Branch source | Key files | Preservation target | Automated check | Manual QA | Risk | Next action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| AI-001 | Movement | AI fighters move through arena. | Baseline | `top-shot-v0-1` | `src/brain.js`, `src/perception.js`, `src/tactics.js`, `src/systems.js` | Fighters move with valid positions. | Smoke, currently blocked by known issue. | Start match and track movement. | High | Add invalid state diagnostics. |
| AI-002 | Cover seeking | AI uses cover and line of sight. | Baseline | `top-shot-v0-1` | `src/perception.js`, `src/tactics.js`, `src/systems.js` | Fighter seeks cover when useful. | Needs verification. | Run ranged match with cover. | High | Preserve in AI refactors. |
| AI-003 | Stealth and hiding | Ninja or shadow behavior can hide and search. | Baseline | `top-shot-v0-1` | `src/stealth.js`, `src/perception.js`, `src/tactics.js` | Hide, detection, and search states work. | Needs verification. | Run stealth archetype match. | High | Add debug overlay labels before deep AI changes. |
| AI-004 | Crouch and prone | AI can crouch or go prone where implemented. | Baseline | `top-shot-v0-1` | `src/state.js`, `src/tactics.js`, `src/three/actors3D.js` | Pose and state stay synced. | Needs verification. | Observe crouch and prone pose. | Medium | Add animation state mapping. |
| AI-005 | Last seen investigation | AI can investigate last seen locations. | Baseline | `top-shot-v0-1` | `src/perception.js`, `src/stealth.js`, `src/brain.js` | Search behavior moves to meaningful target. | Needs verification. | Break line of sight and observe search. | Medium | Add explainable decision labels. |
| AI-006 | Tactical choices | Decisions use health, stamina, visibility, sound, and archetype. | Baseline | `top-shot-v0-1` | `src/brain.js`, `src/tactics.js`, `src/systems.js` | AI acts with purpose, not random collapse. | Needs verification. | Compare different archetype matches. | High | Prepare AI style module later. |
| AI-007 | AI style profiles | Aggressor, flanker, tactician, sniper, assassin, brawler, defensive. | Planned | Starshot roadmap | target `src/ai/aiStyles.js` | Style changes decisions while preserving core AI. | TBD. | TBD. | Starshot | Implement after debug visibility improves. |
| AI-008 | Explainable AI overlay | Debug shows why AI made decisions. | Planned | Starshot roadmap, PR #23 partial debug overlay | `src/three/debugOverlay3D.js` target | Overlay is read-only and truthful. | TBD. | Toggle `D`, inspect labels. | Starshot | Extend after PR #23 is reviewed. |

## 3D, rendering, and animation matrix

| ID | Area | Feature or purpose | Status | Branch source | Key files | Preservation target | Automated check | Manual QA | Risk | Next action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 3D-001 | Three.js world | Create scene, camera, renderer, markers, update and sync. | Baseline | `top-shot-v0-1` | `src/three/topShot3D.js` | World loads and syncs state. | `npm run check`, `npm run build`. | Browser start. | High | Inspect before any render edit. |
| 3D-002 | Actor rigs | Segmented placeholder actors with readable body parts. | Baseline | `top-shot-v0-1` | `src/three/actors3D.js` | Head, torso, arms, legs remain readable top down. | Build. | View match and CQC Lab. | High | Replace only with tested equivalent. |
| 3D-003 | Effects | Muzzle flashes, tracers, impacts, landing flashes, parachutes where present. | Baseline | `top-shot-v0-1` | `src/three/effects3D.js` | Effects render without breaking gameplay. | Build. | Run ranged and movement scenarios. | Medium | Keep effects presentation-only. |
| 3D-004 | Debug overlay | Fighter cores, facing rays, targets, CQC hitboxes, mount locks, pickups, projectiles. | PR open | `top-shot-debug-overlay`, PR #23 | `src/three/debugOverlay3D.js`, `src/three/effects3D.js` | Toggle with `D`, read-only, not misleading. | Build and manual QA needed. | Toggle `D` in match and lab. | Medium | Merge only after verification. |
| 3D-005 | Collision debug | Collision debug toggles with `C` where implemented. | Baseline | `top-shot-v0-1` | `src/three/topShot3D.js` | Toggle remains separate from overlay. | Needs verification. | Press `C`. | Medium | Keep independent from `D`. |
| 3D-006 | Motion smoothing | Visual inertia, turn smoothing, acceleration and deceleration feel. | Planned or experimental | `top-shot-starshot-engine` target | target `src/three/actorMotion3D.js` | Presentation smooths without mutating simulation state. | TBD. | Browser feel test. | Starshot | Implement as separate read-only visual layer. |
| 3D-007 | Animation state | Derived animation state and micro-motion. | Planned or experimental | `top-shot-starshot-engine` target | target `src/three/animationState3D.js` | Poses become more readable without breaking state. | TBD. | Compare idle, walk, crouch, prone, attack, ground, mount. | Starshot | Build after motion layer. |
| 3D-008 | Camera readability | Top down camera remains primary and readable. | Baseline | `top-shot-v0-1` | `src/three/topShot3D.js`, `src/main.js` | Camera follows action and does not lose fighters. | Build. | Start match and track fighters. | High | Preserve during camera drama work. |

## Starshot expansion matrix

| ID | Area | Feature or purpose | Status | Branch source | Target files | Required proof | Risk | Next action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| SS-001 | Combat timing | Timing profiles, hit frames, impact pause, combo windows, counter windows. | Planned | Starshot roadmap | `src/combat/combatTiming.js`, `src/combat/comboCore.js` | CQC Lab still passes body, sweep, mount, escape checks. | Starshot | Add without replacing CQC all at once. |
| SS-002 | Character profiles | Data driven stats, abilities, power scales, move sets. | Planned | Starshot roadmap | `src/profiles/characterProfiles.js` | Existing archetypes still work. | Starshot | Feed existing systems first. |
| SS-003 | Powers and weapons | Human, enhanced, superhuman, cosmic, weapons, powers. | Planned | Starshot roadmap | profile and combat modules | Balance and safety limits documented. | Starshot | Start with profile data only. |
| SS-004 | Procedural arenas | Prompt driven arenas with cover, lanes, chokepoints, spawns. | Planned | Starshot roadmap | `src/arena/generateArenaFromPrompt.js` | Generated arena remains playable and readable. | Starshot | Build after core movement and debug are stronger. |
| SS-005 | Tournament simulation | Repeated fights, wins, match length, damage, notable events. | Planned | Starshot roadmap | `src/sim/tournamentRunner.js` | Repeated runs produce valid logs without corrupting state. | Starshot | Implement after smoke failure is fixed. |
| SS-006 | Balance diagnostics | Matchup logs reveal AI problems and style outcomes. | Planned | Starshot roadmap | sim and logging modules | Export or display useful diagnostics. | Starshot | Pair with tournament runner. |
| SS-007 | Sound and polish hooks | Sound hooks, camera drama, performance, UI clarity. | Planned | Starshot roadmap | render, UI, effects modules | Polish improves readability, does not hide weak mechanics. | Medium | Leave until mechanics stabilize. |

## Documentation matrix

| ID | Doc | Purpose | Status | Must update when | Risk if stale | Next action |
| --- | --- | --- | --- | --- | --- | --- |
| DOC-001 | `top-shot/AGENTS.md` | Short mandatory agent instruction entry point. | Baseline | Required reading or branch rules change. | Agents skip source of truth. | Keep concise. |
| DOC-002 | `top-shot/docs/TOP_SHOT_HANDBOOK.md` | Main development Bible. | Baseline | Workflow, branch, architecture, or policy changes. | Agents follow outdated rules. | Keep high-level and stable. |
| DOC-003 | `top-shot/docs/HANDOFF.md` | Current continuation state. | Baseline | Every meaningful coding or docs pass. | Next agent starts from wrong state. | Update every pass. |
| DOC-004 | `top-shot/docs/DEVELOPMENT_LOG.md` | Chronological repo memory. | Baseline | Every meaningful coding or docs pass. | History gets lost. | Add dated entries. |
| DOC-005 | `top-shot/docs/FEATURE_INVENTORY.md` | Canonical feature preservation list. | Baseline | Feature behavior changes. | Refactors delete gameplay purpose. | Keep player-facing. |
| DOC-006 | `top-shot/docs/ARCHITECTURE.md` | Module ownership and future technical direction. | Baseline | Architecture or module ownership changes. | Systems get duplicated or tangled. | Update on new modules. |
| DOC-007 | `top-shot/docs/QA_CHECKLIST.md` | Manual and automated merge gates. | Baseline | Test expectations change. | Branch marked stable too early. | Keep actionable. |
| DOC-008 | `top-shot/docs/COVERAGE_MATRIX.md` | Cross-map features, files, checks, risks, and next actions. | Baseline after this pass | Feature, system, test, branch, or risk status changes. | Agents cannot see what is protected. | Update alongside affected docs. |
| DOC-009 | `top-shot/docs/STARSHOT_ROADMAP.md` | Big experimental direction. | Baseline optional | Starshot phase changes. | Ambition loses structure. | Keep separate from stable claims. |

## Update rules

When a task changes code, update this matrix if any of these are true:

1. A new feature appears.
2. An old feature is replaced.
3. A feature moves to a new file.
4. A branch status changes.
5. A PR is opened, merged, or closed for Top Shot.
6. A test expectation changes.
7. A risk level changes.
8. A known issue is fixed or discovered.

When the matrix changes, also update `top-shot/docs/HANDOFF.md` and `top-shot/docs/DEVELOPMENT_LOG.md`.

## Immediate known blockers

| ID | Blocker | Source | Impact | Required next step |
| --- | --- | --- | --- | --- |
| BLK-001 | PR #5 documents `npm run smoke` failure with `Invalid fighter state`. | PR #5 body | Stable merge is unsafe until investigated. | Reproduce locally or through Actions, then add diagnostics around fighter position, health, elevation, and state validation. |
| BLK-002 | Debug overlay PR #23 is open and not yet confirmed merged into stable. | PR #23 | Starshot visibility may be split between branches. | Review changed files, run checks, test `D` and `C` toggles. |
| BLK-003 | Starshot branch can diverge quickly. | Handoff and roadmap | Experimental work can outrun docs. | Keep Starshot handoff and this matrix updated per slice. |

## Merge gate reminder

A Top Shot branch is not stable or merge-ready until:

1. `npm run check` has run successfully.
2. `npm run smoke` has run successfully, unless Kam explicitly accepts the risk.
3. `npm run build` has run successfully.
4. Relevant manual QA has been performed.
5. `HANDOFF.md`, `DEVELOPMENT_LOG.md`, and this matrix match the branch state.
6. Feature, architecture, and QA docs are updated if their areas changed.
