# Apartment God Object Anime Lighting And Asset Audit

Status: ACTIVE AUDIT
Branch: phaser-migration
Date: 2026-07-13
Purpose: object-by-object control board for moving away from the old blend placeholder style toward true top down anime PNG assets, complete state coverage, and logical time based lighting.

## Current production ruling

The old blend placeholder style is rejected as a quality target. Existing procedural art can remain only as a safe fallback while approved PNGs and full state coverage are built. New replacement work must not stack a corrected object over the old object without clearing or removing the older visual path.

Runtime lighting must follow time and source logic. The first runtime foundation is `src/animeTimeLighting.js`, which uses game time to produce daylight, night, dawn or dusk warmth, sun patches, fixture pools, and mood tinting.

## Global lighting requirements

| Area | Sun source | Artificial source | Current pass | Next asset requirement |
|---|---|---|---|---|
| Main House | Porch, back door, kitchen and bath openings | Room lights | Time lighting foundation added | PNG room plate with anime top down sunlight masks |
| Upstairs | Bedroom, office, bath openings | Room lights | Time lighting foundation added | Extended upstairs layout plate with larger south hall and closet depth |
| Basement | No direct sun | Arcade, fixtures | Time lighting foundation added | PNG basement plate with intentional artificial mood |
| Garage | Overhead door slit and artificial fixture | Garage fixtures future | Anime garage PNG disabled, procedural fallback active | Complete garage PNG set for idle, locked, open, boarding, departure, return |
| Backyard | Open sky | Path and yard lights future | Time lighting foundation added | Full yard PNG plate and object sprites |
| Secret Lab | No sun | Cyan lab fixtures | Time lighting foundation added | Dedicated lab plate when sprite test area becomes production |

## Every current runtime object

Status key: `FALLBACK_VISIBLE` means old procedural art is still live. `PATCHED_OVERLAY` means a correction draw exists but a final PNG is still needed. `NEEDS_PNG_SET` means the object needs one or more real PNG assets before it can be considered production.

### Main House

| Object id | Kind | Current issue or requirement | Status |
|---|---|---|---|
| couch | couch | L sectional direction and old/new overlap must be controlled. Clear plate added before overlay. Needs real L couch PNG set facing TV. | PATCHED_OVERLAY, NEEDS_PNG_SET |
| tv | tv | Needs integrated wall mounted anime screen sprite and room glow state. | FALLBACK_VISIBLE, NEEDS_PNG_SET |
| stereo | stereo | Needs media shelf PNG and powered audio state. | FALLBACK_VISIBLE, NEEDS_PNG_SET |
| bookshelf | bookshelf | Needs readable shelf object, books, and reading activity prop linkage. | FALLBACK_VISIBLE, NEEDS_PNG_SET |
| fridge | fridge | Double-open artifact must stay hidden. Clear plate added before clean fridge overlay. Needs closed/open PNG states. | PATCHED_OVERLAY, NEEDS_PNG_SET |
| stove | stove | Needs cook state, burner glow, pan, and food prep overlays. | FALLBACK_VISIBLE, NEEDS_PNG_SET |
| sink | sink | Needs wash dishes, wash hands, brush teeth support by room. | FALLBACK_VISIBLE, NEEDS_PNG_SET |
| coffee_maker | coffee_maker | Must sit against wall/counter, not floating in kitchen. Clear plate added before wall coffee overlay. | PATCHED_OVERLAY, NEEDS_PNG_SET |
| trash_kitchen | trash_can | Needs real bin sprite and trash level state. | FALLBACK_VISIBLE, NEEDS_PNG_SET |
| shower | shower | Needs steam, active shower state, sliding door timing, privacy without blob clothes. | PATCHED_OVERLAY, NEEDS_PNG_SET |
| bath_sink | sink | Needs grooming, brushing teeth, handwashing states. Clear plate added. | PATCHED_OVERLAY, NEEDS_PNG_SET |
| toilet | toilet | Needs top down toilet object and use state. | FALLBACK_VISIBLE, NEEDS_PNG_SET |
| door | door | Needs front door and porch relation in architecture plate. | FALLBACK_VISIBLE, NEEDS_PNG_SET |
| pet_flap_front | door | Must not be blocked by porch chairs. Needs pet flap sprite. | FALLBACK_VISIBLE, NEEDS_PNG_SET |
| basement_door | stairs | Needs integrated descending stair animation and darkness cue. Clear plate added. | PATCHED_OVERLAY, NEEDS_PNG_SET |
| garage_door | stairs | Needs integrated house to garage door, not generic stair/door box. | FALLBACK_VISIBLE, NEEDS_PNG_SET |
| backyard_door | stairs | Needs back door sprite and daylight logic. | FALLBACK_VISIBLE, NEEDS_PNG_SET |
| dog_bed | dog_bed | Needs real bed, occupied state, dog scale match. | FALLBACK_VISIBLE, NEEDS_PNG_SET |
| dog_bowl | dog_bowl | Needs food/water filled states. | FALLBACK_VISIBLE, NEEDS_PNG_SET |
| dining_table | dining_table | Chairs now exist but set remains overlay. Clear plate added. Needs final table/chair PNG set and seating anchors. | PATCHED_OVERLAY, NEEDS_PNG_SET |
| service_closet | cleaning_closet | Needs cabinet/closet sprite and door open state. | FALLBACK_VISIBLE, NEEDS_PNG_SET |
| vacuum_cleaner | vacuum_cleaner | Needs upright appliance sprite and active vacuum animation. | FALLBACK_VISIBLE, NEEDS_PNG_SET |
| robot_vacuum | robot_vacuum | Needs robot vacuum sprite, dock, active path state. | FALLBACK_VISIBLE, NEEDS_PNG_SET |
| light_living | light | Must drive actual room mood, not just a dot. Time lighting layer now reads light objects. | PARTIAL |
| stairs_down | stairs | Needs step descent/ascent animation. Clear plate added before architectural overlay. | PATCHED_OVERLAY, NEEDS_PNG_SET |

