# Development Matrix Patch, Grounded 8 FPS Characters and Pool Correction

Date: 2026-07-17
Branch: phaser-migration-2
Status: NEEDS_TESTING
Canonical merge pending: yes

## System matrix

| System | Status | Source of truth | Current state | Required test |
|---|---|---|---|---|
| Main Render build | RESTORED | `main`, `backup/main-before-phaser-render-sync-2026-07-17` | Previous Canvas main restored while the rejected migration visuals are corrected. | Confirm Render returns to the previous Canvas game. |
| Phaser character renderer | NEEDS_TESTING | `src/phaserCharacterAnimationSystem.js`, `src/phaserMigration2Runtime.js` | Persistent sprites replace per frame actor destruction and recreation. | Run build, change floors repeatedly, inspect selection, depth, labels, and no leaked actor objects. |
| Character timing | NEEDS_TESTING | `src/phaserCharacterAnimationSystem.js` | Directional walk loops run at exactly 8 FPS. | Verify visual cadence on mobile and desktop without changing simulation speed. |
| Walk truthfulness | NEEDS_TESTING | `shouldPlayWalkForTest`, runtime character sync | Walk animation requires measurable coordinate displacement. Action text alone cannot trigger running in place. | Freeze an actor with a walking label and confirm the sprite remains stationary. |
| Pool choreography | NEEDS_TESTING | `src/poolActivitySystem.js` | Active pool actors use explicit perimeter routes and direct simulation movement outside the table boundary. | Confirm real position changes, table avoidance, stable shot stance, waiting stations, and turn progression. |
| Phaser pool rendering | NEEDS_TESTING | `src/phaserMigration2Runtime.js` | Native graphics show balls, cue line, and cue thrust. | Confirm balls remain aligned with the table and do not duplicate old object art. |
| Character asset manifest | IMPLEMENTED AS DOCUMENTATION | `assets/manifests/phaser-migration-2-character-sprite-manifest.json` | Records sheets, frame grid, direction rows, timing, grounding, pool stages, and known limitations. | Keep synchronized with every sheet replacement. |

## Character matrix

| Character profile | Status | Sheet | Directions | Frames | Target |
|---|---|---|---|---:|---|
| Resident | NEEDS_TESTING | `resident_8fps_sheet.svg` | South, west, east, north | 16 | Adult true top down silhouette, cyberpunk clothing separation, grounded contact. |
| Girlfriend | NEEDS_TESTING | `girlfriend_8fps_sheet.svg` | South, west, east, north | 16 | Adult female top down structure, distinct silhouette, mature clothing masses. |
| Lab Test Subject | NEEDS_TESTING | `lab_subject_8fps_sheet.svg` | South, west, east, north | 16 | Adult test subject, lab clothing identity, same animation integrity as the main actors. |
| Dog | NEEDS_TESTING | `dog_8fps_sheet.svg` | South, west, east, north | 16 | Adult shepherd mix anatomy, readable head, shoulders, torso, four legs, and tail. |

## Pool animation matrix

| Stage | Status | Current implementation | Required test |
|---|---|---|---|
| Entry | NEEDS_TESTING | Frozen shot stance and separate waiting station selected for the current turn. | Confirm stations remain stable during the turn. |
| Circle | NEEDS_TESTING | Actor coordinates move through table perimeter corners at simulation speed. | Confirm no crossing through the table and no running in place. |
| Alignment | NEEDS_TESTING | Movement stops, actor faces cue ball, cue and hands align. | Inspect all four approach directions. |
| Shot | NEEDS_TESTING | Cue thrust and ball velocities start, distinct from walking. | Confirm the cue strike reads clearly and balls visibly move. |
| Watch | NEEDS_TESTING | Shooter remains stationary while balls settle. | Confirm no walk animation during watching. |
| Turn change | NEEDS_TESTING | Previous shooter receives waiting route and next shooter receives a new frozen stance. | Run several turns and confirm no jitter or station fighting. |
| Interruption | NEEDS_TESTING | Pool route clears before normal movement resumes. | Interrupt during circling, alignment, and watching. |

## Promotion blocker

Do not promote `phaser-migration-2` to `main` until the full check, test, build, and isolated browser review pass, and Kam approves the character scale, anatomy, movement cadence, dog design, pool circulation, cue alignment, and turn behavior.
