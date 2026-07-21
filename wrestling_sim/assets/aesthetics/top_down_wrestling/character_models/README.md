# Character Models

This folder exists so the main Grapple Gods implementation pass can find the first two wrestler character source models quickly.

## Primary character source models

- `rex_sterling_neutral.svg`, first playable source model for Rex Sterling.
- `dante_crowe_neutral.svg`, first playable source model for Dante Crowe.

## Usage

These are editable source models for the first playable prototype. They are intended to be used as the basis for either:

1. procedural redraw and tuning inside `wrestling_sim/web_phaser/src/render/WrestlerProxy.js`
2. conversion to Phaser friendly PNG pose assets or sprite sheets later
3. rig reference for top down part separation and pose planning

## Related files

For more supporting references, also check:

- `../references/first_pose_sheet_reference.svg`
- `../references/rig_parts_reference.svg`
- `../references/topdown_ring_reference.svg`
- `../rig_manifest.json`
- `../STYLE_PROMPT.md`
