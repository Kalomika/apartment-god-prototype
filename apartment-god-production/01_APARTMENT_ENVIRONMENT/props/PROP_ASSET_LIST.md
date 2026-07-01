# Prop Asset List

This file lists environment-owned props for the upgraded Apartment God environment pass.

The Art Bible naming rule says environment props should usually use `ENV_PROP`. This cleanup pass reconciles old prop planning to that naming standard while preserving gameplay purpose and interaction notes.

## Prop planning rules

- Every gameplay prop needs a manifest entry.
- Every clickable prop needs a clear interaction side.
- Every solid prop needs collision notes.
- Every prop should read from top-down gameplay scale.
- Furniture must match adult human scale.
- The dog bowl must match realistic dog scale.
- Avoid cute toy props, sticker icons, and dollhouse furniture.
- Source references are guidance only and must not appear in final prop art.

## Current and future prop list

| Asset ID | Gameplay function | Room | Visual notes | Collision notes | Interaction side | Animation or state support | Phase |
| --- | --- | --- | --- | --- | --- | --- | --- |
| ENV_PROP_COUCH_BASE | Rest, sit, social, TV watching | Living room | Low dark charcoal couch, adult scale, worn fabric, readable top plane | Solid blocker, couch seating uses `seat_center` | Front edge facing TV | Future seated alignment, couch together states | Current |
| ENV_PROP_TV_OFF | TV off state, fun object idle | Living room | Thin dark screen or wall screen, tiny standby light | Wall mounted uses wall collision, console blocks if floor standing | Front center | Pair with TV on state | Current |
| ENV_PROP_TV_ON | TV on, fun, screen glow | Living room | Blue or cyan glow, controlled spill | Same as TV off | Front center | TV glow overlay, future static | Current |
| ENV_PROP_STEREO_BASE | Music, fun, future dance lighting | Living room | Dark speaker or smart stereo with magenta LEDs | Small blocker if floor standing | Front or side panel | Future music pulse overlay | Current |
| ENV_PROP_DOG_BOWL | Dog food or water support | Living room or kitchen edge | Low metal bowl with cyan rim, real dog scale | Prefer non-blocking, small click target | Open floor side | Empty and filled states future | Current |
| ENV_PROP_LIVING_LIGHT_BASE | Living room light state | Living room | Ceiling panel or wall sconce, cool practical | Non-blocking if ceiling | Switch or fixture zone | On, dim, off, TV glow only | Current |
| ENV_PROP_WINDOW_LIVING_BASE | Window glow and mood | Living room | Exterior wall glass with city glow | Non-walkable, part of wall | Optional room-side mood click | Blinds, rain, neon night states | Current |
| ENV_PROP_FRIDGE_BASE | Hunger, food retrieval | Kitchen | Tall gunmetal smart fridge, cyan handle strip | Solid blocker | Door side facing open tile | Door open and light spill future | Current |
| ENV_PROP_STOVE_BASE | Cooking and hunger | Kitchen | Dark induction stove, controlled heat glow | Solid blocker in counter run | Open kitchen side | Cooking active glow, steam future | Current |
| ENV_PROP_KITCHEN_SINK_BASE | Water, cleaning, future chore support | Kitchen | Recessed sink with cyan faucet light | Solid counter blocker | Open kitchen side | Faucet on future | Current |
| ENV_PROP_COUNTER_BASE | Kitchen surface, prep support | Kitchen | Blue-black counter run with scuffed top plane | Solid blocker | Open kitchen side | Counter prep support | Current |
| ENV_PROP_SHOWER_BASE | Hygiene, shower action | Bathroom | Compact glass shower cell, cyan safety strip | Solid blocker, one clear entry | Shower door edge | Water, steam, privacy future | Current |
| ENV_PROP_TOILET_BASE | Bladder action | Bathroom | Compact dark toilet, top-down readable | Small solid blocker | Front tile | Lid state optional future | Current |
| ENV_PROP_BATHROOM_SINK_BASE | Hygiene, wash, mirror support | Bathroom | Compact vanity with smart mirror rim | Solid blocker | Front open tile | Faucet and mirror glow future | Current |
| ENV_PROP_FRONT_DOOR_BASE | Exit, work, errands, future travel handoff | Entry | Heavy reinforced door, cyan seal, access pad | Frame blocks, threshold is trigger | Interior threshold | Lock panel, door pulse future | Current |
| ENV_PROP_PHONE_DOCK_VISUAL | Future notifications or phone hub | Entry or office | Small dark dock, cyan ring, magenta notification dot | Non-blocking or tiny blocker if on shelf | Front face | Notification pulse future | Future |
| ENV_PROP_ENTRY_KEY_PANEL_FUTURE | Security and future door control | Entry | Wall biometric pad, cyan line | Non-blocking wall prop | Panel face | Locked and unlocked pulse future | Future |
| ENV_PROP_STAIRS_BASE | Floor transfer | Stairs | Dark tread bands with cyan edge strips and rail masses | Rails block, landing transfers | Landing edge only | Transfer highlight future | Current |
| ENV_PROP_BASEMENT_HATCH_FUTURE | Future basement access | Stairs or entry | Heavy hatch, magenta caution trim, cyan lock pad | Closed solid blocker | Hatch edge | Open state future | Future |
| ENV_PROP_BED_BASE | Sleep and rest | Bedroom | Dark bed, blue-grey blanket, adult scale | Solid blocker, uses `bed_center` | Open side or foot | Sleep and wake alignment future | Current |
| ENV_PROP_BEDROOM_LIGHT_BASE | Bedroom light and privacy dim | Bedroom | Soft ceiling panel or wall light | Non-blocking | Switch or fixture zone | On, dim, off, privacy | Current |
| ENV_PROP_WINDOW_BEDROOM_BASE | Bedroom city glow and privacy | Bedroom | Privacy glass with cyan or violet city glow | Non-walkable wall element | Optional room-side mood click | Blinds, privacy tint, rain future | Current |
| ENV_PROP_DESK_BASE | Work surface and laptop alignment | Office | Dark desk, top-down work footprint | Solid blocker | Chair side or front | Laptop, phone, reading states | Current |
| ENV_PROP_LAPTOP_OPEN | Laptop interaction and screen glow | Office | Open laptop with cyan screen glow | Non-blocking on desk | Chair side | Typing, idle, screen glow | Current |
| ENV_PROP_BOOKSHELF_BASE | Reading, storage, future skill object | Office | Dark shelf with books and storage blocks | Solid blocker against wall | Open room side | Shelf state future | Current |
| ENV_PROP_PHONE_ON_TABLE | Phone visual or future action | Office or living room | Small phone slab with glow dot | Non-blocking on table or desk | Nearby approach | Phone notification future | Future |
| ENV_PROP_CABLE_CLUSTER | Lived-in tech clutter | Office or living room | Controlled cable raceway, dark lines | Non-blocking unless promoted | None or edge click future | Static only | Current |
| ENV_PROP_LAUNDRY_PILE | Lived-in clutter, future chore | Bedroom, hall, or living room edge | Dark muted laundry mass, not cute | Prefer non-blocking at edges | Open side if chore added | Cleanliness state future | Future |
| ENV_PROP_TAKEOUT_BOX | Lived-in clutter, future cleaning | Living room or kitchen | Muted container, not bright toy colors | Non-blocking edge clutter | Open side if chore added | Cleanliness state future | Future |
| ENV_PROP_UPSTAIRS_SHOWER_BASE | Upstairs hygiene | Upstairs bathroom | Compact shower or bath | Solid blocker | Door edge | Steam future | Current |
| ENV_PROP_UPSTAIRS_TOILET_BASE | Upstairs bladder action | Upstairs bathroom | Compact toilet | Solid blocker | Front tile | Optional lid state | Current |
| ENV_PROP_UPSTAIRS_BATHROOM_SINK_BASE | Upstairs sink and mirror | Upstairs bathroom | Compact vanity | Solid blocker | Front tile | Mirror glow future | Current |
| ENV_PROP_DINING_TABLE_FUTURE | Eating and social future | Kitchen or living edge | Compact dark table and chairs | Solid if mapped, keep path clear | Chair side or table edge | Meal placement future | Future |
| ENV_PROP_CAR_FUTURE | Travel launch and garage object | Garage future | Dark cyberpunk car top view, adult scale | Large solid blocker | Driver side or bay marker | Door, lights, start future | Future |
| ENV_PROP_GARAGE_TOOL_RACK_FUTURE | Repair and upgrade future | Garage future | Wall tool grid, cyan labels, dark silhouettes | Wall mounted non-blocker unless bench attached | Front face | Tool highlight future | Future |
| ENV_PROP_GARAGE_DOOR_FUTURE | Garage exterior boundary | Garage future | Wide segmented roll-up door | Solid blocker unless opened | Interior face | Open, close, exterior glow future | Future |
| ENV_PROP_GARAGE_WORKBENCH_FUTURE | Repair and upgrade future | Garage future | Dark workbench with task light | Solid blocker | Front side | Sparks or repair state future | Future |
| ENV_PROP_PODCAST_DESK_FUTURE | Podcast and media creation future | Basement future | Desk with mic arms, mixer, monitors | Solid blocker, chair side clear | Chair and mixer side | Recording light, waveform future | Future |
| ENV_PROP_BASEMENT_COUCH_FUTURE | Basement lounge future | Basement future | Heavy dark worn couch, larger than living couch | Solid blocker | Front edge | Sit and social future | Future |
| ENV_PROP_AUDIO_RACK_FUTURE | Podcast and music support | Basement future | Stacked black audio gear, magenta LEDs | Solid if floor rack | Front face | Audio meter future | Future |
| ENV_PROP_WALL_MONITOR_BASEMENT_FUTURE | Basement media wall | Basement future | Wall screens with blue monitor glow | Wall mounted non-blocking | Optional front click | Screen glow future | Future |

## Interaction side rules

- Seating props need clear approach and `seat_center` or `bed_center` alignment where appropriate.
- Kitchen props use the open counter side.
- Bathroom props need separated approach tiles.
- Stairs transfer only at the landing edge.
- Windows are optional mood props, never exits.
- Dog bowl stays low, readable, and non-cute.
- Future basement and garage props are listed but not active until runtime support exists.

## Animation and state priorities

Current blueprint priority:

1. Static top-down prop silhouettes.
2. Separate light states for TV, laptop, stove, room lights, windows, and bathroom practicals.
3. Clean collision and interaction notes.
4. No final polished PNGs yet.

Future art priority:

1. TV on and off.
2. Stereo pulse.
3. Stove active.
4. Shower water and steam.
5. Laptop glow.
6. Window rain or blinds.
7. Basement podcast recording.
8. Garage travel ready.