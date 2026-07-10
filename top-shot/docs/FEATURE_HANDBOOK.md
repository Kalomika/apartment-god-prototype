# Top Shot Feature Handbook

This handbook tracks the current game direction and feature intent.

## Current state

Top Shot is a tactical 3D prototype inside `top-shot/`. The current temporary art style is acceptable for now. Continue improving gameplay, tactical behavior, readability, and presentation without throwing away the current style.

## Core fantasy

Two elite fighters enter a desert industrial site. The player acts as a commander/handler giving suggestions, drops, and tactical calls. Fighters should feel skilled, cautious, and self-preserving.

## Camera system

Default is top down.

The camera currently supports:

- Top Down
- High Tactical
- Oblique
- Isometric

The default top-down camera must dynamically zoom:

- Close fighters, camera zooms in.
- Far fighters, camera zooms out.
- Fighters should remain framed and readable.

## Terrain and cover

Current cover types:

- Containers
- Ruined wall blocks
- Warehouse shell
- Generator bank
- Scrap stacks
- Water tank
- Raised catwalk and stairs
- Boulders and rocks

Cover behavior target:

- Fighters should detect incoming fire.
- Fighters should dive or run behind cover.
- Fighters should crouch, lean, or pin to cover.
- Cover should matter more than aggression.

## Combat survival model

The game should avoid quick meaningless deaths. Skilled fighters should be difficult to kill unless a player or AI creates a real tactical advantage.

Current direction:

- Gun damage reduced from earlier build.
- Suppression increases defensive response.
- Sudden incapacitation from shots is rare.
- Fighters try to seek cover while under fire.

Future direction:

- Add armor classes.
- Add better hit locations.
- Add stagger and recovery timing.
- Add panic, retreat, reload, and bandage decisions.
- Add tactical reload behind cover.

## Gunfire VFX

Current direction:

- Muzzle flashes appear at the shooter.
- Impact flashes appear at target or wall hits.
- Tracers show quick bullet direction.
- Suppression effects communicate incoming danger.

Future direction:

- Gun-specific muzzle behavior.
- Pistol single shots.
- Rifle bursts with clustered impact marks.
- Rock and metal particles.
- Persistent debris/shrapnel on the ground.

## Debris and thrown objects future plan

When bullets chip boulders, walls, metal, or concrete, debris should remain on the ground. Later, fighters should be able to pick up debris as emergency weapons.

Debris throw behavior:

- Low stamina cost.
- Low damage.
- Can briefly dizzy or stagger target.
- Gives thrower time to escape, reload, hide, smoke, or reposition.

## Physical separation

Characters must not occupy the exact same space. Future updates should add stronger collision separation between fighters.

Required direction:

- Invisible body radius.
- No stacking into one visual block.
- Melee range should keep bodies separated.
- Hits should cause realistic step-back reactions instead of sliding through each other.

## Animation realism

Current characters still have placeholder procedural 3D movement. Improve toward:

- Footstep-driven displacement.
- Body bob tied to running/walking cadence.
- No sliding across the floor.
- Knockback that looks like a step or stumble.
- Cover pinning animations.
- Wall side lean and back-to-wall poses.

## Deployment

Current direction:

- Fighters deploy in a staggered sequence.
- They have altitude and parachute visuals.
- They no longer simply slide in as flat 2D objects.

Future direction:

- Pass nearer to camera first, then descend into battlefield.
- Stronger parachute drift.
- Landing dust or impact particles.
- Better landing recovery pose.

## Immediate priority backlog

1. True body collision so fighters cannot overlap.
2. Cover pinning and side/back-to-wall poses.
3. Stronger no-standing-in-gunfire survival AI.
4. Gun-specific muzzle and impact patterns.
5. Rock/metal impact particles.
6. Persistent debris pieces.
7. Debris pickup and throw system.
8. Footstep-driven movement with less sliding.
9. Realistic impact step-back and stagger reactions.
10. Camera polish for close combat and edge safety.
