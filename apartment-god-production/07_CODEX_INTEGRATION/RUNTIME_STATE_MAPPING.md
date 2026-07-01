# Runtime State Mapping

Purpose: map current prototype runtime state to future production manifest `state_id` values without changing live behavior.

Runtime files inspected for mapping:

- `src/state.js`
- `src/config.js`
- `src/world.js`
- `src/blueprint.js`
- `src/renderWorld.js`
- `src/renderObjects.js`
- `src/renderEntities.js`
- `src/actions.js`
- `src/movement.js`
- `src/sharedActions.js`
- `src/fetchSystem.js`
- `src/cooking.js`
- `src/music.js`
- `src/training.js`
- `src/ui.js`
- `src/phoneUI.js`

Runtime files changed: no

## Runtime Entity Mapping

| Runtime entity | Runtime type | Future manifest | Resolver key |
| --- | --- | --- | --- |
| `resident` | `person` | `02_MALE_CHARACTER/manifest_male.json` | `id === "resident"` |
| `girlfriend` | `person` | `03_FEMALE_CHARACTER/manifest_female.json` | `id === "girlfriend"` |
| `dog` | `dog` | `05_DOG_CHARACTER/manifest_dog.json` | `type === "dog"` |

## Runtime Pose Buckets

| Current runtime input | Current behavior | Future male state | Future female state | Future dog state | Fallback rule |
| --- | --- | --- | --- | --- | --- |
| `pose: stand`, no action | Procedural standing person or dog | `MALE_IDLE_STAND` | `FEMALE_IDLE_STAND_01` | `DOG_IDLE_STAND` | Keep procedural drawing if frames missing |
| `pose: walk`, normal movement | Procedural walking animation | `MALE_WALK_*` by direction | `FEMALE_WALK_01` | `DOG_WALK_*` by direction | Keep procedural movement drawing until direction and frames pass gates |
| `action: Running` | Faster procedural walk pose | `MALE_RUN_*` by direction | `FEMALE_RUN_01` | `DOG_RUN_*` by direction | Keep procedural drawing if run frames missing |
| `pose: sit` or action contains TV/desk/phone/game/ordering | Procedural sitting person | Context-specific sit, phone, laptop, eating, reading states | Context-specific sit, phone, laptop, eating, reading states | Not applicable | Keep procedural sitting drawing if exact context is missing |
| `pose: sleep` or action contains sleep/nap | Procedural lying person | Bed/couch sleep state by target object | Bed/couch sleep state by target object | Dog sleep state only after dog sleep behavior exists | Keep procedural lying drawing |
| `pose: dance` or music action | Procedural dancing person | No exact solo dance state in male manifest | No exact solo dance state in female manifest | Not applicable | Keep procedural dancing until solo dance assets are approved |
| Social pose/action | Procedural social reach pose | Usually resolved through joint manifest | Usually resolved through joint manifest | Dog social states | Keep current separate procedural sprites until joint/dog assets pass gates |

`*` means future runtime must infer direction from path or velocity. That resolver does not exist yet and was not added in this branch.

## Environment Mapping

| Current runtime source | Current runtime value | Future manifest state ID | Notes |
| --- | --- | --- | --- |
| `state.floor === 0` | Floor 1 canvas rooms | `ENV_FLOOR_1_BASE_LAYOUT` | Keep procedural layout until approved PNG exists |
| `state.floor === 1` | Floor 2 canvas rooms | `ENV_FLOOR_2_BASE_LAYOUT` | Keep procedural layout until approved PNG exists |
| `room.id: living` | Living Room | `ENV_LIVING_ROOM_BASE` | Room-level overlay candidate |
| `room.id: kitchen` | Kitchen | `ENV_KITCHEN_BASE` | Room-level overlay candidate |
| `room.id: bath` | Bathroom | `ENV_BATHROOM_BASE` | Room-level overlay candidate |
| `room.id: entry` | Entry | `ENV_ENTRY_BASE` | Room-level overlay candidate |
| `room.id: stairs` | Stairs | `ENV_STAIRS_BASE` | Also maps stairs props |
| `room.id: bedroom` | Bedroom | `ENV_BEDROOM_BASE` | Room-level overlay candidate |
| `room.id: office` | Office | `ENV_WORKSPACE_BASE` | Runtime calls it office; manifest calls workspace |
| `room.id: bath2` | Upstairs Bath | `ENV_UPSTAIRS_BATHROOM_BASE` | Runtime uses `bath2` |
| `room.id: hall` | Hall | `ENV_HALL_BASE` | Room-level overlay candidate |
| `state.objectState.doorOpen` | Front door open/closed | `ENV_DOORS_OPEN` / `ENV_DOORS_CLOSED` | Must not affect collision rules |
| `state.objectState.openWindows` | Window open/closed glow | `ENV_WINDOWS_NEON_NIGHT` plus window prop states | Preserve current window interaction |
| `state.roomLights` | Lit or dim rooms | `ENV_LIGHTING_BASE_DARK`, `ENV_LIGHTING_KITCHEN_PRACTICAL`, `ENV_LIGHTING_BATHROOM_PRACTICAL` | Keep procedural lighting until layer assets exist |

