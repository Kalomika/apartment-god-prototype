# Idea Bible Append: Animation Rebuild Approval Ladder

Status: ACTIVE_VISUAL_DIRECTION
Date: 2026-07-14

## Kam directive

Kam does not want to preserve the old procedural animation system as the visual target. The game itself should not restart from scratch, but the character animation system can start fresh.

The new approved process is a staged animation rebuild:

1. Start with the general true top-down character look first.
2. It is acceptable if the character slides across the floor at this stage, as long as the body reads correctly from true top-down.
3. After Kam approves the static top-down look, add a walk cycle.
4. After Kam approves the walk cycle, add sitting.
5. Continue state by state, approval by approval.

## Required sequence

Do not try to solve every animation state in one broad renderer rewrite.

The sequence should be:

1. Static true top-down character look.
2. North/south/east/west walk cycle.
3. Sitting on chair, couch, stool, desk chair, dining chair.
4. Bed sleep and wake-up side-of-bed states.
5. Shower and towel states.
6. Toilet standing pee and seated toilet states.
7. Eating and plate handling.
8. Computer, arcade, console, reading, phone, and desk activities.
9. Soccer, pool, workout, dog care, and vehicle entry states.

## Visual law

The correct baseline is not side-view front/back characters. The top of the head, shoulders, compact torso mass, and top-down body footprint should dominate the read. No crawling, swimming, chibi, bathroom-sign, side-scroller, puppet, blob, or broad rotation hack is acceptable as the final target.

## Approval rule

Each stage needs visual approval before building the next stage. This prevents the old pattern where one broad patch breaks seating, walking, activity poses, and object alignment at the same time.

## Runtime bridge rule

Until full PNG sprite sheets exist, a simple static top-down runtime character bridge is acceptable. It must be clearly marked as temporary and must not be represented as final animation quality.
