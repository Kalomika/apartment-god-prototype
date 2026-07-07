# Top Down Wrestling Aesthetic

This folder is the working source of truth for the Grapple Gods wrestler look.

## Target look

Realistic overhead line art, like clean production vector drawings viewed from directly above. The characters should feel like adult wrestlers, not icons, not chibi, not toy figures, not thick comic cutouts, and not the unrelated apartment sim style.

The player should see one cohesive body from the top down: head, broad shoulders, rounded torso, attached arms, hips, boots, and only partial leg information when movement or poses reveal it. The rig can be separated internally into head, torso, upper arms, forearms, hips, upper legs, lower legs, and feet, but the visible read should stay connected and natural.

## Character read

- Broad shoulders and chest from above.
- Head reads mostly as hair crown and top plane, with only small face hints when lying down or tilted.
- Feet and boots are more visible than full shins in standing top down poses.
- Legs reveal more knee and lower leg only when stepping, running, crouching, kicking, grounded, or performing a move.
- Hands can be simplified, but grapples need readable open hands and fist shapes.
- The first test pair is Rex Sterling, blonde powerhouse ace, and Dante Crowe, dark haired brawler.

## Rig logic

Use separated internal parts for animation control, but hide the cut lines through overlap, draw order, and clean silhouettes.

Suggested draw order from back to front:

1. Rear boots and rear lower legs
2. Upper legs and hips
3. Torso core
4. Upper arms
5. Forearms and hands
6. Neck and head
7. Hair, wrist tape, trunks, boot accents, line details

Suggested pivots:

- Head pivots from neck center.
- Torso pivots from sternum or belly center depending on action.
- Upper arms pivot from shoulder caps.
- Forearms pivot from elbows.
- Upper legs pivot from hips.
- Lower legs pivot from knees.
- Boots can be attached to lower legs unless a move needs foot control.

## First gameplay pose set

These are the first poses to support:

- Neutral idle standing
- Walk step
- Run step
- Crouched ready stance
- Grapple or lock up ready stance
- Supine grounded pose
- Seated cross legged gimmick pose

## Forbidden looks

- Chibi
- Mascot proportions
- Oversized heads
- Cute mobile game icons
- Stick figure anatomy
- Thick comic ink
- Full side view wrestling poses
- Unreadable body part cuts
- Generic programmer art boxes
- Rubber wobble or scale pulse animation

## Folder contents

- `STYLE_PROMPT.md`, reusable prompt anchor for future image or sprite work.
- `rig_manifest.json`, structured rig and pose requirements.
- `svg/`, editable vector reference assets that can be used by future GPTs or converted into runtime PNGs later.
