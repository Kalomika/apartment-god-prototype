# Grapple Gods Phaser Prototype

This is the first mobile browser prototype for Grapple Gods.

## Goal

Build the initial playable viewing layer:

```text
full width mobile browser
ring and arena occupying the top half of the screen
GM and move suggestion panel occupying the bottom half of the screen
strict top down ring readability
future sprite state support
```

## Core Interaction

Grapple Gods is a sandbox top down automated wrestling RPG and booking sim. The player books, manages, and watches the match.

The top half of the screen is the arena and ring. The bottom half of the screen is where the player chooses suggested moves or strategy calls for their wrestler.

The player can suggest what the wrestler should try next, but the wrestler still acts through stats, stamina, position, move set, confidence, and match context.

## Current First Playable Scope

```text
two active autonomous wrestlers
Rex Sterling, blonde powerhouse ace
Dante Crowe, dark haired brawler
one moving referee proxy
proper top down ring renderer
mobile bottom half move buttons
autonomous match loop
GM suggestions can be accepted or ignored
basic punch
lockup
grapple advantage
Irish whip
rope run
basic slam
pin attempt
recover
```

The full ten wrestler roster data is included for later, but the first active test match uses two wrestlers so the match loop can be proven before adding booking depth.

## Stack

```text
Phaser for rendering and input
Vite for fast browser builds
XState for future sprite and match state machines
Render static site hosting for mobile testing
```

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

## Current Prototype Features

```text
responsive top half arena
procedural top down ring drawing
simple crowd loop hints
procedural top down wrestler rigs
manager choice buttons
autonomous match engine
mobile tap support
future wrestler state machine file
```

## Render Setup

The repo root contains a `render.yaml` blueprint for this specific prototype.

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
