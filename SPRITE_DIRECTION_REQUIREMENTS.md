# Sprite Direction Requirements

Apartment God character sprites must be black line art on white or transparent backgrounds. The game should not depend on color to read the characters.

## Required movement directions

Every character atlas must support 8-direction movement:

1. Down
2. Down right
3. Right
4. Up right
5. Up
6. Up left
7. Left
8. Down left

This applies to:

- Male resident
- Female resident
- Dog companion
- Future NPCs and visitors

## Minimum animation states

Each character needs at least:

- Idle, 1 frame per direction
- Walk, 4 frames per direction

That means each character needs 40 minimum movement frames:

- 8 idle frames
- 32 walk frames

## Later state targets

After movement is solved, expand each character into:

- Sit
- Sleep
- Phone
- Eat
- Talk
- Object use
- Pet dog
- Train dog
- Fetch
- Carry item
- Door use
- Desk use
- Couch use
- Bed use

## Visual rules

- Top-down 2D line art
- Intricate enough to read anatomy, clothing, limbs, head angle, and direction
- Side and diagonal frames are mandatory so the 2D characters can move convincingly through a 3D-feeling apartment space
- Keep anchors consistent so feet and body placement do not slide between frames
- White or transparent background preferred for atlas creation
- No emoji faces
- No chibi or toy-like bodies
- No color-coded dependency

## Runtime rule

The renderer should choose sprite frames based on movement vector direction. If a real atlas frame is missing, the game may use a temporary fallback, but the fallback must be marked as temporary and cannot be considered final art.
