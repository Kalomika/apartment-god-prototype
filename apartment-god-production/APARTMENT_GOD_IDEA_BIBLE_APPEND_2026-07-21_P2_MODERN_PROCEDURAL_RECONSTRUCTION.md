# Apartment God Idea Bible Append, Modern Procedural Reconstruction

Date: 2026-07-21
Branch: phaser-migration-2
Status: ACTIVE DIRECTIVE, NEEDS_IMPLEMENTATION_AND_BROWSER_CONFIRMATION

Kam's directive:

Phaser Migration 2 must stop displaying the temporary washed, padded, stretched sprite fallback as though it were the game. The target is not a dark Atari-like diagram and not a collection of unrelated icons in oversized empty boxes. The visual translation must begin from the last coherent procedural Apartment God presentation with warm beige floors, readable roofless-house composition, correctly proportioned rooms, and recognizable top-down objects, then modernize that presentation through Phaser without changing the existing gameplay layout.

Required visual result:

- Preserve the exact established room layout and object placement rather than compressing, stretching, or repacking it for replacement art.
- A screenshot must immediately read as a competent modern roofless top-down home, basement, garage, front yard, driveway, backyard, or lab.
- Floors require deliberate material identity, including warm wood, tile, carpet, concrete, grass, pool decking, pavement, and laboratory surfaces where appropriate.
- Walls require readable thickness, boundaries, door openings, windows, thresholds, depth separation, and room-to-room continuity.
- Furniture and fixtures must use their actual gameplay footprint without transparent padding that makes them appear tiny or crushed.
- Vehicles must be believable true top-down vehicles with correct body proportions, glass, tires, lights, and orientation. They must not resemble tiny boats, toys, or generic capsules.
- The basement must read as a real basement recreation and gym space, not large empty black rectangles with tiny icons.
- The backyard and front yard must read as landscaped outdoor spaces with correct lawn, walkway, curb, road, pool, sports, kennel, and boundary relationships.
- Character scale must remain physically coherent with beds, furniture, doors, vehicles, rooms, and activity objects.
- Sleeping requires correct headboard alignment, body orientation, cover placement, bed scale, and exactly one visible actor body.
- Every future authored sprite must be integrated at its intended native footprint and anchor instead of being stretched blindly to an arbitrary object rectangle.
- Temporary generated SVG or PNG art remains fallback only and must never be represented as final quality.

Required mobile behavior:

- A single deliberate tap must activate Up, Down, Map, Phone, floor, and navigation controls. The user must not tap twice because the first touch only focuses an iframe, button, panel, or control.
- A single deliberate swipe must perform one valid neighboring-area navigation where that adjacency exists.
- Navigation controls must not require extra horizontal scrolling simply because the control bar was laid out wider than the device.
- Map and floor navigation must remain reachable without forcing the user to drag through unrelated UI first.
- The full-screen test view must remain usable on Android.

Production strategy:

1. Preserve native Phaser scene ownership and all verified gameplay systems.
2. Replace the failed stretched room and object image presentation with a native Phaser Graphics reconstruction based on the coherent procedural visual language.
3. Draw room architecture and object construction at exact world coordinates and footprints.
4. Use object-specific construction rather than a generic icon bucket.
5. Keep authored asset replacement modular so approved PNG art can replace one object or animation without disturbing the verified layout.
6. Fix touch activation and navigation response independently from visual reconstruction.
7. Do not update main or Render until Kam explicitly requests it.
