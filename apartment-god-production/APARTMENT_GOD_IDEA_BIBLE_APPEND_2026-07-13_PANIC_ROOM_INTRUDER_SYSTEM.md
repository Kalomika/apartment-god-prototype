# Idea Bible Append: Panic Room And Yearly Intruder System

Status: ACTIVE_APPEND_PENDING_CANONICAL_MERGE
Date: 2026-07-13

## Kam directive

Kam wants the empty upstairs room next to the stairs to become a panic room or danger room. It should have a steel door and house emergency/security supplies. Longer term, once per in-game year, tiers of hostile events should be able to show up to spice the game up. Examples include an alien creature wandering while the family sleeps, burglars, or other threat tiers. The family should automatically initiate danger room protocol: wake up, alarms flash throughout the house, family routes to the panic room, and Kam can choose whether the man goes to handle the threat while the family shelters.

## Safety and gameplay framing

This is a fictional game system. Do not add real-world weapon handling instructions. Keep weapons as locked/security-prop representations or abstracted gameplay choices unless Kam explicitly approves a deeper combat design pass. Do not turn this into real tactical advice.

## Current implementation status

PARTIAL FIRST PASS:

- `src/world.js` now renames the empty upstairs landing room as `panic_room`.
- Added a steel panic room door prop.
- Added a panic alarm panel prop.
- Added a secured defense locker prop.
- Added an emergency supply bench prop.
- `src/bathBedStateOverlays.js` draws the panic room visually while keeping the upstairs stairs intact.

NOT IMPLEMENTED YET:

- No yearly hostile event scheduler.
- No hostile NPCs.
- No automatic danger room protocol.
- No combat/defense resolution.
- No family routing to the panic room.
- No alarm flashing state.

## Required future pass

Build this as its own audited gameplay system after current bathroom, bed, and routing bugs are stable:

1. Add in-game year/day tracking if not already adequate.
2. Define event rarity and tiers.
3. Define threat spawn rules outside or inside the house.
4. Define automatic danger protocol.
5. Route family to panic room with locked door state.
6. Add non-graphic defensive resolution options.
7. Add fail/success consequences and logs.
8. Add browser tests and regression tests.

Status must remain PLANNED/PARTIAL until live browser testing confirms the family can route to the panic room and the event does not break normal autonomy.
