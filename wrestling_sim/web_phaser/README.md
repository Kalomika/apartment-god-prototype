# Grapple Gods Phaser Prototype

This is the mobile browser prototype for Grapple Gods.

## Active Visual Direction

The playable graphics direction has pivoted to a side view hard cam wrestling game with a sprite oriented pipeline.

The top down experiment is no longer the active playable target.

## Current Approval Step

The current build is a hard cam ring approval pass.

It intentionally shows:

```text
side view hard cam arena
painted wrestling ring
white canvas
black ropes
corner posts
turnbuckle pads
front apron
crowd and floor framing
8 fps visual cadence
no wrestlers yet
```

The wrestler sprites, walk cycles, run cycles, idle cycles, grapples, hit reactions, and move responses come after the ring is approved.

## Core Interaction

Grapple Gods is still a sandbox automated wrestling RPG and booking sim. The player books, manages, and suggests strategy instead of manually controlling every strike or grapple.

The top half of the screen is the match presentation. The bottom half is the manager and move suggestion interface.

## Current First Playable Scope

```text
two active autonomous wrestlers planned
Rex Sterling, blonde powerhouse ace
Dante Crowe, dark haired brawler
one referee planned
hard cam ring renderer now active
mobile bottom half move buttons
autonomous match loop still present under the hood
GM suggestions can be accepted or ignored
```

The current visual build hides wrestlers on purpose until the hard cam ring is approved.

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
src/render/HardCamRingRenderer.js
```

The abandoned top down canvas renderer has been removed from the playable view.

## Local Run

```bash
npm install
npm run dev
```

Then open the Vite local URL in a browser.

## Production Build

```bash
npm run build
```

The build output goes to:

```text
dist/
```

## Render Setup

The repo root contains a `render.yaml` blueprint for this prototype.

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

Once the GitHub branch is connected to Render, the expected static site service name is `grapple-gods-phaser`.
