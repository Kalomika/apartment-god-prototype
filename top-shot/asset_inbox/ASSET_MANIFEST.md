# Top Shot Asset Inbox Manifest

This support folder is for Top Shot research, implementation notes, asset notes, and handoff material. It is meant for any AI or human agent working on the project, not only Codex.

## Reference notes

- `reference_notes/CQC_LAB_COMBAT_IMPLEMENTATION_LOG.md`, CQC Lab combat direction and implementation status covering close distance, collision cores, body part hitboxes, body shots, sweeps, knockdowns, mounting, ground fighting, knife fighting, gun handling, auto combat, style profiles, Main Match close camera goals, and the first CQC animation rig pass.
- `reference_notes/STEALTH_REFERENCE_ENGINE_LOG.md`, stealth reference study and implementation status covering Metal Gear Solid and Splinter Cell style takeaways, global stealth phases, suspicion buildup, sound against ambient noise, evidence discovery, last known position search, alert roles, and stealth smoke testing.
- `reference_notes/FIGHTER_REDESIGN_MODEL_INTEGRITY_LOG.md`, low-poly tactical fighter redesign target based on the generated suit operative and survival commando concept sheet, including realistic proportions, readable face planes, gear layering, holsters, tactical vest, pouches, weapon staging, and animation-friendly segmentation.
- `reference_notes/MOBILITY_BLOOD_HEALTH_CINEMATIC_LOG.md`, mobility and feedback pass covering climbable/elevated objects, jump down states, bullet evasion priority, blood spray, bleeding trails, visible health stages, realistic pacing, and intro/outro cinematic state.
- `reference_notes/TACTICAL_COVER_PRESERVATION_AND_GRAPPLING_LOG.md`, tactical preservation pass covering pinned cover, peek fire, dive/roll-to-cover behavior, material-aware bullet/arrow impacts, armor sparks, ninja smoke escape, and ninja grappling hook traversal.
- `docs/CHANGELOG_ENGAGEMENT_DIRECTOR_2026-07-09.md`, engagement director pass covering the survival floor, aggression floor, anti-stall escalation, attack windows, and character-specific pressure rhythms.

## Runtime note

The CQC, stealth, fighter redesign, mobility, blood, health UI, cinematic, tactical cover, preservation, ninja grappling, and engagement director passes were also committed directly to runtime files on `top-shot-v0-1` because the user explicitly requested implementation, not only handoff notes.

Runtime files touched across these passes include:

- `top-shot/src/cqcLab.js`
- `top-shot/src/three/actors3D.js`
- `top-shot/src/stealth.js`
- `top-shot/src/perception.js`
- `top-shot/src/brain.js`
- `top-shot/src/systems.js`
- `top-shot/src/state.js`
- `top-shot/src/arena.js`
- `top-shot/src/combat.js`
- `top-shot/src/wounds.js`
- `top-shot/src/three/effects3D.js`
- `top-shot/src/engagementDirector.js`
- `top-shot/index.html`
- `top-shot/styles.css`
- `top-shot/tests/cqcSmoke.js`
- `top-shot/tests/stealthSmoke.js`
- `top-shot/tests/modelSmoke.js`
- `top-shot/tests/simSmoke.js`
- `top-shot/package.json`