## Object Mapping

| Runtime object kind | Current object IDs | Future manifest state ID | Fallback rule |
| --- | --- | --- | --- |
| `couch` | `couch` | `ENV_PROP_COUCH_BASE` | Draw procedural couch until approved PNG exists |
| `tv` | `tv` | `ENV_PROP_TV_ON` / `ENV_PROP_TV_OFF` | Preserve runtime TV on/off state |
| `stereo` | `stereo` | `ENV_PROP_STEREO_BASE` | Preserve procedural music indicator |
| `fridge` | `fridge` | `ENV_PROP_FRIDGE_BASE` | Preserve open-door procedural state |
| `stove` | `stove` | `ENV_PROP_STOVE_BASE` | Preserve pan/smoke procedural state |
| `sink` | `sink` | `ENV_PROP_KITCHEN_SINK_BASE` | Procedural fallback |
| `shower` | `shower`, `shower2` | `ENV_PROP_SHOWER_BASE` | Procedural fallback |
| `toilet` | `toilet`, `toilet2` | `ENV_PROP_TOILET_BASE` | Procedural fallback |
| `door` | `door` | `ENV_PROP_FRONT_DOOR_BASE` | Procedural fallback |
| `dog_bowl` | `dog_bowl` | `ENV_PROP_DOG_BOWL` | Procedural fallback |
| `stairs` | `stairs_down`, `stairs_up` | `ENV_PROP_STAIRS_BASE` | Preserve floor transfer behavior |
| `bed` | `bed` | `ENV_PROP_BED_BASE` | Procedural fallback |
| `desk` | `desk` | `ENV_PROP_DESK_BASE`, `ENV_PROP_LAPTOP_OPEN` | Runtime currently combines desk and laptop visual |
| `bookshelf` | dynamic `bookshelf_*` | `ENV_PROP_BOOKSHELF_BASE` | Keep build placement procedural |
| `light` | `light_living`, `light_bedroom` | `ENV_PROP_LIVING_LIGHT_BASE`, `ENV_PROP_BEDROOM_LIGHT_BASE` | Preserve room light toggles |
| `workout` | dynamic `workout_gear` | No exact environment manifest state | Keep procedural workout object |

## Human Action Mapping

| Runtime action ID or text | Current runtime pose | Male state ID | Female state ID | Notes |
| --- | --- | --- | --- | --- |
| `watch_tv`, `comedy`, `horror`, `sports`, `relax` at couch/TV | `sit` | `MALE_SIT_COUCH_IDLE` | `FEMALE_SIT_COUCH_01` | Channel-specific visuals are not in character manifests |
| `nap` at couch | `sleep` | `MALE_SLEEP_COUCH_SIDE` | No exact couch sleep state in female manifest | Keep procedural fallback for girlfriend couch nap |
| `sleep` at bed | `sleep` | `MALE_SLEEP_BED_SOLO_BACK` or randomized solo bed sleep states | `FEMALE_SLEEP_BED_SOLO_BACK_01` or randomized solo bed sleep states | Future resolver should randomize approved holds |
| `desk_work`, `play_game` at desk | `sit` | `MALE_LAPTOP_DESK_TYPING` | `FEMALE_LAPTOP_DESK_TYPING_01` | Preserve gameplay action timing |
| `phone`, `shop`, `Ordering food`, build planning | `sit` | `MALE_PHONE_COUCH_SCROLL` or `MALE_PHONE_STAND_TEXTING` by context | `FEMALE_PHONE_SEATED_01` or `FEMALE_PHONE_STANDING_01` | Use object/room context later |
| `meal` cooking flow: fridge prep | `stand` | `MALE_COOKING_COUNTER_PREP` | `FEMALE_COOK_PREP_COUNTER_01` | Runtime flow starts at fridge |
| `meal` cooking flow: stove | `stand` | `MALE_COOKING_STOVE_IDLE`, `MALE_COOKING_STOVE_STIR` | `FEMALE_COOK_STOVE_01`, `FEMALE_COOK_PAN_STIR_01` | Runtime stove pan/smoke must remain functional |
| `snack` | `stand` | `MALE_EATING_COUCH_IDLE` only if couch context, otherwise no exact standing snack state | `FEMALE_SNACK_STANDING_01` | Male manifest lacks standing snack |
| `bring_food` | `stand` | `MALE_EATING_TABLE_BITE` only if table context exists later | `FEMALE_COOK_SERVE_FOOD_01` | No current table object |
| `shower` | `stand` | `MALE_SHOWER_LOOP` | `FEMALE_SHOWER_SAFE_01` | Safe non-explicit bathroom states only |
| `toilet` | `sit` | `MALE_BATHROOM_TOILET_IDLE` | `FEMALE_TOILET_USE_SAFE_01` | Safe state only |
| `brush_teeth` | `stand` | `MALE_BRUSH_TEETH` | `FEMALE_BRUSH_TEETH_01` | Runtime sink action |
| `groom` | `stand` | `MALE_BATHROOM_MIRROR_IDLE` | `FEMALE_GROOM_MIRROR_01` or `FEMALE_HAIR_GROOM_01` | Use bathroom context |
| `Reading a book` | `sit` | `MALE_READING_COUCH`, `MALE_READING_BED`, or `MALE_READING_DESK` by context | `FEMALE_READ_BOOK_COUCH_01`, `FEMALE_READ_BOOK_BED_01`, or `FEMALE_READ_BOOK_STANDING_01` by context | Bookshelf is dynamic |
| `Training strength` | `stand` | `MALE_STRENGTH_TRAIN` | `FEMALE_STRENGTH_TRAIN_01` | Requires workout gear |
| `Studying intellect`, `Studying money management` | `sit` | `MALE_READING_DESK` or `MALE_LAPTOP_DESK_TYPING` by context | `FEMALE_LAPTOP_DESK_TYPING_01` or reading state by context | No dedicated study state |
| `Practicing cooking` | `sit` or stove action | `MALE_COOKING_COUNTER_PREP` | `FEMALE_COOK_PREP_COUNTER_01` | Runtime currently uses skill timers |
| `Listening to * music` | `dance` | No exact solo male dance state | No exact solo female dance state | Keep procedural dancing |
| `work`, `errand`, `mall`, `movies`, `date` | Hidden offsite | No sprite state | No sprite state | Do not draw sprites while hidden |

