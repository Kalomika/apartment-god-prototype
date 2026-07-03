# Wrestling Sim Foundation

This folder is a fully isolated foundation for the wrestling simulation game. It does not import from, export to, or modify any existing game runtime in this repository.

## Current Game Direction

The concept is a realistic 3D wrestling simulation inspired by Fire Pro logic, but presented with a harder broadcast look instead of a cartoon style.

The player builds, trains, styles, and configures a wrestler. The match itself is watched like a sim. The wrestler acts through stats, tendencies, ring position, stamina, style, and match pressure.

## Core Pillars

1. Custom wrestlers should feel like they have a mind of their own.
2. Matches should be readable from a fixed hard cam view.
3. Grappling should use intent based capture, not pixel perfect manual alignment.
4. Every win or loss should be explainable through match data.
5. The system should support future Render deployment without touching other projects.

## Camera Direction

Primary camera style: hard cam side view.

The crowd sits in the foreground at the bottom of the screen. The ring is viewed from the audience side, like a broadcast camera. Wrestlers still move in full 3D space, but the player watches from a fixed, readable angle.

## First Prototype Goal

The first playable prototype should prove this loop:

1. Spawn two AI wrestlers.
2. Let them circle, approach, strike, grapple, reverse, and pin.
3. Track stamina, damage, momentum, crowd heat, and ring position.
4. Output a match result and a performance report.

## Folder Layout

```text
wrestling_sim/
  README.md
  package.json
  docs/
    architecture.md
    camera_and_ring.md
    grapple_logic.md
    match_report_model.md
  src/
    sim_runner.mjs
    core/
      decision_brain.mjs
      grapple_resolver.mjs
      match_context.mjs
      ring_zones.mjs
      wrestler_profile.mjs
  tests/
    smoke_test.mjs
```

## Safety Boundary

This module is intentionally separate from the existing apartment game and any AI RPG engine work. Nothing in this folder should be imported by another game until we explicitly create an integration branch later.
