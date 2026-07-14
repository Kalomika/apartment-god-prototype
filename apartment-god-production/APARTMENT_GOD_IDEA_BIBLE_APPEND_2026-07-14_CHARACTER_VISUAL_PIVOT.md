# Idea Bible Append: Character Visual Pivot Away From Procedural Look

Status: ACTIVE_VISUAL_DIRECTION
Date: 2026-07-14

## Kam directive

Kam no longer cares for the current procedural character look. The character visual system has hit its ceiling and should not be treated as the final direction.

The current issue is not only one directional bug. The wider issue is that the human characters do not match the intended top-down anime game art standard. Renderer patches keep producing side-view, front/back, crawling, swimming, or puppet-like artifacts instead of a believable top-down character system.

## New visual rule

Do not keep polishing the current procedural human character look as the target.

The game should move toward a real top-down PNG sprite system where the characters read primarily as:

- top of head
- shoulders
- compact torso/body mass
- readable arms and legs only where appropriate
- direction-appropriate motion
- no side-scroller body logic
- no crawling/swimming rotation hack
- no broad renderer swap that breaks existing activity animations

## Emergency runtime rule

Until the PNG system exists, keep the stable playable human renderer only as a temporary bridge. Do not make broad human renderer replacements on live runtime unless they are separately tested and visually approved.

Immediate bug fixes may continue only when they preserve playability and do not make the procedural look worse.

## Required future work

Create a proper sprite production pass for human characters:

1. Top-down base body design.
2. North/south/east/west directional walk frames.
3. Seated chair/table/desk/couch poses.
4. Sleep/bed side/wake poses.
5. Shower/towel/clothes states.
6. Toilet/standing pee/seated toilet states.
7. Cooking/eating/plate carrying states.
8. Activity-specific poses for arcade, computer, reading, workout, soccer, pool, dog care, and vehicle entry.
9. Manifest-driven frame mapping.
10. Safe runtime fallback until browser-tested.

## Acceptance standard

A future character pass is not complete unless it visually matches true top-down anime room logic and does not rely on side-view body language. The top of the head and shoulders should dominate the read, not front/back puppet bodies.
