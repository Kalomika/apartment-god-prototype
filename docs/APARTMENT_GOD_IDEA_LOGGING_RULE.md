# Apartment God Idea Logging Rule

Status: ACTIVE RULE
Date: 2026-07-13

## Rule

Before executing meaningful runtime, visual, gameplay, layout, object, animation, AI, routing, camera, platform, or system work, log the user's current idea or bug directive in a repo-searchable file.

This is required even when the work is going to be done immediately.

## Why

Kam needs any other AI chat or future repo worker to be able to search the repository and recover the exact current intent without relying on chat memory.

## Required behavior

For every meaningful idea or bug batch:

1. Add the directive to `apartment-god-production/APARTMENT_GOD_IDEA_BIBLE.md` or a clearly named append file.
2. Add the execution scope to `apartment-god-production/ONGOING_DESIGN_LOG.md` or a clearly named append file.
3. Update `apartment-god-production/DEVELOPMENT_MATRIX.md` or a clearly named matrix patch when the work touches runtime, visuals, gameplay, AI, objects, layout, controls, or tests.
4. Preserve planned ideas even after implementation. The Bible is for rebuild intent, not just current code state.
5. Do not mark an idea complete unless the implementation was tested at the correct level.
6. If browser behavior is required, use `NEEDS_BROWSER_CONFIRMATION` until Kam or the worker verifies the Render build.

## Scope examples

This rule applies to:

- upstairs layout and future multi-screen sections
- bathroom routing, sink orientation, shower state, toilet poses
- bed wake-up behavior and bed-made state
- character orientation and north-facing sprites
- table food state
- minimize/background simulation behavior
- desktop drag and right-click navigation
- panic room and yearly hostile event ideas
- animation states, PNG assets, and object replacement

## Failure prevention

A code checklist is not enough. The audit must compare the live behavior and visual result to Kam's actual directive. If the code boots but the layout or behavior does not match the intent, it is not complete.
