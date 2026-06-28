# Development Log

This file tracks meaningful repo changes so any future tool or developer can continue without depending on chat history.

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
