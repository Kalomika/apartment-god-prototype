# Top Shot Combat Pose States

Purpose: capture the uploaded soldier reference positions as animation and AI state targets for Top Shot. These references are for pose language, tactical behavior, silhouette, pacing, and cover logic. They are not final licensed art assets.

Primary direction from Kam:

Animation realism matters more than graphics right now. The characters should feel tactical, autonomous, and reactive before they need to look photoreal. The visual target can move toward realistic tactical soldiers later, but the immediate goal is believable combat posture, readable intent, and strong cover behavior.

## Uploaded reference map

1. `1000032113.jpg`, kneeling scoped rifle aim, low center of gravity, one knee down, weapon braced, alert forward intent.
2. `1000032114.jpg`, standing rifle carry, low ready or patrol posture, body upright, weapon held close, head scanning away from the muzzle.
3. `1000032117.jpg`, prone crawl after a dive or low movement through danger, elbows close, chest low, legs trailing, slow deliberate motion.
4. `1000032116.jpg`, kneeling tactical hold, one knee down, weapon across body, head turned to scan, not actively firing.
5. `1000032115.jpg`, standing aimed fire, squared stance, weapon shouldered, direct threat focus.
6. `1000032118.jpg`, muddy prone crawl, exhausted but moving, elbows driving the body forward, useful for dive recovery and wounded crawl variants.
7. `1000032119.jpg`, wall stack or corner hold, lead character pinned to wall with pistol low, second character behind, hiding and checking the angle before committing.
8. `1000032120.jpg`, corner lean out fire, body partially exposed, weight over lead leg, weapon extended around broken wall.
9. `1000032121.jpg`, seated or low wall cover, back against wall or boulder, weapon angled upward or ready, not shooting.
10. `1000032126.jpg`, trench or boulder cover, low terrain concealment, weapon across chest, head peeking over uneven cover.

## Required combat state set

### 1. Standing patrol and scan

Use when a fighter is not yet directly engaged. The weapon stays close to the body, usually low ready or shoulder supported. The head and chest scan independently so the model does not look like it is sliding around as one stiff object.

Animation needs:

- slow walk, weapon low ready
- cautious stop, scan left and right
- idle weight shift with muzzle discipline
- transition into aim without snapping

References: `1000032114.jpg`, `1000032116.jpg`

### 2. Tactical trot with weapon

Use when the fighter has a destination but expects danger. This is faster than the slow patrol walk but not a full sprint. The weapon should stay controlled, not bounce wildly. This should be the default movement during active combat repositioning.

Animation needs:

- forward trot with rifle angled down or semi-ready
- strafe trot with upper body tracking target
- diagonal trot while aim-lag catches up
- stop into standing aim
- stop into kneel cover

### 3. Standing aim and fire

Use when there is no cover or when the fighter chooses aggression. This should be less safe, higher exposure, but faster to target. It should be used by braver or more skilled characters and punished if they stand in open ground too long.

Animation needs:

- raise weapon to aim
- aim idle with breathing sway
- short burst recoil
- target switch, torso first, feet adjust second
- reload from standing
- flinch while exposed

References: `1000032115.jpg`

### 4. Kneeling aim from partial cover

Use behind low cover, rubble, tables, boulders, barricades, and broken wall chunks. One knee down, torso compact, weapon braced. This gives better accuracy than standing but less mobility.

Animation needs:

- kneel down from stand
- kneel aim idle
- kneel fire
- kneel reload
- kneel scan without shooting
- kneel retreat back into cover

References: `1000032113.jpg`, `1000032116.jpg`

### 5. Wall pinned hide

Use when character is pressed to a wall or vertical cover and is not currently firing. The body should flatten against the wall, shoulders narrow, pistol or rifle held close. This is where John Wick style variation should show strongest, compact, efficient, close to wall, muzzle kept safe until he slices the corner.

Animation needs:

- enter wall cover
- idle wall pinned
- head peek without weapon
- pistol low ready wall hold
- rifle tight wall hold
- exit wall cover

References: `1000032119.jpg`

### 6. Corner lean and shoot

Use when firing around a corner. The body should expose only what is necessary. Different fighters should lean differently. Generic soldiers expose more body. John Wick exposes less, uses tighter pistol mechanics, and returns to cover faster.

Animation needs:

- lean left fire
- lean right fire
- blind check or quick head peek
- shoulder swap for rifle if possible
- return to wall pinned hide
- hit reaction while exposed

