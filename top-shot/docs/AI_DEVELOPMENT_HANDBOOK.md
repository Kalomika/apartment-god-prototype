# Top Shot AI Development Handbook

This file defines how any AI agent must work on Top Shot.

## Absolute project boundary

Top Shot lives in:

```text
top-shot/
```

Do not touch Apartment God root files unless Kam explicitly says, `work on Apartment God`.

Off limits for Top Shot work unless explicitly approved:

```text
src/
index.html
package.json
styles.css
```

Top Shot allowed scope:

```text
top-shot/src/
top-shot/styles.css
top-shot/index.html
top-shot/docs/
top-shot/asset_inbox/
```

## Render target

Top Shot live URL:

```text
https://top-shot-prototype.onrender.com/
```

After every update, provide a cache-busted link using the new commit prefix:

```text
https://top-shot-prototype.onrender.com/?v=<commit-prefix>
```

## Rotating backup rule

Before any meaningful Top Shot update, preserve the current playable state. Use four rotating rollback slots:

```text
backup/top-shot-rollback-1
backup/top-shot-rollback-2
backup/top-shot-rollback-3
backup/top-shot-rollback-4
```

Rotation intent:

1. Move rollback 3 into rollback 4.
2. Move rollback 2 into rollback 3.
3. Move rollback 1 into rollback 2.
4. Copy current `top-shot-v0-1` into rollback 1.

If tool limitations make true branch movement impossible, create a dated backup branch before editing and write the branch name into `top-shot/docs/CHANGELOG.md`.

## Logging rule

Every update must add an entry to:

```text
top-shot/docs/CHANGELOG.md
```

Each entry must include:

- Date and time, preferably Central time.
- Branch edited.
- Backup branch or rollback slot.
- Files changed.
- Feature summary.
- Known risks or things not verified.
- Render link with cache buster after the update.

## Visual direction

Current graphics are acceptable as a temporary 3D prototype style. Do not reset the style back to flat placeholder shapes. Improve gradually while preserving the tactical 3D desert industrial read.

Target feel:

- Metal Gear Solid tactical awareness.
- Splinter Cell cover tension.
- Elite soldiers defending themselves intelligently.
- Realistic cover behavior instead of characters standing in gunfire.
- Camera mostly top down, but smart enough to zoom into close combat.

## Camera rules

Default camera is top down.

Camera controls:

```text
1 = Top Down
2 = High Tactical
3 = Oblique
4 = Isometric
V = cycle
```

Dynamic camera rule:

- When fighters are far apart, camera pulls out enough to keep both readable.
- When fighters are close, camera pushes in so the action is not tiny.
- Fighters should not sit too close to the viewport edge.
- Do not make isometric the default.

## Combat AI rules

Fighters are elite soldiers, not disposable test dummies.

They must:

- Prioritize survival.
- Break line of sight when under fire.
- Dive, crouch, wall lean, pin to cover, or retreat when suppressed.
- Avoid standing in direct gunfire.
- Avoid sharing the exact same physical space.
- Avoid sliding unrealistically when walking or running.
- React strongly after being hit once or twice.
- Retreat, hide, reload, bandage, or reposition when losing an exchange.

## Cover rules

Cover should be a real mechanic, not decoration.

Required behavior:

- Rocks, boulders, crates, walls, containers, tanks, and scrap piles can be cover.
- Fighters should move behind cover when shot at.
- Fighters should pin to cover visually when hiding.
- Fighters should prefer hard cover over empty open space.
- Cover should block line of sight and bullets when possible.

## Gunfire VFX rules

Use the correct terms:

- Muzzle flash at the gun barrel.
- Impact flash or impact spark where the bullet hits.
- Quick tracer or bullet streak in the firing direction.

Do not call muzzle flash a flashbang.

Future gunfire goals:

- Pistols should show separated single flashes.
- Automatic fire should show clustered impacts and multiple quick streaks.
- Impacts on rock/metal should shed particles.
- Broken pieces should remain as debris during the match.
- Debris should eventually become throwable by fighters.

## Movement realism rules

Movement should not feel like sliding tokens.

Improve toward:

- Footsteps driving displacement.
- Body bob while walking/running.
- Realistic knockback on impact, not arcade sliding.
- Physical separation between fighters.
- No two fighters occupying the same exact position.

## Deployment rules

Fighters should not simply slide in from the top of the screen.

Deployment should read like:

- They pass through the camera space or above the field.
- They descend along the viewer depth/Z feeling.
- They parachute or drop one after another.
- They land into the playable site with a clear landing beat.

## Quality rule

Do not regress to rudimentary test visuals or one-off hacked code. Every update should improve or preserve:

- Playability.
- Tactical readability.
- Visual clarity.
- Survival logic.
- Reversible backups.
- Logs and documentation.
