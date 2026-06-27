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
