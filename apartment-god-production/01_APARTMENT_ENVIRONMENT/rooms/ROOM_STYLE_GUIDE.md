# Room Style Guide

This guide defines the room-by-room production target for the upgraded Apartment God environment.

The apartment should feel adult, lived-in, cramped, cyberpunk, and playable. It should not feel cute, toy-like, mascot-like, or like a cozy cartoon dollhouse.

## Shared room style rules

- Use realistic top-down room and furniture footprints.
- Keep walls dark and structurally clear.
- Keep floors dark blue-grey, charcoal, concrete, or dark worn wood.
- Use cyan and magenta neon as accents only.
- Preserve gameplay silhouettes over decoration.
- Keep clutter readable and mostly near room edges.
- Keep click targets and paths clear.
- Use the Reference Library environment images for mood, not as final art.

## Living room

Mood:

- Main hub for leisure, social behavior, TV, music, and dog care.
- Dark, used daily, slightly messy, not showroom clean.

Palette:

- Night Charcoal walls.
- Worn Concrete or dark painted industrial floor.
- Cyan entertainment wall glow.
- Magenta stereo or music accent.
- Blue TV spill.

Furniture and props:

- Couch.
- TV and console or wall screen.
- Stereo or speaker stack.
- Dog bowl.
- Living light.
- Living window.
- Optional coffee table, takeout, cables, laundry, or controller clutter.

Gameplay objects:

- `ENV_PROP_COUCH_BASE`
- `ENV_PROP_TV_OFF`
- `ENV_PROP_TV_ON`
- `ENV_PROP_STEREO_BASE`
- `ENV_PROP_DOG_BOWL`
- `ENV_PROP_LIVING_LIGHT_BASE`
- `ENV_PROP_WINDOW_LIVING_BASE`

Lighting:

- TV glow only state.
- Cyan room identity strip.
- Magenta music state strip.
- Window glow.

Cyberpunk details:

- Cable raceways.
- Wall display frame.
- Speaker LEDs.
- Scuffed floor path.
- Small personal mess.

Readability notes:

- Keep couch, TV, stereo, and dog bowl distinct.
- Do not let clutter block the path between couch and other rooms.

## Kitchen

Mood:

- Compact utility zone for food, cooking, and cleaning.
- Functional and worn, not cute.

Palette:

- Dark slate or industrial tile floor.
- Blue Black counter bodies.
- Gunmetal appliances.
- Cyan under-cabinet strips.
- Dirty Amber or controlled stove glow.

Furniture and props:

- Fridge.
- Stove.
- Sink.
- Counter run.
- Small appliances.
- Takeout boxes.
- Dining table future.

Gameplay objects:

- `ENV_PROP_FRIDGE_BASE`
- `ENV_PROP_STOVE_BASE`
- `ENV_PROP_KITCHEN_SINK_BASE`
- `ENV_PROP_COUNTER_BASE`
- `ENV_PROP_DINING_TABLE_FUTURE`

Lighting:

- Under-cabinet cyan strip.
- Stove active glow.
- Dirty Amber kitchen practical.
- Low appliance LEDs.

Cyberpunk details:

- Smart fridge status strip.
- Induction cooktop.
- Counter light seam.
- Compact recycler future.

Readability notes:

- Appliance silhouettes must read from top-down.
- Counters must not create fake walkable gaps.

## Bathroom

Mood:

- Cold wet-room utility.
- Clean enough to read, still worn and lived-in.

Palette:

- Dark blue-grey wet tile.
- Cool white bathroom light.
- Cyan mirror trim.
- Minimal magenta service LEDs.

Furniture and props:

- Shower.
- Toilet.
- Bathroom sink or vanity.
- Mirror panel.
- Bottle and towel clutter.

Gameplay objects:

- `ENV_PROP_SHOWER_BASE`
- `ENV_PROP_TOILET_BASE`
- `ENV_PROP_BATHROOM_SINK_BASE`

Lighting:

- Bathroom practical on.
- Dim privacy state.
- Steam state future.

Cyberpunk details:

- Smart mirror rim.
- Drain grate.
- Humidity sensor.
- Small cyan shower safety strip.

Readability notes:

- Keep clutter minimal.
- Shower, toilet, and sink click zones must not overlap.

## Entry

Mood:

- Secure, dark, urban apartment threshold.
- First impression of the cyberpunk apartment.

Palette:

- Deep wall base.
- Dark entry mat.
- Cyan door seal.
- Magenta exterior spill.

Furniture and props:

- Front door.
- Key panel.
- Phone dock visual concept.
- Shoe clutter.
- Shelf or delivery box.

Gameplay objects:

- `ENV_PROP_FRONT_DOOR_BASE`
- `ENV_PROP_PHONE_DOCK_VISUAL`
- `ENV_PROP_ENTRY_KEY_PANEL_FUTURE`

Lighting:

- Door seal cyan.
- Entry overhead practical.
- Exterior magenta spill.

Cyberpunk details:

- Biometric lock pad.
- Apartment number plate.
- Security strip.

Readability notes:

- Door hit area must stay clean.
- Phone dock is future visual support unless runtime maps it.

## Stairs

Mood:

- Industrial transfer object.
- Readable before decorative.

Palette:

- Dark treads.
- Cyan tread edge strips.
- Black rails.
- Magenta side glow where useful.

Furniture and props:

- Stairs.
- Rails.
- Landing trim.
- Basement hatch future.

Gameplay objects:

- `ENV_PROP_STAIRS_BASE`
- `ENV_PROP_BASEMENT_HATCH_FUTURE`

