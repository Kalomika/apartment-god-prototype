# Prop Asset List

## Prop planning rules

- Every gameplay prop needs a stable asset ID.
- Every clickable prop needs a clear interaction side.
- Every solid prop needs collision notes.
- Every current prop should map to an existing gameplay object where possible.
- Future props should be listed without forcing current gameplay code changes.
- Use realistic top down silhouettes, not cute toy shapes.
- Avoid excessive surface detail that hurts small scale readability.

## Required current and future props

| Asset ID | Gameplay function | Room | Visual notes | Collision notes | Interaction side | Animation support needed | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| PROP_COUCH_01 | Rest, sit, leisure, social action support | Living room | Dark low sectional couch with blue grey fabric, slight worn edges, magenta accent seam | Solid blocker, leave clear approach from TV facing side | Front edge facing TV | Optional sit pose alignment, idle comfort state | Current |
| PROP_TV_01 | Watch TV, fun, ambient glow | Living room | Thin wall mounted or console mounted black screen, cyan screen glow, visible console base | TV stand or wall unit blocks movement, screen itself can be non blocking if wall mounted | Front center, player faces screen | Screen glow states, on, off, static future | Current |
| PROP_STEREO_01 | Music, fun, dance lighting trigger | Living room | Speaker stack or compact smart stereo with magenta LEDs and dark grille | Solid small blocker if floor standing, wall mounted version non blocking | Front or side panel | Music pulse lighting, speaker vibration future | Current |
| PROP_FRIDGE_01 | Hunger, food retrieval | Kitchen | Tall dark smart fridge with cyan vertical handle and small status panel | Solid blocker, align with counter run or wall | Door side facing open kitchen tile | Door open frame future, light spill future | Current |
| PROP_STOVE_01 | Cooking and hunger action | Kitchen | Induction cooktop with low orange blue glow, dark metal counter body | Solid blocker, part of counter run | Front open kitchen side | Stove active glow, steam future | Current |
| PROP_SINK_KITCHEN_01 | Cleaning dishes, water use, future hygiene or chore support | Kitchen | Recessed sink in counter with small cyan faucet light | Solid as part of counter, sink basin visual only | Front open kitchen side | Water ripple, faucet on future | Current |
| PROP_SHOWER_01 | Hygiene, bathing or cleaning action | Bathroom | Compact glass shower cell with blue grey base and cyan safety rim | Solid blocker, keep one clear entry edge | Door edge facing bathroom floor | Steam, water on, privacy fog future | Current |
| PROP_TOILET_BATHROOM_01 | Bladder need action | Bathroom | Compact dark rim toilet with pale blue top highlight | Solid small blocker | Front floor tile | Lid state optional future | Current |
| PROP_FRONT_DOOR_01 | Exit, work, errands, future exterior and travel actions | Entry | Heavy reinforced door with cyan seal, magenta outside spill, access pad | Closed door and frame block movement except logical exit trigger | Interior side centered at threshold | Door open pulse, lock panel future | Current |
| PROP_DOG_BOWL_01 | Dog care, feeding support | Living room or kitchen edge | Low metal bowl with cyan rim, readable circular top shape | Prefer non blocking, small click target | Open floor side | Food fill state, empty state future | Current |
| PROP_LIVING_LIGHT_01 | Room light state | Living room | Ceiling panel or wall sconce with cyan white pool | Non blocking if ceiling, switch panel non blocking | Wall switch or light object click zone | On, dim, off, music pulse future | Current |
| PROP_BEDROOM_LIGHT_01 | Bedroom light state, privacy support | Bedroom | Soft overhead light panel, cyan wall dim strip variant | Non blocking | Wall switch or overhead click area | On, dim, off, privacy dim | Current |
| PROP_STAIRS_01 | Transfer between Floor 1 and Floor 2 | Stairs | Dark stepped bands with cyan tread edges and black rails | Rail sides block, landing interaction tile is open | Landing edge | Floor transfer highlight, access pulse future | Current |
| PROP_BED_01 | Sleep, energy recovery, privacy state | Bedroom | Dark low bed with blue grey blanket mass and soft cyan underframe | Solid blocker, keep one or two approach edges | Open side or foot of bed | Sleep pose alignment, blanket state future | Current |
| PROP_LAPTOP_DESK_01 | Work, computer, creative actions, future remote job loop | Office | Dark desk with laptop glow, cable tray, chair silhouette | Desk and chair block if mapped, keep one approach side | Chair side or front desk edge | Laptop glow, typing idle future | Current |
| PROP_BOOKSHELF_01 | Reading, storage, decoration, future skill or inventory action | Office | Tall dark shelf with varied book and box blocks, low contrast | Solid blocker against wall | Open room side | None required, door or shelf state future | Current |
| PROP_WINDOW_LIVING_01 | Exterior city mood, ambient light | Living room | Thick wall window with cyan city glow and magenta reflection | Non walkable, part of exterior wall collision | Optional click zone inside room if mood action added | Glow day night cycle future | Current |
| PROP_WINDOW_BEDROOM_01 | Bedroom ambient light, privacy support | Bedroom | Privacy glass, cyan city glow, smart blind overlay | Non walkable, part of exterior wall collision | Optional click zone near wall | Blind open closed, dim tint future | Current |
| PROP_PHONE_DOCK_01 | Visual concept for phone notifications and future control hub | Entry or office | Small glowing dock, dark base, cyan charge ring, magenta notification dot | Non blocking or tiny blocker if on desk or shelf | Front face if floor or desk mounted | Notification pulse, dock charge loop future | Future |
| PROP_DINING_TABLE_FUTURE_01 | Eating, social, meal placement future | Kitchen or living room edge | Compact dark table, two chairs, blue grey top, cyan edge strip | Solid table and chairs if mapped, keep path around it | Chair side or table edge | Chair sit state future, meal state future | Future |
| PROP_CAR_FUTURE_01 | Travel launch, garage action, status symbol future | Garage future | Dark compact cyberpunk car seen from top, cyan lane glow, magenta bay reflections | Large solid blocker, keep clear approach at driver side and rear | Driver side or front bay marker | Door open, lights on, start glow future | Future |
| PROP_PODCAST_DESK_FUTURE_01 | Podcast, recording, media creation, social content future | Basement future | Heavy desk with mic arms, mixer, small monitors, cable clusters | Solid blocker, keep chair side clear | Chair side and mixer side | Recording light, waveform screen, mic idle future | Future |
| PROP_BASEMENT_COUCH_FUTURE_01 | Basement lounge, man cave, social rest future | Basement future | Dark worn couch, larger and heavier than living room couch, neon sign spill | Solid blocker, keep front approach | Front edge facing monitors | Sit pose alignment future | Future |
| PROP_GARAGE_TOOL_RACK_FUTURE_01 | Repair, upgrade, garage utility future | Garage future | Wall mounted tool grid with cyan labels and dark silhouettes | Wall mounted non blocking unless workbench protrudes | Front face | Tool highlight state future | Future |
| PROP_BATHROOM_SINK_01 | Hygiene, hand washing, future grooming | Bathroom | Compact vanity with smart mirror and cyan rim | Solid blocker, place against wall | Front open bathroom tile | Faucet on, mirror glow future | Future or current if mapped |
| PROP_UPSTAIRS_BATHROOM_SINK_01 | Secondary hygiene and grooming | Upstairs bathroom | Smaller vanity with blue white mirror glow | Solid blocker | Front open bathroom tile | Faucet on, mirror glow future | Future or current if mapped |
| PROP_COFFEE_TABLE_FUTURE_01 | Living room surface, food or remote placement future | Living room | Low dark table with glass top and subtle cyan edge | Solid low blocker or non blocking depending current path needs | Any clear side | Item placement future | Future |
| PROP_ENTRY_KEY_PANEL_FUTURE_01 | Door control, security, future access action | Entry | Wall pad with cyan biometric line and magenta status dot | Non blocking wall prop | Front of panel | Access pulse, locked state future | Future |
| PROP_BASEMENT_HATCH_FUTURE_01 | Future basement access | Stairs or entry side | Heavy rectangular floor hatch with magenta caution trim and cyan lock pad | Closed solid blocker, open transfer zone later | Hatch edge facing apartment path | Open close, locked pulse future | Future |
| PROP_GARAGE_DOOR_FUTURE_01 | Future garage exterior access and travel boundary | Garage future | Wide segmented roll up door with industrial dark panels | Solid blocker unless travel action opens state | Interior face | Open close, exterior light spill future | Future |
| PROP_GARAGE_WORKBENCH_FUTURE_01 | Repair and upgrade actions future | Garage future | Dark bench, tool lights, small screen | Solid blocker | Front side | Task light, sparks future | Future |
| PROP_AUDIO_RACK_FUTURE_01 | Podcast and music support future | Basement future | Stacked black audio gear with magenta and cyan LEDs | Solid if floor rack, non blocking if wall rack | Front face | LED pulse, audio meter future | Future |
| PROP_WALL_MONITOR_BASEMENT_FUTURE_01 | Media wall and podcast visual support future | Basement future | Large dark wall screens with blue monitor glow | Wall mounted non blocking | Optional front click zone | Screen glow, waveform, off state future | Future |

## Interaction side rules

- Couch, bed, desk, and dining table need approach points outside their collision bounds.
- Fridge, stove, sink, shower, toilet, and bookshelf should use the open room side.
- Windows are optional interaction props. They should never become walkable gaps.
- Stairs must use landing interaction, not the whole stair sprite.
- Front door should use the interior threshold.
- Future car should use driver side or a garage travel marker, not every edge of the car.

## Animation support priorities

First pass:

1. Static prop silhouettes.
2. Light on and off variants for TV, laptop, stove, room lights, window glow.
3. Clear clickable hit zones.

Second pass:

1. TV animated glow.
2. Stereo pulse lighting.
3. Shower water and steam.
4. Stove active state.
5. Laptop typing state.
6. Bed sleep state.

Future pass:

1. Car launch and garage door state.
2. Podcast recording screen and mic state.
3. Basement emergency lighting.
4. Phone dock notification pulse.
5. Smart window privacy states.