# Top Shot Visual Target and Entrance/Exit States

Purpose: capture Kam's new direction for top-down tactical presentation, Metal Gear Solid style readability, and archetype-specific entrance and victory exit sequences. This is support direction only, not runtime integration.

## Visual target direction

The key visual reference is not just texture quality, it is top-down readability plus believable tactical animation. The Metal Gear Solid style reference helps because the camera is high enough to read the arena, cover objects, patrol routes, and character state at a glance.

Important distinction:

- MGS1-like top-down presentation is achievable as a strong early target.
- PS2-era clarity, like Ico or MGS2 level mood and staging, is a good medium target.
- PS3-level fidelity is possible only with more production effort, optimized models, better lighting, stronger animation clips, and more careful asset pipelines.
- Animation quality should remain the priority over raw graphics.

## Sprite sheet usefulness

The Solid Snake sprite sheet is useful, but not as final art. Use it as an animation inventory reference.

It helps define:

- how many movement states one tactical character may need
- how readable a pose must be from above
- how much personality can come through in small silhouettes
- how transitions should cover standing, crouching, crawling, shooting, hurt, win, lose, ladder, and special actions
- how sprite-era games solved clarity with strong silhouettes and repeated pose families

Do not copy the sprites into the game. Treat them as state coverage and motion language reference.

## Camera and graphics priority

Top Shot should not chase photorealism first. It should chase a polished tactical toybox feel from the top-down camera.

Target order:

1. readable top-down combat silhouettes
2. strong pose states and transitions
3. cover alignment and collision correctness
4. character-specific tactics
5. lighting and material polish
6. higher poly models and better textures

A simpler PS1/PS2-inspired look with excellent animation will feel better than PS3-looking models with stiff movement.

## Archetype entrance states

Each archetype should enter the arena in a distinct way so the match starts with personality immediately.

### Soldier or marine

Entrance: parachutes down into the arena from overhead.

Required pieces:

- parachute canopy appears high above the top-down camera view
- suspension lines visible enough to read
- character descends into the arena
- landing crouch or roll
- canopy collapses or despawns outside gameplay priority
- character transitions into low-ready scan

Reference files:

- `1000032125.jpg`, rectangular ram-air parachute from above
- `1000032124.jpg`, round canopy from above, strong top-down silhouette

### John Wick style gunfighter

Entrance: car drives into or near the arena, he jumps or rolls out, then rises into combat stance.

Required pieces:

- car enters frame briefly
- door swing or implied exit
- combat roll out of car
- rise into pistol low-ready or two-handed stance
- car leaves or parks as possible cover

Exit after win:

- car pulls up
- character dives in or calmly gets in
- car drives away

### Martial artist

Entrance option A: swings in on rope and lands with a roll.

Entrance option B: walks in casually with confidence if a modern version.

Exit after win:

- hops on a bicycle or bike and rides away
- alternatively rope lift or acrobatic exit for a more classic action version

### Ninja

Entrance: smoke pellet appears, smoke blooms, ninja is revealed when smoke clears.

Exit after win:

- smoke pellet pops again
- smoke expands
- ninja disappears

### Archer or rope-based fighter

Entrance: drops in or swings in from a rope.

Exit after win:

- grabs a rope
- rope pulls character upward and out of the scene

### Underground or soil fighter

Entrance: crawls or erupts out of the soil/ground at the bottom or edge of the arena.

Possible archetypes:

- guerrilla fighter
- tunnel fighter
- monster-type brawler
- survivalist
- ambusher

Exit after win:

- dives back into tunnel, ground hatch, sewer, or dust cloud

## Victory exit states

After a win, the match should not just freeze. The winner should perform a short archetype-specific exit beat.

Examples:

- soldier climbs rope ladder and is carried off by helicopter
- John Wick style fighter enters getaway car
- ninja vanishes into smoke
- martial artist bikes away or rope-swings away
- archer grabs extraction rope
- underground fighter sinks back into soil or tunnel

## Animation clip list

Add these to the future animation planning list:

- `entrance_soldier_parachute_descend`
- `entrance_soldier_landing_roll`
- `exit_soldier_rope_ladder_grab`
- `exit_soldier_helicopter_lift`
- `entrance_wick_car_arrive`
- `entrance_wick_roll_from_car`
- `exit_wick_getaway_car`
- `entrance_martial_rope_swing`
- `entrance_martial_landing_roll`
- `exit_martial_bicycle_rideoff`
- `entrance_ninja_smoke_appear`
- `exit_ninja_smoke_disappear`
- `entrance_archer_rope_drop`
- `exit_archer_rope_extract`
- `entrance_soil_crawl_out`
- `exit_soil_sink_back`

## Implementation notes for Codex

- These should be staged as pre-match and post-match state machines.
- Entrances should not interrupt core combat logic once the fighter becomes active.
- Exits should trigger only after match resolution.
- Use simple placeholders first, for example colored canopy mesh, flat car block, smoke particle billboard, rope line, and ladder line.
- The player should be able to understand the archetype before the fight begins.
- Keep the timing short enough that repeat matches do not feel slow.
- Later add skip or fast-forward if match intro repetition becomes annoying.
