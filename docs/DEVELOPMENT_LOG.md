# Development Log

This file tracks meaningful repo changes so any future tool or developer can continue without depending on chat history.

## 2026-07-13, True top down anime foundation and garage pass 01

Tool or person: Codex with connected Photoshop

Branch: phaser-migration

Backup branch: backup/phaser-migration-before-anime-visual-overhaul-2026-07-13

Summary:

- Added `docs/APARTMENT_GOD_TRUE_TOP_DOWN_ANIME_VISUAL_STANDARD.md` as the active visual contract.
- Set the target to mature science fiction anime production design under a strict overhead camera, using painterly environments and color or light separation instead of heavy generic outlines.
- Recorded the long-term character and animal direction as modular true top down 2D sprite sheets with consistent identity, wardrobe, scale, anchors, and action-specific animation.
- Added approved Photoshop assets for the garage floor, closed family SUV, and closed sports convertible.
- Added safe cached image loading and retained prior renderers when an asset is missing or a vehicle door or trunk is open.
- Added facing rotation for production vehicle PNGs.
- Updated the build to copy `assets/` into both output directories.
- Added manifest checksums, approval notes, rejected generation notes, and a small unit test for asset contracts and vehicle rotation.
- Separated Vitest unit discovery from Playwright `.spec.js` discovery so `npm test` does not execute the mobile browser suite under the wrong runner.

Rejected in this pass:

- Human images that kept front-facing face and torso construction.
- A dog image that read as lying on its back.

Known limits:

- This is the first approved garage slice, not a full game conversion.
- Bike, motorbike, ATV, other rooms, props, cast, dog, activity clips, and open vehicle frames remain on safe fallbacks.
- Syntax, unit, production asset validation, and static build pass locally.
- Full repo lint still has pre-existing empty catch errors outside this pass.
- Browser and Render visual approval are still required. Local Playwright could not start because no browser binary was installed, and the permitted download returned an invalid empty archive.

Next recommended step:

Review the garage in a local browser at mobile scale. If crop, facing, layering, and state fallbacks pass, create one complete true top down 2D sprite proof for an adult and the dog before broad character replacement.

Correction:

- Apartment God must not inherit Top Shot's model and renderer pipeline. Top Shot is the separate hybrid project with highly rigged 3D models and intentional 2D presentation elements. Apartment God remains a true top down 2D sprite game.
- The repository audit confirmed that active and backup Top Shot branches are still hosted inside `Kalomika/apartment-god-prototype`. Added a repository separation plan and root `AGENTS.md` boundary rule. No branches were moved or deleted.
- Clarified that Top Shot is not a generic 3D-only pipeline. Its established rules combine highly rigged 3D models with 2D effects, painterly 2D backgrounds, outline-free color and lighting separation, and effective 8 fps anime timing. No Top Shot rule was removed or weakened.

## 2026-06-27, Repo memory scaffold

Tool or person: ChatGPT

Branch: main

Related issue: https://github.com/Kalomika/apartment-god-prototype/issues/1

Summary:

- Added permanent repo handoff requirements through GitHub issue #1.
- Started adding repo-native memory files so Agent Mode, Codex, ChatGPT, Gemini, or a human developer can understand the current state from the repository itself.
- Confirmed the main architectural problem: the prototype grew into one large `src/main.js`, making large connector-based patches unreliable.
- Set the next major goal as a modular rebuild, not more giant file replacement.

Known state:

- Live site: https://apartment-god-prototype.onrender.com
- Current live branch: main
- Backup branch expected: backup-before-qol-immersion-patch
- Accidental unused file may still exist: `scripts/build-qol.js`

Next recommended step:

Clone the repo with real git, create a modular development branch, split `src/main.js` into focused modules, preserve current gameplay, run checks, commit, push, then verify Render.

## 2026-06-27, Character animation and pretend music restoration

Tool or person: ChatGPT

Branch: main

Latest commit in this pass: edd8f3517d2ee062cebc42e6c34185bae3869fa8

Summary:

- Restored visible body animation so characters are no longer static tokens.
- Added walk-cycle arms and legs.
- Added distinct sitting pose.
- Added distinct lying/sleeping pose.
- Added social/tickle/cuddle/kiss/hold-hands pose handling.
- Updated social action resolution so both participants can animate during social actions.
- Added pretend phone music with selectable genres: rap, rock, classical, jazz, afrobeat, electronic.
- Added genre-based mood/need/skill-adjacent effects.
- Added a dynamic stereo object when music starts.
- Added stereo rendering and phone/stereo music controls.
- Secured animation and pretend music expectations in `docs/FEATURE_INVENTORY.md`.

