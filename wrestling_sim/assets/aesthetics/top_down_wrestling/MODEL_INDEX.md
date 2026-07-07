# Grapple Gods Top Down Model Index

These are the current pushed visual design models for the Grapple Gods first playable wrestling style.

## Editable vector models

- `svg/rex_sterling_neutral.svg`, Rex Sterling neutral top down wrestler model, blonde hair, light gear.
- `svg/dante_crowe_neutral.svg`, Dante Crowe neutral top down wrestler model, dark hair, dark gear.
- `svg/first_pose_sheet_reference.svg`, first pose sheet for idle, walk, run, crouch, grapple, supine, and seated gimmick poses.
- `svg/rig_parts_reference.svg`, separated body part rig reference with pivots for head, torso, arms, forearms, hands, legs, knees, and boots.
- `svg/topdown_ring_reference.svg`, strict top down ring reference matching the black and white line art target.

## Support files

- `README.md`, visual source of truth for the top down wrestling aesthetic.
- `STYLE_PROMPT.md`, reusable prompt anchor for future GPT visual work.
- `rig_manifest.json`, structured rig requirements and pose requirements.

## Integration notes

The SVG models are source references, not the runtime renderer yet. The next visual implementation pass should either convert these models into Phaser friendly PNG assets or update `wrestling_sim/web_phaser/src/render/WrestlerProxy.js` to match this style more closely through procedural vector drawing.

Runtime should keep the visible body connected even when the internal implementation uses separate rig parts.