### Upstairs

| Object id | Kind | Current issue or requirement | Status |
|---|---|---|---|
| bed | bed | Needs realistic top down bed scale, covers over sleepers, shared sleep state. | PATCHED_OVERLAY, NEEDS_PNG_SET |
| bedroom_tv | tv | Needs wall TV integrated into bedroom plate. | FALLBACK_VISIBLE, NEEDS_PNG_SET |
| closet | closet | Walk-in closet needs south extension, aisles, racks both sides, and better room depth. | PATCHED_OVERLAY, NEEDS_LAYOUT_PASS, NEEDS_PNG_SET |
| desk | desk | Needs laptop, chair, work pose, and light source state. | FALLBACK_VISIBLE, NEEDS_PNG_SET |
| shower2 | shower | Needs steam, sliding door, and bathroom lighting. | PATCHED_OVERLAY, NEEDS_PNG_SET |
| bath2_sink | sink | Needs grooming and handwashing states. Clear plate added. | PATCHED_OVERLAY, NEEDS_PNG_SET |
| toilet2 | toilet | Needs proper top down toilet sprite and use state. | FALLBACK_VISIBLE, NEEDS_PNG_SET |
| light_bedroom | light | Must drive bedroom night mood and waking scene. | PARTIAL |
| stairs_up | stairs | Needs integrated stair architecture and up/down darkness transition. Clear plate added. | PATCHED_OVERLAY, NEEDS_PNG_SET |

### Basement

| Object id | Kind | Current issue or requirement | Status |
|---|---|---|---|
| basement_stairs_up | stairs | Needs integrated stairwell and ascent light/dark transition. Clear plate added. | PATCHED_OVERLAY, NEEDS_PNG_SET |
| pool_table | pool_table | Needs high quality pool table PNG, balls, rack, cue, active game state. | FALLBACK_VISIBLE, NEEDS_PNG_SET |
| dartboard | dartboard | Needs board sprite and throw animation anchors. | FALLBACK_VISIBLE, NEEDS_PNG_SET |
| arcade_machine | arcade | Character orientation and hand animation need correction. Arcade glow exists but final PNG is needed. | PATCHED_OVERLAY, NEEDS_ANIMATION_SET, NEEDS_PNG_SET |
| game_console | game_console | Needs console furniture, seating, screen glow, gaming animation. | FALLBACK_VISIBLE, NEEDS_PNG_SET |
| basement_couch | couch | Needs real couch sprite and correct TV/console relation. | FALLBACK_VISIBLE, NEEDS_PNG_SET |
| treadmill | treadmill | Needs machine sprite and treadmill run animation. | FALLBACK_VISIBLE, NEEDS_PNG_SET |
| weight_bench | weight_bench | Needs bench, bar up/down A/B frames, lifter alignment. | FALLBACK_VISIBLE, NEEDS_ANIMATION_SET, NEEDS_PNG_SET |
| heavy_bag | heavy_bag | Needs bag sprite, hit loop, body orientation. | FALLBACK_VISIBLE, NEEDS_ANIMATION_SET, NEEDS_PNG_SET |
| light_basement_game | light | Must drive basement mood and arcade wall light. | PARTIAL |

### Garage

