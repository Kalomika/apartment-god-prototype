# Idea Bible Append: Front Yard Adjacency Correction

Date: 2026-07-14 CT
Branch: phaser-migration
Status: PLANNED before implementation, then update execution log after code work.
Backup branch: backup/phaser-migration-before-front-yard-alignment-correction-2026-07-14
Runtime files changed at capture time: no
Render playable branch updated: no
Render settings changed: no

## Kam Correction

Kam corrected the first South Front Yard pass because it crammed the house front yard, driveway, and road into one screen without respecting the real adjacency of the property.

## Correct Spatial Logic

- The area directly South of the main house should be the main front yard, not the driveway.
- The main front yard should read more like garden, porch, front walk, landscaping, and a small kids basketball goal area.
- The garage is West of the main house.
- Therefore the driveway should be West of the main front yard, aligned with the garage.
- Sliding from the front yard toward the West side should bring in the driveway/garage-adjacent frontage, not collapse everything into one mixed frontage screen.
- The driveway screen should line up with the garage and should be the place where cars enter/exit the road.

## Corrected Layout Target

```txt
North row:     [ Garage West ] [ Main House ] [ Secret Lab East ]
South row:     [ Driveway West ] [ Front Yard South ]
```

Backyard remains North of Main House. Basement and upstairs remain vertical layers.

## Vehicle Target

Cars should route:

```txt
Garage West -> Driveway West -> Neighborhood Road -> Offscreen
```

Returns should route:

```txt
Neighborhood Road -> Driveway West -> Garage West
```

The main front yard should be primarily a yard/porch/garden/play frontage, not the car driveway area.

## Do Not Lose

This correction replaces the first crammed South frontage model. The first pass should not be treated as final or spatially correct.