## Social And Joint Mapping

| Runtime action ID | Current behavior | Future joint state ID | Fallback rule |
| --- | --- | --- | --- |
| `talk` | Two procedural standing sprites with social pose/action labels | `JOINT_CONVERSATION_STAND` | Keep separate procedural sprites until joint asset exists |
| `kiss` | Two procedural social sprites | `JOINT_KISS_STAND` | Keep current social pose until approved joint PNG exists |
| `cuddle` | Two procedural social sprites | `JOINT_CUDDLE_COUCH_01` or `JOINT_CUDDLE_BED_SIDE_01` by context | Keep current social pose |
| `hands` | Two procedural social sprites | No exact manifest state | Keep procedural fallback until explicit approved state exists |
| `tickle` | Procedural social pose with text | No exact manifest state | Keep procedural fallback |
| `watch_together` | Partner synced to same object action | `JOINT_WATCH_TV_TOGETHER_COUCH` | Do not hide solo sprites unless full joint sprite set is approved |
| `bed_together` | Partner synced to sleep pose | `JOINT_SLEEP_TOGETHER_BED_BACK_SIDE` or `JOINT_CUDDLE_BED_SIDE_01` | Use final QA choice later |
| `intimacy` | Bedroom lights off, safe private action | `JOINT_PRIVATE_MOMENT_SAFE_BED` | Safe non-explicit state only; keep procedural fallback |

## Dog Action Mapping

| Runtime input | Current behavior | Future dog state ID | Notes |
| --- | --- | --- | --- |
| Dog idle | Procedural dog body | `DOG_IDLE_STAND`, `DOG_IDLE_SIT`, `DOG_IDLE_TAIL_SHIFT` | Runtime has no dog idle state selector yet |
| Dog movement | Procedural moving dog | `DOG_WALK_*` or `DOG_RUN_*` by direction | Direction resolver needed |
| `feed_dog` at bowl | Timed dog bowl action by human, dog hunger changes | `DOG_EAT_BOWL`, `DOG_BOWL_IDLE` | Runtime does not move dog to bowl for eating yet |
| `pet` | Human/dog social action | `DOG_PET_STAND_LEAN`, `DOG_COMFORT_NUZZLE` | Pair with male/female pet-dog states when assets exist |
| `train` | Human/dog social action | `DOG_PLAY_BOW`, `DOG_SIT_IDLE`, or `DOG_SIT_LOOK_UP` by future training phase | Current runtime does not expose training phases |
| `fetch_ready` | Dog moves to actor before throw | `DOG_FETCH_WAIT` | Preserve fetch state machine |
| Fetch to ball | Dog runs to thrown point | `DOG_FETCH_RUN` | Current runtime uses `pose: walk` |
| Fetch returning | Dog carries ball position near body | `DOG_FETCH_CARRY` | Ball visual remains procedural unless approved |
| Fetch complete | Dog returns and action ends | `DOG_FETCH_DROP` | Preserve current fun/need effects |

## Resolver Rules For Future Work

1. Resolve candidate manifest state ID from entity ID/type, action ID, target object, room, pose, and movement direction.
2. Check manifest entry exists.
3. Check every required frame file exists.
4. Check every frame is original, transparent PNG, and QA-approved.
5. If any check fails, render the existing procedural prototype visual.
6. Never use Reference Library image files as runtime assets.
7. Never mark generated placeholders as final.