| Object id | Kind | Current issue or requirement | Status |
|---|---|---|---|
| garage_entry_door | stairs | Needs proper house door and garage entry path. | FALLBACK_VISIBLE, NEEDS_PNG_SET |
| garage_overhead_door | garage_door | Needs full garage door states and light slit. | FALLBACK_VISIBLE, NEEDS_PNG_SET |
| car_1 | car | Previous anime PNG disabled after half-state mismatch. Needs complete SUV state set, not just closed state. | REVERTED_TO_FALLBACK, NEEDS_FULL_STATE_PNG_SET |
| car_2 | car | Previous anime PNG disabled after half-state mismatch. Needs complete convertible state set. | REVERTED_TO_FALLBACK, NEEDS_FULL_STATE_PNG_SET |
| bike | bike | Needs mounting pose and bike sprite. | FALLBACK_VISIBLE, NEEDS_ANIMATION_SET, NEEDS_PNG_SET |
| motorbike | motorbike | Needs mounting pose and motorbike sprite. | FALLBACK_VISIBLE, NEEDS_ANIMATION_SET, NEEDS_PNG_SET |
| atv | atv | Needs true top down ATV sprite and rider mount. | FALLBACK_VISIBLE, NEEDS_ANIMATION_SET, NEEDS_PNG_SET |

### Backyard

| Object id | Kind | Current issue or requirement | Status |
|---|---|---|---|
| trash_outdoor | outdoor_trash | Needs real outdoor bin and trash state. | FALLBACK_VISIBLE, NEEDS_PNG_SET |
| yard_back_door | stairs | Needs back door sprite and transition relation. | FALLBACK_VISIBLE, NEEDS_PNG_SET |
| pet_flap_yard | door | Needs dog flap and route sprite. | FALLBACK_VISIBLE, NEEDS_PNG_SET |
| soccer_field | soccer_field | Needs field, ball, dog and human play state. | FALLBACK_VISIBLE, NEEDS_PNG_SET |
| swim_pool | swim_pool | Needs pool plate, water animation, swimmer state, towel aftermath. | FALLBACK_VISIBLE, NEEDS_PNG_SET |
| kennel | kennel | Needs actual dog kennel scale and occupied state. | FALLBACK_VISIBLE, NEEDS_PNG_SET |
| dog_bath | dog_bath | Needs tub, water, washing dog animation, not generic petting. | FALLBACK_VISIBLE, NEEDS_ANIMATION_SET, NEEDS_PNG_SET |

### Secret Lab East

| Object id | Kind | Current issue or requirement | Status |
|---|---|---|---|
| lab_bed | bed | Test lab object needs sprite proof state. | FALLBACK_VISIBLE, NEEDS_PNG_SET |
| lab_laptop_desk | desk | Needs animation test desk sprite. | FALLBACK_VISIBLE, NEEDS_PNG_SET |
| lab_pose_chair | couch | Needs pose chair sprite and action anchors. | FALLBACK_VISIBLE, NEEDS_PNG_SET |
| lab_motion_screen | tv | Needs review screen sprite and glow. | FALLBACK_VISIBLE, NEEDS_PNG_SET |
| lab_shower | shower | Needs lab shower pod sprite and steam. | FALLBACK_VISIBLE, NEEDS_PNG_SET |
| lab_toilet | toilet | Needs lab toilet sprite. | FALLBACK_VISIBLE, NEEDS_PNG_SET |
| lab_pool_table | pool_table | Needs lab pool test sprite. | FALLBACK_VISIBLE, NEEDS_PNG_SET |
| lab_game_console | game_console | Needs console station sprite. | FALLBACK_VISIBLE, NEEDS_PNG_SET |
| lab_dartboard | dartboard | Needs dartboard sprite. | FALLBACK_VISIBLE, NEEDS_PNG_SET |
| lab_treadmill | treadmill | Needs treadmill sprite. | FALLBACK_VISIBLE, NEEDS_PNG_SET |
| lab_weight_bench | weight_bench | Needs bar up/down test frames. | FALLBACK_VISIBLE, NEEDS_ANIMATION_SET, NEEDS_PNG_SET |
| lab_heavy_bag | heavy_bag | Needs bag and hit test frames. | FALLBACK_VISIBLE, NEEDS_ANIMATION_SET, NEEDS_PNG_SET |
| lab_light | light | Must drive lab mood through lighting layer. | PARTIAL |

## Next production order

1. Stop visible duplicate overlays by clearing old object footprints before corrected overlays draw.
2. Replace living room couch as a real top down L sectional PNG set with correct TV orientation.
3. Create one complete main house environment PNG plate with separate light masks, not one-off object blobs.
4. Build final upstairs layout extension for south hall and walk-in closet depth, then generate the upstairs plate.
5. Rebuild garage only as a complete state set: idle, locked, unlocked, one-door open, boarding, departure, return, and lock.
6. After each asset commit, audit expected vs created PNGs and frame order before accepting the commit.
