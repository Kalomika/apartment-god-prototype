# Grapple Gods Studio

Grapple Gods Studio is the internal development and visual review environment for the wrestling game.

It is separate from the playable Phaser runtime and must remain inside:

```text
wrestling_sim/studio/
```

## Active Direction

The active playable camera is a side view hard cam.

The previous top down experiment is archived and must not drive new Studio work.

The current visual approval task is the hard cam ring with the ring staged farther back in the arena. Wrestlers remain out of the approval view until the ring direction is accepted.

## First Module

Studio v0.1 contains the Hard Cam Ring Viewer.

It provides:

```text
shared runtime ring assets
shared foreground crowd assets
8 fps frame playback
manual frame stepping
ring push back control
vertical staging control
inspection zoom
foreground crowd toggle
composition grid
safe frame overlay
mobile responsive layout
```

The Studio reads production assets directly from:

```text
wrestling_sim/web_phaser/public/
```

The Vite configuration copies that shared public directory into the Studio build. Do not duplicate ring, crowd, wrestler, or arena art inside the Studio unless there is a documented technical reason.

## Run Locally

```bash
cd wrestling_sim/studio
npm install
npm run dev
```

## Build

```bash
npm run build
```

Build output:

```text
wrestling_sim/studio/dist/
```

## Studio Rules

1. The Studio is for inspection, approval, debugging, and development tools.
2. The playable game remains in `wrestling_sim/web_phaser/`.
3. Studio controls must not silently change production assets.
4. Approved values must be copied into source code through an intentional commit.
5. Every new major game system should receive an inspector when useful.
6. The Studio must follow the active hard cam sprite direction.
7. Top down assets may appear only in an explicitly labeled archive viewer.
8. All Studio changes go to `wrestling-sim-foundation`.
9. Do not touch `main` or unrelated apartment game systems.

## Planned Modules

```text
character viewer
sprite sheet browser
animation timeline
move previewer
ring designer
camera blocking viewer
match sandbox
AI decision debugger
state machine inspector
collision and rope boundary viewer
performance inspector
```

## Deployment Separation

The existing Render service `grapple-gods-phaser` builds only:

```text
wrestling_sim/web_phaser/
```

Adding the Studio does not change that service automatically. A separate Studio deployment should use `wrestling_sim/studio/` as its root directory.
