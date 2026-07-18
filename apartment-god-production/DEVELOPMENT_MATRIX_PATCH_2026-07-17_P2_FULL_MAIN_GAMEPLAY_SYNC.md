# Development Matrix Patch, Phaser Migration 2 Full Main Gameplay Sync

Date: 2026-07-17
Branch: phaser-migration-2
Source gameplay commit: 3d255b14ff7225fab44908f280f1db3693da1850
Verified P2 commit: dd166e36aa68a2bd7a87476c0a47f8ea339bdfcb
Status: NEEDS_RENDER_TESTING
Canonical merge pending: yes

## System updates

| System | Status | P2 implementation | Verification | Next required test |
|---|---|---|---|---|
| Native Phaser runtime | AUTOMATED_VERIFICATION_PASSED | `src/main.js` boots `src/phaserMigration2Runtime.js`; Phaser owns native room, object, actor, FX, input, depth, and animation layers. No main Canvas compatibility renderer or offscreen Canvas texture bridge is imported. | Build marker and source assertions passed. | Browser boot, resize, orientation, input, frame recovery, and mobile performance. |
| Current main gameplay synchronization | AUTOMATED_VERIFICATION_PASSED | Current main gameplay files were copied into P2 after preserving protected P2 runtime and assets. | 28/28 suites and 45/45 tests passed; static build passed. | Full browser parity walkthrough. |
| State and save compatibility | NEEDS_RENDER_TESTING | Current `state.js`, `saveSystem.js`, refresh normalization, reset protection, and runtime guards remain connected to P2. | Unit and build verification passed. | Save, reload, refresh, reset, old refresh state, and multiple gameplay states. |
| Actions and object interactions | NEEDS_RENDER_TESTING | Current actions, cooking stages, social actions, bathroom, sleep, wardrobe, cleaning, fetch, travel, and object queues are synchronized. | Current main `actions.js` blob matched P2 after sync. | Guided and autonomous use of every major object. |
| Autonomy and life simulation | NEEDS_RENDER_TESTING | Current autonomy, auto hooks, calendar runtime, career decisions, life quality, needs, tidiness, and game clock run in P2. | Automated tests and build passed. | Several minutes of unattended play at 1x and 3x. |
| Phone, menus, calendar, career HUD | NEEDS_RENDER_TESTING | Current UI, app menu, compact calendar, career schedule line, map controls, front yard, and driveway controls are synchronized. | Source and test verification passed. | Mobile scrolling, every tab, interaction menu placement, save/load, and floor controls. |
| Front yard and driveway | NEEDS_RENDER_TESTING | Floors 6 and 7, portals, porch, garden, road frontage, driveway, garage mouth, and court are installed from current main. | World and route tests passed. | Walk every portal and confirm no blocked thresholds or camera errors. |
| Gate traversal | NEEDS_RENDER_TESTING | Current gate request, animation state, closed-gate crossing guard, and native Phaser gate graphics are active. | Gate regression tests passed. | Approach from both directions with people, dog, car, bike, motorbike, and ATV. |
| Vehicles and offsite travel | NEEDS_RENDER_TESTING | Current vehicle departure, return, driveway transition, offsite job continuity, visible home actor selection, and native P2 transient vehicle adapter are active. | Vehicle and offsite regression tests passed. | Every vehicle, passenger combination, door/garage sequence, away progress, return, and interrupted trip. |
| Arcade | NEEDS_RENDER_TESTING | Current fighter, pong, and racer state machines run in P2 with a native Phaser Graphics display adapter and control-hand alignment. | Gameplay availability test and static build passed. | Play all three modes, solo and together, verify machine alignment and cleanup. |
| Basketball | NEEDS_RENDER_TESTING | Current one-on-one state machine, invitation, court routing, defense, dribbling, shots, rebounds, score, interruption, and native Phaser court/ball/score adapter are active. | Gameplay availability and world tests passed. | Complete games, urgent interruption, missed route, rebounds, score limit, and restart. |
| Pool | NEEDS_RENDER_TESTING | Current perimeter movement, stable stations, cue alignment, ball physics, turn switching, and interruption cleanup are synchronized while P2 retains 8 FPS actor sprites. | Pool route and cleanup tests passed. | Several consecutive solo and together turns with interruptions at every phase. |
| Character animation | NEEDS_RENDER_TESTING | P2 persistent four-direction actors remain protected at 8 FPS and walking still requires coordinate displacement. | Existing P2 animation tests plus full suite passed. | Game-scale review of all actors, dog, direction changes, depth, shadows, and every visible activity. |
| P2 visual quality | NEEDS_CORRECTION | Native ownership is preserved, but generic room panels, category object sprites, and first-pass activity frames remain temporary. | Architecture verified only. | Replace temporary art with authored true top-down room, object, and dedicated activity assets after gameplay browser acceptance. |
| Main Render build | UNCHANGED | `main` remains at `3d255b14ff7225fab44908f280f1db3693da1850`. | No main ref update was performed. | Do not promote P2 until browser testing and Kam approval. |

## Automated verification record

Verification commit: `dd166e36aa68a2bd7a87476c0a47f8ea339bdfcb`

- Repository checks passed.
- Test suites passed: 28 of 28.
- Tests passed: 45 of 45.
- Static build passed.
- Phaser vendor output exists.
- P2 entry point is `bootPhaserMigration2Game`.
- Native runtime marker is `phaser-migration-2-native-full-main-gameplay`.
- Main Canvas compatibility renderer imported by P2: no.
- Offscreen Canvas texture bridge used by P2: no.

## Promotion rule

Keep status `NEEDS_RENDER_TESTING` until P2 receives a branch-specific browser build and passes the full gameplay and mobile checklist. Do not change `main`, Render settings, or deployment configuration during this validation. Before any later main promotion, create a fresh backup of the then-current `main`.
