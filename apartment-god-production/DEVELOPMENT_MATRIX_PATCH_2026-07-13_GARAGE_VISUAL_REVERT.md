# Development Matrix Patch, Garage Visual Revert

This patch file should be merged into `apartment-god-production/DEVELOPMENT_MATRIX.md` during the next safe documentation sync.

## System Matrix Updates

### Vehicles and travel options

Status should remain: NEEDS_TESTING

Replace the current notes that say anime pass 01 production PNGs are active with:

`Anime garage pass 01 was disabled after live QA showed mismatched garage default versus interaction states and a not-fully-true-top-down read. Runtime now falls back to the pre-metallic procedural garage vehicle renderer for SUV and convertible until a complete state-matched garage replacement exists.`

Next required check:

`Test garage default, selected, locked/unlocked, vehicle door/open interaction, departure, return, and mobile presentation. Confirm no metallic anime underlay or production PNG vehicle overlay appears.`

### Sprite replacement pipeline

Status should remain: PARTIAL

Append to current notes:

`Anime visual pass 01 garage assets are retained for audit only and disabled at runtime. Future sprite replacement must be state-complete before integration.`

## Object Interaction Matrix Updates

### Family SUV

Current status: NEEDS_TESTING

Visual State Needed:

`Pre-metallic procedural garage vehicle renderer restored for all runtime states. Anime closed-state PNG disabled until a full state-complete replacement exists.`

Test Status:

`Test locked, unlocked, selected, open door, departure, return, and parked redraw. Confirm no mismatch between idle and interaction garage states.`

### Sports convertible

Current status: NEEDS_TESTING

Visual State Needed:

`Pre-metallic procedural garage vehicle renderer restored for all runtime states. Anime closed-state PNG disabled until a full state-complete replacement exists.`

Test Status:

`Test locked, unlocked, selected, open door, departure, return, and parked redraw. Confirm no mismatch between idle and interaction garage states.`

### Garage floor plate

Current status: REVERTED or NEEDS_CORRECTION

Visual State Needed:

`Anime painterly metallic garage floor underlay disabled. Pre-metallic procedural garage floor is active again.`

Test Status:

`Confirm garage default, selected, and interaction states all use one consistent pre-metallic garage look.`

## Risk Matrix Update

Add or update:

`Partial visual replacement | High | A single state can look improved while interaction/open/selected states fall back to older art, causing a broken mixed-style room. | Do not integrate visual assets unless every required state path is covered or the fallback remains visually consistent.`
