# Daily Training Log

## 2026-07-03

### Repo grounding before art decisions

The active branch did not expose the requested `apartment-god-production/REFERENCE_LIBRARY/` or `apartment-god-production/00_ART_BIBLE/` files through the available GitHub file reads. The day's improvement therefore avoided generating new art and instead locked the style requirement into a manifest: approved reference library first, black or dark gray line art, white or transparent background, true top-down gameplay sprites, and no improvised isometric or high-angle style.

### Current online development notes

- Top-down life sims should keep autonomy legible. Current Sims developer commentary reinforces that fully hidden long-range planning can look broken unless the player can read the reason for the action. Apartment God should keep moment-to-moment needs, object affordances, and visible notifications clear before adding deeper planning.
- AI-assisted sprite creation is strongest when masks, transparent boundaries, anchors, and repeatable state names are locked first. Recent sprite mesh research supports treating segmentation and contour extraction as reliable steps, while artistic vertex or pose decisions still need controlled references.
- Eight-direction movement should be treated as a state contract, not just visual rotation. Each character needs idle and walk at minimum in down, down-right, right, up-right, up, up-left, left, and down-left.

### Retro game study batch

#### Fighting game, Street Fighter II and later 1990s Capcom fighters

Technique learned: clear silhouettes, strict animation states, cancel windows, and readable hit timing matter more than excessive frame count. Every state needs a clean start, active middle, recovery, and return path.

Apartment God application: object-use animations should have readable anticipation, contact, and recovery, even if the first pass is only a few frames.

Mistake to avoid: do not add pretty frames that confuse the action timing or make the player miss what the sim is doing.

#### RPG, Chrono Trigger and Final Fantasy VI

Technique learned: limited sprite sets can feel rich when poses are tied to strong state context, facing direction, and small expressive overlays.

Apartment God application: keep the first atlas disciplined: idle, walk, sit, sleep, interact, phone, eating, pet, fetch, object-use. Add emotion bubbles and notifications rather than trying to draw every possible mood immediately.

Mistake to avoid: do not explode the asset list before anchors and state naming are stable.

#### Adventure game, The Secret of Monkey Island and LucasArts SCUMM-era design

Technique learned: object verbs, readable hotspots, and clear feedback make interaction feel intentional.

Apartment God application: furniture actions should continue to expose clear verbs and smart default choices, while animation states show what was chosen.

Mistake to avoid: do not hide important interaction results inside invisible stat changes.

#### Platformer, Super Mario World and Sonic the Hedgehog

Technique learned: tight movement readability comes from consistent collision footprints and animation that supports motion rather than fighting it.

Apartment God application: sprite art should not change the body anchor or collision circle per frame unless the runtime understands it.

Mistake to avoid: do not let PNG frame size shifts make characters appear to slide or jitter.

#### Shooter, R-Type and Thunder Force style arcade shooters

Technique learned: strong silhouettes against busy backgrounds and predictable projectile or object paths reduce visual confusion.

Apartment God application: white or transparent sprite backgrounds, dark outlines, and clear silhouettes are more important than color dependency because the apartment can become visually dense.

Mistake to avoid: do not rely on tiny color accents to identify characters.

#### Beat 'em up or action game, Streets of Rage 2 and Final Fight

Technique learned: readable facing, simple collision boxes, and clear walk cycles carry a lot of weight in a side or top-down action space.

Apartment God application: today's runtime change quantizes facing to eight directions so the future atlas contract matches movement behavior.

Mistake to avoid: continuous visual rotation can look cheap once real directional sprite art exists.

#### Simulation or life sim, SimCity and The Sims

Technique learned: simulation works when the player understands cause, effect, need pressure, and object consequence.

Apartment God application: keep expanding needs and object states, but surface the reason a resident does something through bubbles, notifications, or phone UI.

Mistake to avoid: do not make autonomy so smart that the player feels like a spectator with no agency.

#### Puzzle or strategy, Tetris and X-COM era tactics

Technique learned: simple rule clarity beats visual density. Players need to predict outcomes from board state.

Apartment God application: future job, bills, cleanliness, and relationship systems should show clear inputs and consequences.

Mistake to avoid: do not bury rules in menus before the apartment loop feels good.

### Applied today

- Converted procedural entity art toward line-art fallback presentation.
- Quantized runtime facing to eight directions, matching the future atlas requirement.
- Added a sprite asset manifest that specifies required directions, minimum idle and walk frames, planned future states, anchors, and visual restrictions.

### Revisit next morning

- Locate or restore the approved reference library on the working branch before any new art generation.
- Choose one character, preferably the dog because it has fewer clothing variables, and create the first transparent PNG atlas using the manifest.
- Add runtime loading for that atlas behind the existing procedural fallback.
