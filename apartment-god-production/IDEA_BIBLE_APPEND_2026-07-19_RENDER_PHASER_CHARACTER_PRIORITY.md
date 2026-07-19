# Idea Bible Append, Render Phaser Character Priority

Date: 2026-07-19
Status: ACTIVE BUG AND ART DIRECTIVE
Branch: repair/render-phaser-migration-conflicts-2026-07-19

Kam's direct Render observations:

- Characters are oriented incorrectly during activities.
- Current characters use visibly outdated sprites and do not represent the strongest graphics the Phaser build should offer.
- Activity progress bars can remain at the beginning instead of advancing.
- The kitchen displays two sinks at once, an older rudimentary sink and a newer diagonal sink. The newer diagonal sink design is preferred.
- The largest visual priority is replacing the outdated character sprites.

Required result:

- Keep one kitchen sink only, using the preferred newer diagonal design.
- Activity progress must advance from the actual current action countdown even when legacy actionTotal data is missing or stale.
- Stationary actors should face the object they are using unless an intentional lying, sleeping, swimming, or weight pose requires another orientation.
- Replace the current generic four frame directional SVG character sheets with materially higher quality production character assets and activity specific states. Do not claim that sprite quality is solved through rotation, scaling, or procedural distortion of walk frames.
- Preserve 8 FPS anime motion direction, no toon outlines, and clear shape, color, and lighting separation.
