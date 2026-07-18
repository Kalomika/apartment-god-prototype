# Grapple Gods Foundation

This folder is the isolated home of Grapple Gods. It must not import from, export to, or modify unrelated apartment game systems or `Kalomika/ai-rpg-engine`.

## Current Game Direction

Grapple Gods is a sandbox automated wrestling RPG and booking sim.

The active playable presentation is a side view hard cam wrestling game using authored sprite assets and an 8 fps visual cadence.

The previous absolute top down experiment is archived. It is not the active visual target.

The player acts as general manager, booker, promoter, and sometimes ringside coach. Wrestlers act through personality, stamina, damage, confidence, relationships, tendencies, ring position, style, and match pressure.

## Current Approval Step

The ring is the current visual gate.

The approved direction must show:

```text
side view hard cam
ring pushed farther back in the arena
white canvas
black ropes
visible posts and turnbuckles
front apron
foreground crowd depth
8 fps authored frame cadence
no wrestlers until ring approval
```

## Core Pillars

1. Wrestlers should feel like they have minds and personal agendas.
2. The hard cam match view must remain readable on desktop and mobile.
3. The bottom half of the playable screen should present manager choices and suggested moves.
4. Grappling should use intent based capture rather than pixel perfect manual alignment.
5. Every important choice, win, and loss should be explainable through match data and character logic.
6. Internal development tools should make visual and simulation decisions inspectable.
7. Grapple Gods must remain isolated from unrelated projects in the repository.

## Runtime and Studio

Playable Phaser prototype:

```text
wrestling_sim/web_phaser/
```

Internal development environment:

```text
wrestling_sim/studio/
```

The playable runtime is for match flow and browser testing.

The Studio is for camera blocking, ring review, asset inspection, animation timing, move previews, AI debugging, and future production tools.

## First Prototype Goal

The first playable prototype should prove this loop:

1. Show the hard cam arena and approved ring.
2. Spawn two autonomous wrestlers after the ring gate is cleared.
3. Show move and strategy suggestions in the lower interface.
4. Let the player suggest moves while wrestler AI decides what makes sense.
5. Track stamina, damage, momentum, crowd heat, and ring position.
6. Output a match result and an explainable performance report.

## Folder Layout

```text
wrestling_sim/
  README.md
  package.json
  docs/
  assets/
  src/
  tests/
  studio/
  web_phaser/
```

## Required Reading

```text
wrestling_sim/docs/grapple_gods_development_handbook.md
wrestling_sim/docs/grapple_gods_development_matrix.md
wrestling_sim/docs/grapple_gods_game_direction.md
wrestling_sim/docs/hard_cam_sprite_direction.md
wrestling_sim/docs/ongoing_design_log.md
wrestling_sim/web_phaser/README.md
wrestling_sim/studio/README.md
```

## Branch and Safety Boundary

All Grapple Gods work goes to:

```text
wrestling-sim-foundation
```

Do not modify `main` directly.

Do not create a new branch unless explicitly instructed.

Do not touch files outside `wrestling_sim/` for Grapple Gods work.
