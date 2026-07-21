# Grapple Gods Development Handbook

Last major update: 2026-07-18

This is the standing development rulebook for Grapple Gods. Every AI or developer working on the wrestling game must read it before changing gameplay, visuals, assets, documentation, deployment, or tools.

## 1. Project Identity

Project:

```text
Grapple Gods
```

Repository:

```text
Kalomika/apartment-god-prototype
```

Active branch:

```text
wrestling-sim-foundation
```

Allowed project boundaries:

```text
wrestling_sim/
wrestling_sim/web_phaser/
wrestling_sim/studio/
```

Never:

```text
modify main directly
create a new branch without explicit instruction
touch Kalomika/ai-rpg-engine
touch unrelated apartment game systems
```

## 2. Required Reading

Before meaningful work, inspect the latest branch and read:

```text
wrestling_sim/docs/grapple_gods_development_handbook.md
wrestling_sim/docs/grapple_gods_development_matrix.md
wrestling_sim/docs/grapple_gods_game_direction.md
wrestling_sim/docs/hard_cam_sprite_direction.md
wrestling_sim/docs/top_down_line_art_direction.md
wrestling_sim/docs/top_down_visual_style.md
wrestling_sim/docs/ongoing_design_log.md
wrestling_sim/web_phaser/README.md
wrestling_sim/studio/README.md
```

For runtime work, also inspect the current relevant files, recent commits, assets, and logs. Do not assume an older conversation describes the current branch.

## 3. Active Visual Direction

The active playable presentation is a side view hard cam wrestling game using an authored sprite pipeline.

The previous absolute top down line art experiment is archived.

Do not reintroduce top down characters, top down ring composition, overhead symbols, or procedural overhead wrestler proxies into the active playable direction.

The current approval sequence is:

```text
1. Approve the hard cam arena and ring.
2. Stage the ring farther back in the arena.
3. Confirm foreground crowd depth and ring readability.
4. Approve the 8 fps sprite cadence.
5. Add wrestler sprite cycles only after ring approval.
```

Current ring requirements:

```text
side view hard cam
ring pushed farther back
white canvas
black ropes
visible turnbuckles
corner posts
front apron
crowd and floor framing
no wrestlers during ring approval
8 fps authored frame cadence
```

## 4. Game Identity

Grapple Gods is a sandbox automated wrestling RPG and booking sim.

The player is the general manager, booker, promoter, and sometimes ringside coach. Wrestlers act autonomously based on personality, stamina, damage, confidence, relationships, ring position, match rules, and career goals.

Core design question:

```text
Why did my wrestler make that choice?
```

The design should not revolve around manual combat inputs or pixel perfect button execution.

## 5. Runtime and Studio Separation

Playable browser game:

```text
wrestling_sim/web_phaser/
```

Internal development environment:

```text
wrestling_sim/studio/
```

The playable game is where match flow is tested.

The Studio is where assets, camera blocking, animation frames, ring placement, AI decisions, move states, collision, and performance are inspected.

Studio changes must not silently mutate production art or runtime values. Approval values are transferred into production through an intentional source commit.

## 6. Shared Asset Rule

The Studio should inspect the same assets used by the playable game.

Shared runtime asset root:

```text
wrestling_sim/web_phaser/public/
```

Do not create duplicate ring, crowd, arena, wrestler, or animation assets inside the Studio without a documented reason. Duplicate assets create drift and make approvals unreliable.

## 7. Current Studio Module

Studio v0.1 provides the Hard Cam Ring Viewer.

It supports:

```text
runtime ring frame playback
foreground crowd frame playback
8 fps cadence
manual frame stepping
ring push back preview
vertical staging preview
inspection zoom
composition grid
safe frame overlay
layer toggles
mobile responsive review
```

The push back and zoom controls are review controls. They do not alter production assets automatically.

## 8. Development Matrix and Logging

Every meaningful feature, asset pass, bug fix, design pivot, blocker, or revert must update:

```text
wrestling_sim/docs/grapple_gods_development_matrix.md
wrestling_sim/docs/ongoing_design_log.md
```

Use honest statuses:

```text
PLANNED
IN_PROGRESS
IMPLEMENTED
NEEDS_LOCAL_TESTING
NEEDS_RENDER_TESTING
APPROVED
BLOCKED
REVERTED
ARCHIVED
```

Never call work approved or live unless it was actually reviewed in the relevant environment.

## 9. Concurrent AI Safety

Another AI may update the same branch while work is in progress.

Before editing:

1. Recheck the latest branch head.
2. Inspect recent commits.
3. Confirm the active visual direction.
4. Inspect current target files.
5. Avoid replacing unfamiliar code merely because it is new.

An anomaly is broken, contradictory, obsolete, unsafe, or visibly weak implementation. New work is not an anomaly simply because another AI wrote it.

Prefer new isolated files when building new tools. When updating an existing file, fetch its current content and SHA immediately before writing.

## 10. Playable Runtime

Stack:

```text
Phaser
Vite
XState later for deeper state machines
Render static hosting
```

Render service:

```text
grapple-gods-phaser
```

Render branch:

```text
wrestling-sim-foundation
```

Root directory:

```text
wrestling_sim/web_phaser
```

Build command:

```text
npm install && npm run build
```

Publish path:

```text
./dist
```

Render should auto deploy after commits to the branch, but never claim the live site changed unless deployment is confirmed.

## 11. Studio Build

Local Studio commands:

```bash
cd wrestling_sim/studio
npm install
npm run dev
```

Production build:

```bash
npm run build
```

The existing Grapple Gods Render service does not deploy the Studio because its root remains `wrestling_sim/web_phaser`.

## 12. Reporting After Pushes

After every pushed Grapple Gods update, report:

```text
files changed
behavior changed
branch pushed
whether Render should auto redeploy
what to refresh or inspect
whether Render status was actually confirmed
```

For Studio only changes, state clearly that the playable Render service may rebuild because the branch changed, but its root excludes the Studio files unless shared runtime files were also modified.

## 13. Quality Standard

Do not defend poor placeholder art.

Do not use top down assets as active hard cam assets.

Do not fake life with scale pulsing or rubbery wobble.

Use authored sprite poses, position changes, rotation, frame timing, and readable silhouettes.

The ring and arena must look intentional enough to approve before wrestler production begins.

## 14. Current Priority

```text
1. Hard cam ring approval.
2. Push the ring farther back and confirm composition.
3. Confirm foreground crowd depth.
4. Wire the authored ring frames into the playable runtime.
5. Approve the 8 fps visual cadence.
6. Begin wrestler sprite cycles.
7. Expand the Studio with character, animation, move, AI, and match inspectors.
```
