# Development Matrix Patch, Full Phaser Parity Integration

Date: 2026-07-17
Branch: phaser-migration
Status: NEEDS_RENDER_TESTING
Canonical merge pending: yes

## System matrix updates

| System | Updated status | Source of truth | Current implementation | Required test |
|---|---|---|---|---|
| Phaser playable clone | NEEDS_RENDER_TESTING | `src/main.js`, `src/phaserParityRuntime.js` | The feature rich branch now boots through Phaser. Existing gameplay modules remain the source of simulation behavior. | Check Render boot, mobile input, every floor, and recovery behavior. |
| Phaser environment parity | NEEDS_RENDER_TESTING | `src/rendering.js`, existing world and object renderers | Current rooms, objects, corrections, vehicle art, dynamic props, and exterior systems are drawn into a Phaser managed environment texture below native actors. | Compare every area with the prior Canvas build and confirm no missing, duplicated, or wrongly ordered object. |
| Phaser foreground parity | NEEDS_RENDER_TESTING | `src/rendering.js` | Blankets, shower foregrounds, lighting, carried items, arcade and basketball overlays, pool cues, HUD, and other actor covering effects are drawn into a transparent Phaser foreground texture. | Test sleep, nap, shower, toilet, arcade, basketball, pool, vehicle occupants, lighting, and carried props. |
| Native Phaser characters | NEEDS_RENDER_TESTING | `src/phaserCharacterAnimationSystem.js`, character sheets, manifest | Persistent Resident, Girlfriend, female fallback, Lab Subject, and Dog sprites replace the old Canvas actor drawings. | Inspect frame crops, scale, depth, shadow, selection, direction, and activity alignment on mobile. |
| Character timing | NEEDS_RENDER_TESTING | `src/phaserCharacterAnimationSystem.js` | Directional walk animation is locked to 8 FPS. Walk requires actual coordinate displacement. | Confirm no running in place and no speed change to simulation movement. |
| Pool movement and game | NEEDS_RENDER_TESTING | `src/poolActivitySystem.js`, `src/poolActivityCleanup.js`, runtime guards | Shooters and waiting actors physically move around explicit table perimeter routes. Stance, cue, ball motion, turns, and interruption cleanup are committed. | Play several solo and together turns, interrupt at each phase, and confirm no table crossing, jitter, or stale cue state. |
| Gameplay parity | NEEDS_RENDER_TESTING | Existing movement, actions, autonomy, vehicle, travel, career, calendar, save, arcade, basketball, dog, and life systems | Full current simulation loop is called from the Phaser scene rather than replaced by a reduced prototype. | Execute the parity audit checklist in `PHASER_PARITY_AUDIT_2026-07-17.md`. |
| Phaser CI | PASSED | `.github/workflows/phaser-parity-ci.yml`, workflow run 29621367374 | Repository checks, 44 unit tests, static build, Phaser vendor output verification, and Phaser entry point verification passed on Node 24. | Preserve passing status after future runtime edits. |
| Main Render build | READY_FOR_SYNC | `main`, `phaser-migration`, current main backups | The full Phaser parity branch has passed automated verification and is ready to replace the partial main state for direct Render browser testing. | Create a fresh backup of current main, synchronize main, then test Render. |

## Character matrix updates

| Profile | Status | Asset | Directional frames | Activity support | Required test |
|---|---|---|---:|---|---|
| Resident | NEEDS_RENDER_TESTING | `assets/sprites/characters/resident/resident_8fps_sheet.svg` | 16 | Walk, sleep, treadmill, swim, weights, heavy bag, pool, seated activities, shower, toilet, basketball transforms | Inspect all states and replace first pass transforms with dedicated sheets where quality is insufficient. |
| Girlfriend and adult female fallback | NEEDS_RENDER_TESTING | `assets/sprites/characters/girlfriend/girlfriend_8fps_sheet.svg` | 16 | Same system coverage with a distinct adult silhouette | Inspect main Girlfriend and Lab Test Woman. |
| Lab Test Subject | NEEDS_RENDER_TESTING | `assets/sprites/characters/lab_test_subject/lab_subject_8fps_sheet.svg` | 16 | Same system coverage with lab identity | Inspect all four directions and lab objects. |
| Dog and dog fallback | NEEDS_RENDER_TESTING | `assets/sprites/characters/dog/dog_8fps_sheet.svg` | 16 | Walk and dog rest base states, existing dog activity systems preserved | Inspect adult anatomy, scale, all directions, soccer, bowl, kennel, bath, petting, and vehicle visibility. |

## Pool animation matrix updates

| Stage | Status | Implementation | Required test |
|---|---|---|---|
| Entry | NEEDS_RENDER_TESTING | One frozen shot stance and separate waiting station are assigned per turn. | Confirm assignments remain stable. |
| Circulation | NEEDS_RENDER_TESTING | Direct simulation moves actor coordinates through perimeter corners outside table collision. | Confirm visible displacement and no table crossing. |
| Alignment | NEEDS_RENDER_TESTING | Walk stops, actor faces cue ball, cue and two hands align. | Inspect from north, south, east, and west. |
| Shot | NEEDS_RENDER_TESTING | Cue thrust and ball velocities begin, separate from the walking loop. | Confirm readable strike and ball motion. |
| Watch | NEEDS_RENDER_TESTING | Shooter remains stationary while balls settle. | Confirm no walking loop. |
| Turn exit | NEEDS_RENDER_TESTING | Previous shooter routes to waiting station and next shooter receives new stance. | Run several consecutive turns. |
| Interruption cleanup | NEEDS_RENDER_TESTING | Runtime guard clears route, velocity, cue, and pool pose when action ends or is stopped. | Interrupt during circulation, alignment, shot, and watch. |

## Promotion rule

Automated verification passed. Before synchronizing `main`, create a fresh backup of its current commit. Do not change Render settings or manually deploy. After synchronization, retain `NEEDS_RENDER_TESTING` until Kam verifies the browser build.
