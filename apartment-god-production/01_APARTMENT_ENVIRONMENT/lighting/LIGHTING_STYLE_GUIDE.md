# Lighting Style Guide

## Lighting intent

Lighting should make the cyberpunk apartment readable and playable. Neon is a navigation and mood tool, not decoration that overwhelms the room shapes.

The apartment should hold a dark base with controlled cyan and magenta accents. Gameplay objects remain identifiable in every state.

## Global lighting rules

- Keep wall masses dark in all states.
- Keep floor values blue grey and readable.
- Use cyan for utility, clean paths, room access, and interaction clarity.
- Use magenta for nightlife, entertainment, privacy, future warning, and emotional states.
- Avoid bright full room wash that destroys cyberpunk contrast.
- Avoid excessive small colored lights that clutter mobile readability.
- Every lighting state should preserve prop silhouettes and click zones.

## Neon strip placement

Primary placements:

- Along the base of key interior walls.
- Behind or under gameplay props, only where it clarifies the object.
- At door thresholds.
- Along stair tread edges.
- Under kitchen cabinets.
- Around bathroom mirrors.
- Around office desk equipment.
- Along future garage lane guides.
- Along future basement floor edges and podcast gear.

Placement rules:

- Strips must be thin and directional.
- Do not place strips through collision walls in a way that implies a path.
- Door threshold strips can mark walkable openings.
- Locked future access uses magenta caution trim with a closed blocker.

## Wall glow

Wall glow should be subtle and localized.

Use cases:

- TV glow hitting the living room wall.
- Window glow spilling from exterior walls.
- Cyan path strips along hall or entry walls.
- Magenta privacy glow in bedroom.
- Magenta music pulse near stereo.

Rules:

- Glow should not erase wall boundaries.
- Glow should be strongest near its source and fade quickly.
- Glow should never create fake entrances or hide door gaps.

## Cyberpunk room lighting

Living room:

- TV glow acts as primary low light when active.
- Cyan entertainment wall strip supports room identity.
- Stereo can add magenta pulses in music or dance states.

Kitchen:

- Cyan under cabinet strip is the primary accent.
- Stove adds orange, blue, or white heat glow when active.
- Fridge panel stays low brightness when room is dim.

Bathrooms:

- Blue white overhead light for normal use.
- Cyan mirror rim for dim state.
- Privacy dim should keep shower and toilet readable.

Entry:

- Cyan door seal marks exit.
- Magenta spill at door edge can suggest outside city light.
- Access panel can blink during travel or locked states.

Bedroom:

- Soft overhead light for on state.
- Privacy dim with magenta low strip.
- Window city glow can replace room light in off state.

Office:

- Laptop glow is the core light source.
- Cyan desk strip and magenta equipment LEDs add tech feel.
- Keep bookshelf readable in dim state.

Hall:

- Low cyan baseboard strip guides movement.
- Avoid heavy glow in hall because it is a navigation lane.

Basement future:

- Low ceiling strips.
- Monitor and audio rack glow.
- Emergency red or magenta future state.

Garage future:

- Overhead industrial light strips.
- Cyan lane guides.
- Magenta bay accent near car or charging pad.

## Privacy and dim states for bedroom

Bedroom privacy dim should:

- Reduce overhead light.
- Keep bed silhouette visible.
- Add low magenta or violet edge glow near walls or under bed.
- Preserve door and interaction side visibility.
- Keep window glow soft or tint it darker.

Do not:

- Cover the bed with black shapes.
- Hide the player sprite.
- Make room boundaries unclear.

## TV glow

TV states:

- Off: screen is dark with tiny cyan standby point.
- On: blue cyan rectangular glow, low spill on floor and couch.
- TV only: room light off, TV glow becomes primary light.
- Static future: flickering blue white noise, not too bright.

Gameplay notes:

- TV glow should make TV state obvious.
- Do not let TV glow obscure the couch click area.

## Laptop glow

Laptop states:

- Off: laptop closed or dark screen on desk.
- On: cyan blue screen glow, small pool on desk and chair.
- Work state future: subtle pulsing screen or typing flicker.

Gameplay notes:

- Laptop glow should identify the office work station.
- Keep desk and chair silhouettes distinct.

## Stove glow

Stove states:

- Off: dark induction surface with small status line.
- On: controlled heat glow on burner area.
- Cooking future: steam or small animated light pulse.

Gameplay notes:

- Stove glow should not make the entire kitchen bright.
- Keep fridge and sink visually separate.

## Bathroom light

Bathroom states:

- On: clean blue white light, highest local clarity.
- Dim: mirror rim and floor reflection only.
- Off: minimal room shape from exterior or hall spill.
- Privacy: dim with frosted shower or mirror glow future.

Gameplay notes:

- Shower and toilet must remain readable.
- Door gap must stay visible in dim state.

## Window glow

Window states:

- Normal city glow: cyan blue exterior light.
- Night magenta reflection: subtle magenta line or reflected sign.
- Privacy tint: darker glass with minimal glow.
- Future weather: rain streak reflection, low contrast.

Gameplay notes:

- Windows do not become exits.
- Window glow should not break wall collision read.

## Garage future lights

Garage states:

- Off: minimal emergency strip, car silhouette barely readable.
- On: overhead cool lights and cyan lane guides.
- Travel ready: car bay and garage door accents active.
- Repair mode: workbench task light and tool rack glow.

Gameplay notes:

- Car approach side must stay clear.
- Garage door should remain visually different from front door.

## Basement future lights

Basement states:

- Off: dark concrete, only safety strip visible.
- Lounge: couch and monitor glow.
- Podcast: desk, mic, mixer, and wall monitor lights active.
- Music: magenta and cyan audio pulses.
- Emergency: red or hot magenta warning state, future only.

Gameplay notes:

- Podcast desk and couch must remain clickable.
- Do not let emergency lighting hide the exit route.

# Gameplay lighting states

## LIGHTS_ON

Purpose:

- Normal play clarity.
- All rooms visible.

Rules:

- Room props are readable.
- Neon is visible but secondary.
- Wall masses stay dark.

## LIGHTS_DIM

Purpose:

- Mood, evening, privacy, rest, low energy.

Rules:

- Reduce overhead lighting.
- Keep neon strips and key prop silhouettes visible.
- Keep interaction sides readable.

## LIGHTS_OFF_PRIVACY

Purpose:

- Sleep, privacy, late night state.

Rules:

- Room is dark but not unreadable.
- Use window glow, edge strips, or appliance LEDs for orientation.
- Do not hide required props.

## TV_GLOW_ONLY

Purpose:

- Living room TV watching state.

Rules:

- TV glow becomes primary light.
- Couch remains readable.
- Stereo and dog bowl should stay visible enough if nearby.

## MUSIC_DANCE_LIGHTING

Purpose:

- Stereo action, fun, social, dance state.

Rules:

- Add magenta pulses around stereo and living room edge.
- Optional cyan counter pulse on opposite side.
- Do not strobe full room so hard that gameplay targets disappear.

## EMERGENCY_BAD_EVENT_LIGHTING_FUTURE

Purpose:

- Future negative events, power issue, danger, bad apartment state.

Rules:

- Use red, hot magenta, or flickering amber sparingly.
- Keep exits, stairs, and doorways readable.
- Keep gameplay object hit zones unchanged.
- This is a future state and should not be wired until event logic exists.

## Lighting QA checklist

- Can the player still read walls in every lighting state?
- Are clickable props still identifiable?
- Does neon help movement and room identity?
- Are doorways clearer than decoration?
- Do dim and privacy states keep core gameplay usable?
- Are future basement and garage lights marked as future only?