# Ongoing Design Log Append, Idea Capture Rule

## 2026-07-13 07:05 AM CT, Standing Idea Capture Rule Added

Status: IMPLEMENTED
Branch: phaser-migration
Commit: docs rule 0da5a5d548da777037ef2c5785bd22b6aa28a065, matrix patch bd1b44febbad0d8f581d11ec5326d8de05d2a4ec
Files changed: docs/APARTMENT_GOD_IDEA_CAPTURE_RULE.md, apartment-god-production/DEVELOPMENT_MATRIX_PATCH_2026-07-13_IDEA_CAPTURE_RULE.md, apartment-god-production/ONGOING_DESIGN_LOG_APPEND_2026-07-13_IDEA_CAPTURE_RULE.md
Runtime files changed: no
Render playable branch updated: no
Backup branch: not required, documentation/process rule only

Summary:
Added a standing process rule after Kam correctly pointed out that every game idea, design note, animation request, layout request, behavior request, bug report, or future system idea raised in chat needs durable capture even if it is not implemented in the current pass.

Implementation details:
- Created `docs/APARTMENT_GOD_IDEA_CAPTURE_RULE.md` as an active standing rule.
- The rule says every Apartment God idea must be captured before the session ends.
- Implemented work must be logged with commits and files changed.
- Unimplemented work must be logged as PLANNED, BLOCKED, DEFERRED, REVERTED, PARTIAL, or NEEDS_TESTING as appropriate.
- The rule requires an end-of-session audit for missed ideas before final reporting.
- Added a development matrix patch so future agents treat idea capture and backlog logging as a tracked production process.
- Used the missed pool joy/disappointment request as the explicit failure example so this specific class of miss does not repeat.

Testing performed:
- Documentation-only process change. No runtime test required.

Testing requested:
- None for runtime.
- Future agents should use the new rule as a checklist at the end of every Apartment God task.

Known risks:
- The canonical handbook itself was not directly rewritten in this pass to avoid clobbering concurrent edits while other agents are actively committing. This rule is still durable in `docs/` and matrix patch form.
- During the next safe documentation sync, the new idea capture rule should be referenced from the handbook required reading and logging sections.

Follow ups:
- Merge or reference `docs/APARTMENT_GOD_IDEA_CAPTURE_RULE.md` inside `docs/APARTMENT_GOD_DEVELOPMENT_HANDBOOK.md` during the next safe handbook sync.
- Audit older chat-derived ideas against the current log/matrix if Kam wants a backlog recovery pass.
