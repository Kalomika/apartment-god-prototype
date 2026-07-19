# Grapple Gods Phaser Prototype

This is the mobile browser prototype for Grapple Gods.

## Active Visual Direction

The playable graphics direction is now a side view hard cam wrestling game with a sprite oriented pipeline.

The top down experiment is no longer the active playable target.

## Current Playtest

The current build uses the approved generated hard cam wrestling screen as the visual shell for a playable Phaser test.

It currently includes:

```text
hard cam arena presentation
two visible wrestlers in the ring
referee and crowd presentation
mobile move suggestion buttons
autonomous match engine
suggestions accepted or ignored
live stamina and damage overlays
match log updates
8 fps visual cadence
impact flashes and camera shake
```

The two wrestlers and crowd are currently baked into the reference match plate. Separate authored wrestler sprite cycles come next.

## Core Interaction

Grapple Gods is still a sandbox automated wrestling RPG and booking sim. The player books, manages, and suggests strategy instead of manually controlling every strike or grapple.

The top half of the screen is the match presentation. The bottom half is the manager and move suggestion interface.

## Stack

```text
Phaser for rendering and input
Vite for browser builds
XState for future deeper state machines
Render static site hosting for mobile testing
```

## Active Renderer

The current active match view renderer is:

```text
src/render/ReferenceMatchRenderer.js
```

The active visual plate loads from:

```text
public/assets/reference/grapple_gods_reference_match.svg
```

## Local Run

```bash
npm install
npm run dev
```

## Production Build

```bash
npm run build
```

The build output goes to:

```text
dist/
```

## Render Setup

Render service name:

```text
grapple-gods-phaser
```

Build command:

```bash
npm install && npm run build
```

Static publish path:

```text
dist
```

Root directory:

```text
wrestling_sim/web_phaser
```
