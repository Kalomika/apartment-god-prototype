# Wrestling Sim Phaser Prototype

This is the first mobile browser prototype for the wrestling sim.

## Goal

Build the initial playable viewing layer:

```text
full width mobile browser
ring and arena occupying the top half of the screen
manager choice tray below the match view
strict top down ring readability
future sprite state support
```

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
simple crowd foreground hints
procedural top down wrestler proxies
manager choice buttons
scripted sim beats
mobile tap support
future wrestler state machine file
```

## Render Setup

The repo root contains a `render.yaml` blueprint for this specific prototype.

Render service name:

```text
wrestling-sim-phaser
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