Lighting:

- Cyan tread strips.
- Small landing practical.

Cyberpunk details:

- Embedded tread LEDs.
- Service panel.
- Pipe cluster near wall side.

Readability notes:

- Only the landing side should read as accessible.

## Bedroom

Mood:

- Private rest zone.
- Darker and softer than living room.
- Supports privacy and sleep without hiding gameplay.

Palette:

- Dark matte floor.
- Blue-grey bed mass.
- Cyan low wall strip.
- Magenta privacy accent.
- Window city glow.

Furniture and props:

- Bed.
- Bedroom light.
- Bedroom window.
- Nightstand.
- Clothing clutter.
- Dresser future.

Gameplay objects:

- `ENV_PROP_BED_BASE`
- `ENV_PROP_BEDROOM_LIGHT_BASE`
- `ENV_PROP_WINDOW_BEDROOM_BASE`

Lighting:

- Bedroom practical on.
- Bedroom night state.
- Privacy dim state.
- Window glow only state.

Cyberpunk details:

- Smart blinds.
- Bed frame strip.
- Privacy tint glass.

Readability notes:

- Bed hit area must remain clear in dark states.
- Clutter stays along walls.

## Office

Mood:

- Creative work zone.
- Tech dense but still readable.

Palette:

- Dark tech floor panels.
- Cyan laptop glow.
- Magenta equipment LEDs.
- Gunmetal desk and bookshelf.

Furniture and props:

- Desk.
- Laptop.
- Chair.
- Bookshelf.
- Cable cluster.
- Wall monitors.
- Phone dock future.

Gameplay objects:

- `ENV_PROP_DESK_BASE`
- `ENV_PROP_LAPTOP_OPEN`
- `ENV_PROP_BOOKSHELF_BASE`
- `ENV_PROP_CABLE_CLUSTER`
- `ENV_PROP_PHONE_ON_TABLE`

Lighting:

- Laptop glow.
- Desk strip.
- Screen glow overlay.
- Low task practical.

Cyberpunk details:

- Holo keyboard shape.
- Cable raceways.
- Stacked displays.
- Storage boxes.

Readability notes:

- Desk, chair, laptop, and bookshelf must stay separate in silhouette.

## Upstairs bathroom

Mood:

- Smaller private bathroom.
- Same cold utility language as Floor 1 bathroom.

Palette:

- Dark blue-grey tile.
- Cool white light.
- Cyan mirror trim.
- Minimal magenta indicator lights.

Furniture and props:

- Shower or compact bath.
- Toilet.
- Sink.
- Mirror.
- Towel clutter.

Gameplay objects:

- `ENV_PROP_UPSTAIRS_SHOWER_BASE`
- `ENV_PROP_UPSTAIRS_TOILET_BASE`
- `ENV_PROP_UPSTAIRS_BATHROOM_SINK_BASE`

Lighting:

- Bathroom practical.
- Dim state.
- Mirror rim.

Cyberpunk details:

- Smart mirror.
- Drain grate.
- Small wall sensor.

Readability notes:

- Keep it simpler than living room and office.

## Hall

Mood:

- Quiet Floor 2 circulation spine.
- Low clutter, clear navigation.

Palette:

- Dark walls.
- Blue-grey floor.
- Cyan baseboard guide strip.
- Sparse magenta indicators.

Furniture and props:

- Wall panels.
- Small shelf future.
- Laundry basket future.

Gameplay objects:

- None required for current state.
- Future hall light or wall panel possible.

Lighting:

- Low cyan path strip.
- Room spill from bedroom, office, and bathroom.

Cyberpunk details:

- Service markings.
- Exposed conduit.

Readability notes:

- Hall must not become a clutter tunnel.

## Basement future

Mood:

- Dark man cave, podcast room, utility bunker.
- Denser than main apartment, but still readable.

Palette:

- Dark concrete.
- Cyan edge guide strips.
- Magenta audio LEDs.
- Monitor glow.
- Signal Red emergency future state.

Furniture and props:

- Podcast desk.
- Basement couch.
- Audio rack.
- Wall monitors.
- Utility pipes.
- Storage shelves.

Gameplay objects:

- `ENV_PROP_PODCAST_DESK_FUTURE`
- `ENV_PROP_BASEMENT_COUCH_FUTURE`
- `ENV_PROP_AUDIO_RACK_FUTURE`
- `ENV_PROP_WALL_MONITOR_BASEMENT_FUTURE`

Lighting:

- Podcast mode.
- Lounge mode.
- Emergency future mode.

Cyberpunk details:

- Sound foam panels.
- Neon show sign.
- Server vents.

Readability notes:

- Do not enable as current gameplay until runtime room support exists.

## Garage future

Mood:

- Industrial car bay and travel launch space.
- Larger, open, practical.

Palette:

- Dark concrete.
- Cyan lane guides.
- Magenta bay accents.
- Cool overhead strips.

Furniture and props:

- Car.
- Tool rack.
- Workbench.
- Garage door.
- Charging cable.
- Storage bins.

Gameplay objects:

- `ENV_PROP_CAR_FUTURE`
- `ENV_PROP_GARAGE_TOOL_RACK_FUTURE`
- `ENV_PROP_GARAGE_DOOR_FUTURE`
- `ENV_PROP_GARAGE_WORKBENCH_FUTURE`

Lighting:

- Garage on.
- Travel ready.
- Repair mode.
- Off with safety strip.

Cyberpunk details:

- Vehicle charging pad.
- Diagnostic screen.
- Security shutter lines.

Readability notes:

- Car must read at small scale without excessive part detail.