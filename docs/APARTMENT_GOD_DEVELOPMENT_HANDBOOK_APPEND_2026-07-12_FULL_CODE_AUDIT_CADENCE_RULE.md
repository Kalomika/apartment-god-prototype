# Handbook Append, Full Code Audit Cadence Rule

Date: 2026-07-12
Status: IMPLEMENTED
Branch: phaser-migration
Runtime files changed: no
Render playable branch updated: no

This append belongs with `docs/APARTMENT_GOD_DEVELOPMENT_HANDBOOK.md` and should be treated as part of the handbook until the main handbook body is safely consolidated.

Required rule:

```txt
After every 5 meaningful runtime or gameplay code changes, perform a full code audit before continuing broad new feature work.
```

Why 5:

```txt
Five changes is frequent enough to catch drift before broken systems stack up, but realistic enough that agents can still make progress without stopping after every tiny edit.
```

Audit meaning:

```txt
A full audit means reviewing the active runtime code path and checking the current source against the handbook, backup policy, no broad implementation rule, ongoing log, and development matrix.
```

Anomaly meaning:

```txt
An anomaly is a confirmed or strongly supported source issue, not something the agent merely does not understand.
```

Examples of real anomalies:

```txt
boot breakers
broken imports or missing exports
duplicate runtime update loops
UI paths that cannot reach implemented features
stale save or reset behavior
actor autonomy fighting guided commands
movement or vehicle teleporting when visible routing is required
vehicle direction contradicting the garage layout
object actions not matching object kinds
phone or interaction menus failing mobile scroll rules
features marked implemented but only partial or unreachable
visual code violating true top down or no broad implementation rules
branch, backup, Render, or logging rule violations
```

Not anomalies:

```txt
unfamiliar code that has not been read yet
documented rules that look unusual but match the matrix
planned systems honestly marked PLANNED or PARTIAL
code the agent has not understood because it skipped required reading
```

Audit behavior:

```txt
1. Verify repo and branch first.
2. Read required docs first.
3. Inspect current source, not stale memory.
4. Separate confirmed bugs from risks and unknowns.
5. Fix blatant safe issues during the pass.
6. Do not broaden the audit into an unrelated feature sprint.
7. Do not touch main unless Kam explicitly asks.
8. Do not deploy or change Render settings.
9. Log the audit and any fixes.
```

Source rule document:

```txt
docs/APARTMENT_GOD_FULL_CODE_AUDIT_CADENCE_RULE.md
```
