# Ongoing Design Log Append: Compound, Neighborhood, and World View Planning

## 2026-07-14 CT, Compound View / Neighborhood View / World View Planning

Status: PLANNED / ARCHITECTURE QUESTION ANSWERED
Branch: phaser-migration
Commit:
- 5197cc58a3637e680e069e2626eed4f93802bc31, Capture compound neighborhood world view directive
Files changed:
- apartment-god-production/IDEA_BIBLE_APPEND_2026-07-14_COMPOUND_NEIGHBORHOOD_WORLD_VIEW.md
- apartment-god-production/ONGOING_DESIGN_LOG_APPEND_2026-07-14_COMPOUND_NEIGHBORHOOD_WORLD_VIEW.md
Runtime files changed: no
Render playable branch updated: no
Backup branch: not required, documentation capture only

Summary:
Kam clarified the terminology for `screen` and described the long-term map hierarchy he wants: section view, compound view, neighborhood view, and world/city view. The immediate corrected frontage design should keep Front Yard South directly below the main house and Driveway West directly below the garage, with a later Road screen South of Driveway West only.

Implementation details:

- Captured Kam's clarified language: a `screen` means one playable section, and directional language means an adjacent section.
- Captured the near-term outdoor layout:
  - Front Yard South remains South of Main House / living room screen.
  - Driveway West remains South of Garage West and West of Front Yard South.
  - No separate screen South of Front Yard South for now.
  - Front Yard South gets a property edge/fence, small gate, and sidewalk/path inside the same screen.
  - Bicycle flow can be walking the bike through the front yard gate to sidewalk, then riding off.
  - Driveway West gets a property gate/fence and sidewalk/apron treatment.
  - A separate two-way Road screen should later be South of Driveway West.
- Captured long-term camera hierarchy:
  - Section View.
  - Compound View, zoomed out full property layer.
  - Neighborhood View, Google Maps style top-down nearby homes/street layer.
  - World / City View, city-scale view with city edge as loading/cutoff boundary.
- Captured technical recommendation: move toward a larger compound coordinate model with camera zones instead of isolated screens only.

Testing performed:

- Documentation capture only.
- No runtime tests needed for this commit.

Testing requested:

- None for this documentation-only capture.

Known risks:

- If implemented by only adding disconnected floors forever, the map will stay difficult to reason about.
- Compound/neighborhood/world views should not be brute-force full-detail maps. They need camera zoom, culling, simplified representations, and staged implementation.

Follow ups:

- Refine current Front Yard South so the bottom quarter is fence/gate/sidewalk rather than road.
- Add Driveway West sidewalk/apron/fence alignment.
- Add Road South of Driveway West as a two-way street when requested.
- Later design a proper compound coordinate/camera zone system before building neighborhood or city view.
