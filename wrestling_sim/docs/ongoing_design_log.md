# Grapple Gods Ongoing Design Log

## 2026-07-18, Grapple Gods Studio Foundation

Status: NEEDS_LOCAL_TESTING

Branch: `wrestling-sim-foundation`

Files changed:

```text
wrestling_sim/studio/package.json
wrestling_sim/studio/vite.config.js
wrestling_sim/studio/index.html
wrestling_sim/studio/styles.css
wrestling_sim/studio/app.js
wrestling_sim/studio/README.md
wrestling_sim/docs/grapple_gods_development_handbook.md
wrestling_sim/docs/grapple_gods_development_matrix.md
wrestling_sim/docs/ongoing_design_log.md
```

Summary:

A standalone internal development environment was created for Grapple Gods. The first module is a Hard Cam Ring Viewer using the production ring and foreground crowd assets from `wrestling_sim/web_phaser/public/`.

Active direction confirmed:

```text
side view hard cam
ring pushed farther back
foreground crowd depth
8 fps authored sprite cadence
top down direction archived
no wrestlers until ring approval
```

Studio behavior:

```text
plays ring frame A and B at 8 fps
supports pause and manual frame stepping
previews ring push back
previews vertical arena placement
supports inspection zoom
shows and hides foreground crowd
shows and hides composition grid
shows and hides 16:9 safe frame
uses a responsive desktop and mobile layout
```

Asset pipeline:

The Studio Vite configuration uses `wrestling_sim/web_phaser/public/` as its public directory. Production art is shared instead of duplicated.

Testing performed:

```text
repository source inspection
current branch head inspection
active hard cam direction verification
runtime asset path verification
```

Testing not yet performed:

```text
npm install
npm run build
browser visual inspection
mobile visual inspection
separate Studio deployment
```

Known risks:

```text
The current ring approval SVG is a composite arena plate. Studio push back controls scale the plate for camera blocking review rather than editing isolated ring geometry.
Another AI is actively adding hard cam assets to the same branch, so future work must recheck the branch before every change.
The existing Render service root is web_phaser and does not publish the Studio.
```

Follow ups:

```text
run and visually inspect the Studio
approve the farther back ring composition
wire approved authored ring frames into the playable Phaser scene
add a separate internal Studio deployment
add character, animation, move, AI, and match inspection modules
```
