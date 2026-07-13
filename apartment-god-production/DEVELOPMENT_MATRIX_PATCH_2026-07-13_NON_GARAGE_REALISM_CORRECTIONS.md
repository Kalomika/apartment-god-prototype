# Development Matrix Patch, Non Garage Realism Corrections

Date: 2026-07-13
Branch: phaser-migration
Status: NEEDS_TESTING
Runtime files changed: yes
Render playable branch updated: no
Backup branch: backup/phaser-migration-before-realism-corrections-2026-07-13
Commits: 27320a903688daf67a2323ec2b3e5e5b68a6ab98, ba86f156fe88ae87b748b589cbfcb51267a25712, 6716ddb142d07110e60fc6361e3e97470635b5c4, aa5abd2ef0f303d864ce2dfa651ebf875800513c

## Matrix Rows To Update During Canonical Sync

### System Matrix

| System | Current Status | Source Of Truth | Current Notes | Next Required Check |
|---|---|---|---|---|
| Non garage realism correction overlays | NEEDS_TESTING | src/requestedVisualCorrections.js, src/rendering.js, src/world.js, src/renderEntities.js | First guarded flat anime correction pass exists for Main House, Upstairs, and Open Basement only. Floor 3 garage was intentionally skipped. | Browser test boot, mobile readability, pathing, click targets, and all corrected object reads. |
| Lived in activity object pass | NEEDS_TESTING | src/world.js, src/requestedVisualCorrections.js, src/renderEntities.js | Dining table moved down, chairs drawn around table, coffee maker placed against kitchen wall, bathroom sinks added for hygiene actions, fridge visual corrected to one open direction. | Test kitchen route, dining table approach, coffee maker menu, sink actions, and fridge open cue. |
| True top down character and animation quality law | PARTIAL | src/renderEntities.js, src/requestedVisualCorrections.js | Drawn human scale reduced slightly and arcade, console, game, and darts facing cues were added. This is still procedural flat anime fallback, not final modular sprite work. | Test human scale against furniture, porch chairs, bed, couch, and arcade. |

### Object Interaction Matrix

| Object | Area Or Floor | Current Status | Actions | Actor Types | Visual State Needed | Runtime Risk | Test Status |
|---|---|---|---|---|---|---|---|
| Couch | Main House | NEEDS_TESTING | Watch TV, read, relax, nap | Human | Correct L shaped sectional facing TV | Overlay must align with click target and route point | Test couch readability and TV orientation. |
| Dining table | Main House | NEEDS_TESTING | Eat at table, sit at table | Human | Table plus chairs, plate cue | Moved down and widened slightly, pathing must be verified | Test guided eat meal and autonomous meal. |
| Coffee maker | Main House kitchen | NEEDS_TESTING | Make coffee | Human | Wall mounted counter appliance, brew steam | New position may alter approach point | Test click menu and make coffee. |
| Bathroom sink | Main House bathroom | NEEDS_TESTING | Brush teeth, groom, clean | Human | Sink, faucet, toothbrush and grooming cue | New solid object in narrow bathroom may affect route | Test brush teeth and grooming. |
| Upstairs bathroom sink | Upstairs bathroom | NEEDS_TESTING | Brush teeth, groom, clean | Human | Sink, faucet, toothbrush and grooming cue | New solid object in narrow bathroom may affect route | Test brush teeth and grooming upstairs. |
| Shower | Bathrooms | NEEDS_TESTING | Shower, groom fallback | Human | Steam and active shower cue | Must not create privacy overlay outside bathroom | Test downstairs and upstairs shower. |
| Bed | Upstairs bedroom | NEEDS_TESTING | Sleep, nap, waking up, bed together | Human | Covers over sleepers, not exposed bodies on oversized bed | Overlay must not fully hide heads or action bar | Test waking up and sleep. |
| Walk in closet | Upstairs | NEEDS_TESTING | Change clothes, plan weekly outfits | Human | Clothes aisles and storage sides | Overlay only, deeper closet object set still future | Test closet menu and visuals. |
| Stairs | Main, upstairs, basement | NEEDS_TESTING | Use stairs | Human, dog where allowed | Integrated architectural stair depth and darkness | Visual only, floor transfer runtime unchanged | Test floor changes and visual direction. |
| Arcade machine | Open Basement | NEEDS_TESTING | Arcade, arcade together | Human | Gaming light and hand cue, actor faces machine | Pose remains procedural fallback | Test guided arcade action and autonomy fun choice. |

### Animation Matrix

| Animation Or Pose | Current Status | Required Quality Target | Needed Directions | Frame Need | Current Fallback | Test Notes |
|---|---|---|---|---|---|---|
| Read on porch | NEEDS_TESTING | Seated read with visible book | Object facing | Hold loop | Book prop overlay plus existing seated pose | Test actor on porch reading chair. |
| Shower | NEEDS_TESTING | Active shower with steam, not only door slide | Bathroom orientation | Loop plus steam | Shower overlay and existing sliding door sequence | Test steam and clothes pile. |
| Waking up or sleep | NEEDS_TESTING | Covered bodies and realistic blanket proportion | Bed orientation | Wake loop future | Blanket overlay over procedural sleepers | Test two sleepers. |
| Arcade gaming | NEEDS_TESTING | Actor faces cabinet, hands and machine glow visible | Arcade facing | Loop | Seated pose plus hand cue and light cone | Test no sideways standing. |
| Stairs transition | PARTIAL | Architectural depth plus future step animation | Up and down | Entry, step loop, exit future | Visual depth overlay only | Runtime still changes floor quickly. Needs future true stair step animation. |

### Test Matrix Additions

| Test Scenario | Priority | Status | Exact Test |
|---|---|---|---|
| Non garage visual correction pass | Critical | NEEDS_TESTING | Test Main House, Upstairs, and Open Basement only. Confirm couch, dining chairs, coffee maker, bathroom sinks, shower steam, bed covers, closet aisles, stairs, arcade cues, and character scale read better. |
| Garage untouched by this pass | Critical | NEEDS_TESTING | Confirm no new floor 3 garage code, object, or vehicle transition changes were made by this pass. Any garage differences should be attributed to the separate active garage AI, not this pass. |

Canonical merge note:
This matrix patch must be merged into apartment-god-production/DEVELOPMENT_MATRIX.md during the next safe documentation sync. It was created as a sidecar to avoid overwriting concurrent matrix edits from other active AI work.