References: `1000032119.jpg`, `1000032120.jpg`

### 7. Prone after dive

Use after a dive, knockdown, explosion dodge, or desperate cover entry. The character hits the ground, rolls or slides, then either stays prone, crawls, or rises into kneel.

Animation needs:

- dive forward to prone
- side dive to prone
- impact settle
- roll onto stomach
- prone aim settle
- prone to kneel recovery

References: `1000032117.jpg`, `1000032118.jpg`

### 8. Prone crawl and low movement

Use when suppressed, wounded, moving under fire, or crawling through low cover. This should be slow, vulnerable, and visually tense. The character should not look like a standing walk clip pushed sideways.

Animation needs:

- elbows pull body forward
- knees drag or push in alternating rhythm
- head stays low but scans
- weapon dragged or held close depending on weapon type
- stop into prone aim
- stop into exhausted low cover idle

References: `1000032117.jpg`, `1000032118.jpg`

### 9. Low terrain or boulder cover

Use behind rocks, boulders, trenches, low concrete, broken furniture, and uneven ground. The body can sit, crouch, kneel, or lean depending on cover height.

Animation needs:

- enter low cover
- seated back to cover idle
- low crouch scan
- pop up aim
- sink back down
- scoot along cover edge

References: `1000032121.jpg`, `1000032126.jpg`

### 10. Weapon search and pickup

The arena should have guns hidden around the area like GoldenEye style pickups, but the fighters are autonomous instead of player-controlled. Characters should evaluate nearby weapons based on distance, danger, skill, and personality.

Animation needs:

- spot weapon, head and torso orient first
- cautious approach
- crouch pickup
- quick pickup under fire
- weapon swap
- inspect or chamber action if time allows

Behavior notes:

- Rambo type should be strongest at weapon scavenging, terrain use, and improvisation.
- John Wick type should be strongest at close-quarters weapon switching, pistol handling, and corner work.
- Generic soldier should be more doctrine-based, better at formation and cover discipline than flashy improvisation.

## Character skill variation

### Generic tactical soldier

- Uses cover often.
- Prefers kneel, wall, and low cover states.
- Moves in measured bursts.
- Fires from stable positions.
- Does not expose himself unless forced.

### John Wick style fighter

- Cleaner pistol stance.
- Tighter wall work.
- Faster corner peeks.
- Faster target transitions.
- More likely to advance while aiming.
- Better at close weapon pickups and immediate use.

### Rambo style fighter

- Better with terrain and improvised cover.
- More likely to prone crawl, flank, or use boulders and trenches.
- Better at scavenging weapons.
- Can tolerate dirtier transitions, dives, and aggressive recovery.
- More likely to survive chaos through adaptability rather than clean room tactics.

## Implementation requirements for Codex

Do not edit live runtime until explicitly asked. Prepare these as state targets first.

Recommended implementation path:

1. Confirm the active 3D character format, GLB, VRM, FBX, or procedural Three.js mesh.
2. Confirm skeleton naming and whether it supports humanoid retargeting.
3. Build or import placeholder animation clips for each state.
4. Use `THREE.AnimationMixer` clip blending for movement states.
5. Add IK or aim constraints later for hands, muzzle, spine, and head.
6. Use cover anchors in the arena so poses align to walls, boulders, tables, and corners.
7. Add per-character tactical weights so autonomy chooses different states by personality.

## Minimum viable animation list

These are the first clips needed for a playable proof:

- `stand_idle_low_ready`
- `walk_low_ready`
- `trot_aim_ready`
- `stand_aim_fire`
- `kneel_enter`
- `kneel_idle_aim`
- `kneel_fire`
- `wall_cover_enter`
- `wall_cover_idle`
- `corner_peek_left_fire`
- `corner_peek_right_fire`
- `dive_to_prone`
- `prone_idle`
- `prone_crawl`
- `prone_to_kneel`
- `low_cover_idle`
- `low_cover_pop_fire`
- `weapon_pickup_crouch`

## Quality notes

- Avoid stiff mannequin movement.
- Avoid sliding feet.
- Avoid weapon clipping through walls.
- Avoid one universal soldier pose for every fighter.
- Keep the movement grounded, heavy, tactical, and readable.
- Prioritize believable posture and transitions over high texture quality.
- Randomization should choose from believable variants, not goofy poses.
- Cover should affect body orientation, exposure, fire accuracy, and survival chance.