Known limitations:

- Animation is still symbolic top-down canvas animation, not full sprite-sheet animation.
- Social poses are readable two-frame/oscillating body-language approximations.
- Music is pretend/silent by design for licensing safety.

Next recommended step:

Test on mobile after Render redeploy. Verify walking, sitting, sleeping, tickle, cuddle, dog actions, phone music, and stereo visibility. Then continue polishing room-scale activity choreography and furniture population.

## 2026-06-27, Navigation, fetch, placement, and reading repair pass

Tool or person: ChatGPT

Branch: main

Summary:

- Replaced letter/symbol mood faces with actual emoji expressions.
- Added extra relationship actions to config: watch TV together, go to bed together, and private moment.
- Fixed cross-floor object routing so a character who targets an upstairs object walks to the stairs, transfers floors, then continues to the upstairs target.
- Added physical room boundary checks so characters and the dog cannot cross from one room into another unless they are crossing a valid doorway.
- Reworked fetch so the dog uses routed movement rather than raw point paths.
- Added a visible fetch ball and made the ball remain visible while the dog returns.
- Changed bookshelf build requests so they wait for player floor/placement input instead of auto-installing upstairs.
- Allowed multiple bookshelves by generating unique bookshelf IDs.
- Added bookshelf facing based on open room space.
- Added longer book reading with a stronger intellect reward than generic phone/PC study.
- Added dynamic rendering for pulled books and build placement prompts.

Known limitations:

- The wall barrier is now stricter, but needs real device testing to confirm no doorway gets too tight.
- Bookshelf facing is stored but still rendered in a simple symbolic way.
- Save slots, request inbox, pregnancy, furniture population modes, and long-term aging remain future systems.

Next recommended step:

Test on live Render after deploy. Verify upstairs bed/desk/book interactions, fetch ball, dog pathing around rooms, wall blocking, build request placement, and bookshelf reading reward.

## 2026-06-27, Persistent cellphone foundation

Tool or person: ChatGPT

Branch: main

Summary:

- Added a persistent cellphone dock under the game/HUD area.
- Cellphone opens and closes as a phone-style app panel.
- Added fake apps: Home, Shop, Contacts, Music, Activities, Requests, and Saves.
- Added floor arrow controls over the game area for quick upstairs/downstairs map viewing.
- Added shop actions through the phone: food delivery, workout gear, bookshelf build request, and custom build request.
- Added contacts app for selecting Resident, Girlfriend, or Dog.
- Added music app using the existing pretend music genres.
- Added activities app with cook self, cook for house, watch TV together, go to bed together, private moment, and movie theater/date activity.
- Added request inbox foundation and manual request generation.
- Added localStorage save slots 1, 2, and 3.

Known limitations:

- Phone UI is DOM-based and symbolic, not a polished phone skin yet.
- Save slots restore core state, needs, skills, money, and actors, but dynamic delivered objects need deeper persistence later.
- Requests are simple text entries, not full quest chains yet.
- Garage, basement, car travel/gas, pregnancy, aging calendar, and offline progression remain future implementation passes.

Next recommended step:

Test the phone dock on mobile after Render deploy. Verify it opens, tabs work, music starts, saves/loads operate, build request still enters placement mode, and floor arrows do not interfere with gameplay clicks.

## 2026-06-27, Phone click and shared activity repair

Tool or person: ChatGPT

Branch: main

Summary:

- Fixed the cellphone app panel rebuilding its buttons every animation frame.
- Phone tabs and app buttons should now respond reliably to taps/clicks.
- Added a shared relationship action helper so Watch TV Together, Go To Bed Together, and Private Moment call an available partner instead of only moving the selected character.
- Private Moment now sends both available partners to the bed target before the bedroom privacy effect happens through the normal activity resolver.
- Added a movement recovery guard so characters stop cleanly instead of jittering in place when a doorway/object route is blocked.

Known limitations:

- Shared action synchronization is still simple: both partners are commanded to the same object, but there is not yet a full reservation system that waits until both are perfectly aligned.
- Navigation recovery prevents infinite jitter, but door widths and room routes still need real-device testing.

Next recommended step:

Test the phone apps again after Render deploy. Verify phone buttons execute, private moment moves both characters, watch TV together calls the partner, and characters do not jitter endlessly at walls or doors.
