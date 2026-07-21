# Grapple Gods Top Down Model Index

These are the current pushed visual design models for the Grapple Gods first playable wrestling style.

## Primary source character models

- `character_models/rex_sterling_neutral.svg`, Rex Sterling source model, blonde hair, light gear.
- `character_models/dante_crowe_neutral.svg`, Dante Crowe source model, dark hair, dark gear.

## Runtime playable copies

- `wrestling_sim/web_phaser/public/assets/wrestlers/rex_sterling_neutral.svg`, Phaser runtime copy loaded by `ArenaScene.js`.
- `wrestling_sim/web_phaser/public/assets/wrestlers/dante_crowe_neutral.svg`, Phaser runtime copy loaded by `ArenaScene.js`.

## Supporting vector references

- `svg/first_pose_sheet_reference.svg`, first pose sheet for idle, walk, run, crouch, grapple, supine, and seated gimmick poses.
- `svg/rig_parts_reference.svg`, separated body part rig reference with pivots for head, torso, arms, forearms, hands, legs, knees, and boots.
- `svg/topdown_ring_reference.svg`, strict top down ring reference matching the black and white line art target.

## Support files

- `README.md`, visual source of truth for the top down wrestling aesthetic.
- `STYLE_PROMPT.md`, reusable prompt anchor for future GPT visual work.
- `rig_manifest.json`, structured rig requirements and pose requirements.

## Integration notes

The character model SVGs are now promoted into runtime playable copies. `ArenaScene.js` preloads the runtime SVGs from `public/assets/wrestlers/`, and `WrestlerProxy.js` uses those authored sprites first.

Procedural line drawing remains only as an emergency fallback if the authored SVG texture is missing.
