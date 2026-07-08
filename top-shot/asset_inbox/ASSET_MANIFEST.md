# Top Shot Asset Inbox Manifest

This support folder is for Top Shot research, implementation notes, asset notes, and handoff material. It is meant for any AI or human agent working on the project, not only Codex.

## Reference notes

- `reference_notes/CQC_LAB_COMBAT_IMPLEMENTATION_LOG.md`, CQC Lab combat direction and implementation status covering close distance, collision cores, body part hitboxes, body shots, sweeps, knockdowns, mounting, ground fighting, knife fighting, gun handling, auto combat, style profiles, Main Match close camera goals, and the first CQC animation rig pass.
- `reference_notes/STEALTH_REFERENCE_ENGINE_LOG.md`, stealth reference study and implementation status covering Metal Gear Solid and Splinter Cell style takeaways, global stealth phases, suspicion buildup, sound against ambient noise, evidence discovery, last known position search, alert roles, and stealth smoke testing.

## Runtime note

The CQC and stealth implementation passes were also committed directly to runtime files on `top-shot-v0-1` because the user explicitly requested implementation, not only handoff notes.

Runtime files touched across these passes include:

- `top-shot/src/cqcLab.js`
- `top-shot/src/three/actors3D.js`
- `top-shot/src/stealth.js`
- `top-shot/src/perception.js`
- `top-shot/src/brain.js`
- `top-shot/src/systems.js`
- `top-shot/src/state.js`
- `top-shot/index.html`
- `top-shot/tests/cqcSmoke.js`
- `top-shot/tests/stealthSmoke.js`
- `top-shot/package.json`
