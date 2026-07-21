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
wrestling_sim/README.md
wrestling_sim/docs/grapple_gods_game_direction.md
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
AppDeploy production build
desktop automated QA
mobile automated QA
three Studio interaction tests passed
no frontend runtime errors reported
no network errors reported
```

Testing not yet performed:

```text
local npm install
local npm run build
human browser visual approval of the GitHub Studio build
Render deployment confirmation for the playable service
```

Known risks:

```text
The current ring approval SVG is a composite arena plate. Studio push back controls scale the plate for camera blocking review rather than editing isolated ring geometry.
Another AI is actively adding hard cam assets to the same branch, so future work must recheck the branch before every change.
The existing Render service root is web_phaser and does not publish the GitHub Studio folder.
The AppDeploy preview is a separate deployment snapshot and is not automatically synchronized with future GitHub commits.
```

Follow ups:

```text
review the farther back ring composition in the Studio preview
approve or revise ring scale and vertical placement
wire approved authored ring frames into the playable Phaser scene
create a dedicated auto deployed Studio service if desired
add character, animation, move, AI, and match inspection modules
```

## 2026-07-18, Studio Preview Deployment

Status: IMPLEMENTED

Deployment environment: AppDeploy

Public review URL:

```text
https://f4d17721dd2b55bb9c.v2.appdeploy.ai/
```

Deployment result:

```text
status ready
three automated tests executed
all reported tests passed
desktop QA snapshot generated
mobile QA snapshot generated
no frontend errors
no backend errors
no network errors
```

The preview demonstrates the hard cam Studio workflow and farther back ring staging. The canonical source remains the GitHub Studio under `wrestling_sim/studio/`.
