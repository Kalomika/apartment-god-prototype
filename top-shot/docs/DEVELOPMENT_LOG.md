# Top Shot Development Log

This file tracks meaningful Top Shot repo changes so future AI agents, Codex, Copilot, Grok, or human developers can continue from the repository instead of chat history.

## 2026-07-10, Repo memory and Starshot protocol scaffold

Tool or person: ChatGPT

Branch: `top-shot-v0-1`

Backup branch: `backup/top-shot-v0-1-2026-07-10`

Summary:

- Added Top Shot repo-native agent instructions and development memory docs.
- Added `top-shot/AGENTS.md` as the short entry point for future tasks.
- Added `top-shot/docs/TOP_SHOT_HANDBOOK.md` as the full project development Bible.
- Added this development log.
- Added handoff, feature inventory, architecture, QA checklist, and Starshot roadmap docs.
- Established that Top Shot is separate from Apartment God main.
- Established stable, backup, and experimental branch rules.
- Established Starshot Mode for ambitious branches with rollback discipline.

Files added:

- `top-shot/AGENTS.md`
- `top-shot/docs/TOP_SHOT_HANDBOOK.md`
- `top-shot/docs/HANDOFF.md`
- `top-shot/docs/DEVELOPMENT_LOG.md`
- `top-shot/docs/FEATURE_INVENTORY.md`
- `top-shot/docs/ARCHITECTURE.md`
- `top-shot/docs/QA_CHECKLIST.md`
- `top-shot/docs/STARSHOT_ROADMAP.md`

Systems affected:

- Documentation and workflow only.
- No runtime gameplay code changed on the stable branch in this pass.

What was preserved:

- Existing Top Shot runtime.
- Existing branch `top-shot-v0-1` as the stable base.
- Existing run, smoke, check, and build commands.

Testing:

- Not run. Documentation-only pass.

Known risks:

- Future agents must actually follow these docs; the docs alone do not enforce behavior.
- The experimental Starshot branch may diverge quickly and must keep its own handoff current.

Next recommended step:

Mirror these docs into `top-shot-starshot-engine`, then continue Starshot work in recoverable slices beginning with motion, animation state, timing, and debug visibility.
