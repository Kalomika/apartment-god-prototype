# Department Log, Apartment Environment

Working branch:

```txt
apartment-environment-cyberpunk-assets
```

## Mission

Create the cyberpunk apartment environment production plan, room structure, prop list, wall and doorway language, lighting rules, and environment manifest.

Do not integrate into runtime code yet.

## Must read first

```txt
apartment-god-production/PRODUCTION_MANAGER_LOG.md
apartment-god-production/DEPARTMENT_START_HERE.md
apartment-god-production/00_ART_BIBLE/
apartment-god-production/REFERENCE_LIBRARY/
```

Report a blocker if the Art Bible or Reference Library is missing.

## Required output folder

```txt
apartment-god-production/01_APARTMENT_ENVIRONMENT/
```

## Required folders and files

```txt
layout/ENV_LAYOUT_PLAN.md
layout/INTEGRATION_NOTES.md
walls_doors_windows/WALL_DOOR_WINDOW_LANGUAGE.md
rooms/ROOM_STYLE_GUIDE.md
props/PROP_ASSET_LIST.md
lighting/LIGHTING_STYLE_GUIDE.md
manifest_environment.json
README.md
```

## Required design coverage

Floor 1:

- living room
- kitchen
- bathroom
- entry
- stairs

Floor 2:

- bedroom
- office
- upstairs bathroom
- hall
- stairs

Future spaces:

- basement / man cave / podcast room
- garage / car bay / travel launch space

## Required prop coverage

Include at minimum:

- couch
- TV
- stereo
- fridge
- stove
- sink
- shower
- toilet
- front door
- dog bowl
- living light
- bedroom light
- stairs
- bed
- laptop desk
- bookshelf
- windows
- phone dock visual concept
- dining table future
- car future
- podcast desk future
- basement couch future
- garage tool rack future

## Cyberpunk visual rules

- dark walls
- blue-grey or charcoal floors
- cyan and magenta neon strips
- lit windows
- readable room boundaries
- tech clutter
- lived-in apartment details
- clear door gaps
- clear collision language
- no cute dollhouse style

## Gameplay safety rules

- Do not make the apartment only a flat background if that breaks object clicks.
- Keep gameplay objects mappable to current object IDs where possible.
- Doors and stairs must remain readable for movement logic.
- Collision should stay logical, not pixel-only.

## Manifest requirements

`manifest_environment.json` must include environment and prop entries with:

```txt
state_id
category
asset_type
room
gameplay_tags
frame_count
frames
anchor_point
collision_notes
interaction_notes
visual_notes
implementation_notes
status
```

## Forbidden

- Do not edit `src/`.
- Do not deploy.
- Do not touch Render settings.
- Do not use a decorative AI map as final gameplay unless collision and interaction mapping is planned.
- Do not make the apartment cute or toy-like.

## Completion checklist

- [ ] Art Bible read
- [ ] Reference Library read
- [ ] environment folder created
- [ ] layout plan created
- [ ] room style guide created
- [ ] wall/door/window language created
- [ ] prop list created
- [ ] lighting guide created
- [ ] manifest valid JSON
- [ ] integration notes written
- [ ] no runtime files changed

## Required report back

```txt
Branch name:
Commit SHA:
Files created:
Art Bible read: yes/no
Reference Library read: yes/no
Environment states created:
Props listed:
Manifest valid JSON: yes/no
Runtime files changed: yes/no
Ready for QA: yes/no
Blockers:
```
