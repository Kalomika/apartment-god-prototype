# Idea Bible Append: Compound, Neighborhood, and World View Architecture

Date: 2026-07-14 CT
Branch: phaser-migration
Status: PLANNED / ARCHITECTURE QUESTION ANSWERED
Runtime files changed: no
Render playable branch updated: no
Render settings changed: no

## Kam Directive And Terminology

Kam clarified the language and future map direction:

- A `screen` means one playable section, like the yard screen, garage screen, living room screen, or secret lab screen.
- Directional language means the screen adjacent to that section.
- `Garage screen South` means the screen directly South of the garage screen.
- `Living room screen South` or `main house screen South` means the screen directly South of the main house / living room section.
- Section screens should line up geographically, not just exist as menu destinations.

## Correct Near-Term Outdoor Layout

Keep the corrected adjacency:

```txt
North row: [ Garage West ] [ Main House / Living Room Screen ] [ Secret Lab East ]
South row: [ Driveway West ] [ Front Yard South ]
```

But refine the outdoor design:

### Front Yard South

- Front Yard South is directly South of the main house / living room screen.
- Nothing needs to be South of the front yard screen right now.
- The bottom quarter of the front yard screen should include a fence / bushes / property edge.
- Include a small gate opening in that fence.
- Include a sidewalk/walking path at the bottom of the same front yard screen.
- People can walk through the small gate to the sidewalk.
- Bicycle flow can be: walk bike through front yard to the gate, exit to sidewalk, then mount and ride off.
- Front Yard South should be garden / porch / front walk / small kids hoop frontage, not driveway.

### Driveway West

- Driveway West is directly South of Garage West and West of Front Yard South.
- Driveway West should have a large driveway gate/fence aligned to the same property edge as the front yard fence.
- The bottom section of the driveway screen should include sidewalk spacing that aligns with the front yard screen.
- The sidewalk in front of the driveway should visually cut into / become the driveway apron, like a real sidewalk crossing a driveway.
- Beyond that driveway apron, there should be a separate South road screen later.

### Road Screen

- A separate road screen should be built South of Driveway West.
- The road screen should be a two-way street.
- For now, the road is only needed below the driveway screen, not below the front yard screen.
- Later the road can extend into a larger continuous street/neighborhood system.

## Future Camera View Hierarchy

Kam wants the game to eventually support multiple zoomed-out map views, not only separate hard screens:

1. **Section View**
   - Current default close view.
   - Shows one section/screen at a time.
   - Example: Main House, Garage West, Front Yard South, Driveway West.

2. **Compound View**
   - Zoomed-out view of the whole property compound on the same ground level.
   - Similar idea to Grand Theft Auto style zoom-out where tiny people and cars can be seen moving.
   - Should allow jumping back into individual sections.
   - Upstairs/downstairs/basement still use vertical floor switching.
   - Off-level floors should be dimmed rather than confusingly mixed into the active ground layer.

3. **Neighborhood View**
   - Larger zoomed-out neighborhood view.
   - Shows the street, nearby homes, tiny people/cars moving around, and house context.
   - Should feel more like a Google Maps / top-down city layer than a simple blueprint.

4. **World / City View**
   - Highest macro view.
   - Shows the full city/world boundary.
   - City edge can become the loading/cutoff boundary.
   - This is future state after compound and neighborhood systems are stable.

## Technical Direction

The long-term architecture should shift from `screens as isolated floors` to a compound/world coordinate model:

- The ground compound becomes one larger continuous map.
- Current screens become camera zones or named sections inside that larger map.
- Section buttons and swipes can still exist, but they move the camera to zone targets rather than pretending each area is a separate universe.
- Vehicles and walkers eventually use continuous world coordinates across zones.
- Compound View uses camera zoom-out and culling rather than a separate fake blueprint.
- Neighborhood View and World View should use chunking / culling / simplified tiny sprites so the engine does not try to draw everything at full detail.

## Answer To Engine Question

Yes, this direction is technically possible, but it should be implemented in staged architecture:

1. Lock corrected section adjacency.
2. Add Driveway West road screen South.
3. Refactor outdoor compound sections into a unified coordinate grid.
4. Add camera zoom modes.
5. Add Compound View.
6. Add Neighborhood View.
7. Add City / World View.

Do not brute-force it by drawing a giant unoptimized full-detail city all at once.
