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
