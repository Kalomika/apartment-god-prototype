# Grapple Gods Foundation

This folder is a fully isolated foundation for Grapple Gods. It does not import from, export to, or modify any existing game runtime in this repository.

## Current Game Direction

Grapple Gods is a sandbox top down automated wrestling game inspired by Fire Pro logic, but built around custom wrestlers, fantasy matchups, manager choice, and simulated style clashes.

The player builds, trains, styles, and configures a wrestler. The match itself is watched like a sim. The wrestler acts through stats, tendencies, ring position, stamina, style, and match pressure.

## Core Pillars

1. Custom wrestlers should feel like they have a mind of their own.
2. Matches should be readable from an absolute top down view for the first playable version.
3. The bottom half of the screen should present manager choices and suggested moves.
4. Grappling should use intent based capture, not pixel perfect manual alignment.
5. Every win or loss should be explainable through match data.
6. The system should support future Render deployment without touching other projects.

## Camera Direction

Primary first prototype camera style: absolute top down.

Hard cam can remain a future alternate view, but the first playable test should focus on top down readability, mobile browser usability, and manager choice input.

## First Prototype Goal

The first playable prototype should prove this loop:

1. Spawn two AI wrestlers.
2. Show the ring and arena on the top half of the screen.
3. Show move and strategy suggestions on the bottom half of the screen.
4. Let the player suggest moves while the wrestler AI decides what makes sense.
5. Track stamina, damage, momentum, crowd heat, and ring position.
6. Output a match result and a performance report.

## Folder Layout

```text
wrestling_sim/
  README.md
  package.json
  docs/
  assets/
  src/
  tests/
  web_phaser/
```

## Safety Boundary

This module is intentionally separate from the existing apartment game and any AI RPG engine work. Nothing in this folder should be imported by another game until we explicitly create an integration branch later.
