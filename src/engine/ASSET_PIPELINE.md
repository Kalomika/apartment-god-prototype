# Top Shot Phaser Asset Pipeline

## Character art target

Use either full sprite sheets or layered body part sprites. Layered rigs are better for this project because they let one top view drawing become reusable animated parts.

Recommended source parts per human:

- head
- neck
- torso
- hips
- upper arm left and right
- forearm left and right
- hand left and right
- thigh left and right
- shin left and right
- foot left and right
- hair
- shirt or jacket layer
- pants layer
- shoes
- carried prop layer

Recommended dog parts:

- body
- head
- muzzle
- ears
- front legs
- rear legs
- tail
- collar

## File layout

```text
public/assets/characters/resident/atlas.json
public/assets/characters/resident/atlas.png
public/assets/characters/girlfriend/atlas.json
public/assets/characters/girlfriend/atlas.png
public/assets/characters/dog/atlas.json
public/assets/characters/dog/atlas.png
public/assets/objects/apartment/atlas.json
public/assets/objects/apartment/atlas.png
public/assets/fx/fx_atlas.json
public/assets/fx/fx_atlas.png
```

## Animation states

Baseline animation states should be:

```text
idle
walk
run
sit
sleep
talk
phone
cook
clean
shower
toilet
carry
pet_dog
throw
fetch
play_pool
play_arcade
lift_weights
treadmill
swim
enter_vehicle
drive_depart
```

Future combat or action states can be added without changing the engine foundation:

```text
attack_light
attack_heavy
block
dodge
hurt
knockdown
recover
interact
pickup
throw_item
```

## Technical rules

- Keep pivots consistent. Shoulders, elbows, wrists, hips, knees, ankles, neck, and head center must line up across parts.
- Export with transparent backgrounds.
- Keep sprite scale consistent across every character.
- Name frames cleanly, for example `resident_walk_0001`.
- Do not bake UI labels into sprites.
- Separate collision/hitbox logic from artwork.
- Use Phaser frame events for timed contact, footsteps, prop swaps, and VFX.

## Current bridge

`src/engine/topShotGame.js` currently uses procedural placeholder rigs. Those placeholders are temporary. The architecture is now ready to swap those shapes for sprite atlases or limb part sprites while keeping the same movement, state, and HUD systems.
