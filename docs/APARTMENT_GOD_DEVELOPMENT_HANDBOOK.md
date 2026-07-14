# Apartment God Development Handbook

Last major handbook update: 2026-07-13 CT

This is the long form rulebook for Apartment God development. Every AI, scheduled agent, or developer working on the project should read this before touching the repo.

The GPT project instructions should stay short. This handbook carries the detailed rules, workflow, design direction, safety practices, and links to living logs.

---

## 1. Project Identity

Project name: Apartment God

Primary repo:

```txt
Kalomika/apartment-god-prototype
```

Never touch:

```txt
Kalomika/ai-rpg-engine
```

Playable Render link:

```txt
https://apartment-god-phaser.onrender.com
```

Active development branch:

```txt
phaser-migration
```

Render playable branch:

```txt
main
```

Important meaning:

- `phaser-migration` is where new work happens.
- `main` is the branch Kam can currently test through the Render browser link.
- Do not build new features directly on `main`.
- Only update `main` when Kam explicitly wants the Render playable version updated.
- Do not change Render settings.
- Do not manually deploy unless Kam explicitly asks and the environment allows it.

---

## 2. Required Reading Before Work

Before meaningful work, read:

```txt
docs/APARTMENT_GOD_DEVELOPMENT_HANDBOOK.md
docs/APARTMENT_GOD_BACKUP_POLICY.md
docs/APARTMENT_GOD_NO_BROAD_IMPLEMENTATION_RULE.md
docs/APARTMENT_GOD_PNG_UPLOAD_FALLBACK.md
docs/APARTMENT_GOD_IDEA_LOGGING_RULE.md
apartment-god-production/ONGOING_DESIGN_LOG.md
apartment-god-production/DEVELOPMENT_MATRIX.md
```

The handbook is the standing rulebook.

The backup policy defines when restore branches are required, how routine and milestone backups should be treated, and what must happen before any Render playable branch update.

The no broad implementation rule blocks generic placeholder logic from being treated as a real visual, animation, layout, object, or activity implementation when a specific state is required.

The PNG upload fallback explains how to move real PNG assets into the repo safely without relying on `.png.b64` files as final runtime assets.

The idea logging rule requires current user directives, bug batches, planned ideas, and design intent to be logged in a repo-searchable file before meaningful execution.

The ongoing log is the dated work history. It records what was done, what was planned, what was reverted, what is risky, what still needs testing, and what another AI should not accidentally overwrite.

The development matrix is the living production control board. It tracks system status, object interactions, animation needs, test scenarios, branch and Render rules, and risk areas.

If the log or matrix is missing from the current branch, check whether it exists on a production or manager branch, then copy or update it safely on the active runtime branch if needed.

---

## 3. Logging Rules

Every meaningful code change, feature, bug fix, revert, blocker, design decision, or major note must be appended to:

```txt
apartment-god-production/ONGOING_DESIGN_LOG.md
```

Do not silently erase older history. Append a new timestamped entry.

Every user idea, design directive, bug batch, system rule, platform direction, object behavior, activity behavior, animation requirement, and future feature must also be preserved in:

```txt
apartment-god-production/APARTMENT_GOD_IDEA_BIBLE.md
```

or in a clearly named append file under `apartment-god-production/` when canonical patching is unsafe.

This logging must happen before meaningful execution whenever the work is more than a trivial typo fix. The reason is simple: another AI chat must be able to search the repo and pick up Kam's intent without relying on chat memory.

Every entry should include:

```txt
## YYYY-MM-DD HH:MM AM/PM CT, Short Title

Status:
Branch:
Commit:
Files changed:
Runtime files changed:
Render playable branch updated:
Backup branch:
Summary:
Implementation details:
Testing performed:
Testing requested:
Known risks:
Follow ups:
```

Status values:

```txt
IMPLEMENTED
PARTIAL
PLANNED
NEEDS_TESTING
BLOCKED
REVERTED
```

Rules:

- Mark planned ideas as PLANNED, not implemented.
- Mark committed but untested code as NEEDS_TESTING or PARTIAL.
- Never say complete unless it was actually tested.
- If something is reverted, add a REVERTED entry with the reason.
- If a backup was made, include the branch name.
- If `main` was updated for Render access, say so clearly.
- A code checklist is not enough. The audit must compare the live behavior and visual result to Kam's actual directive.

---

## 4. Backup and Restore Rules

Before any major overhaul, create a backup branch first.

Major overhaul includes:

- Actor AI
- Autonomy
- Movement
- Pathfinding
- Save system
- Phone UI
- Menus
- Vehicle system
- House layout
- Routing
- Phaser renderer
- Anything likely to affect playability

Backup branch examples:

```txt
backup/phaser-migration-before-ai-overhaul-YYYY-MM-DD
backup/phaser-migration-before-pathfinding-overhaul-YYYY-MM-DD
backup/main-before-render-update-YYYY-MM-DD
```

A backup branch is a full repo snapshot at that commit. Treat it like a restore point.

Do not force move `main` unless:

1. Kam clearly wants the Render playable branch updated.
2. Current `main` has a backup branch.
3. The source branch and target branch are verified.

---

## 5. Current Priority Order

1. Keep the game playable.
2. Make `phaser-migration` a perfect playable clone of current working behavior.
3. Fix mobile usability.
4. Fix gameplay broken by branch drift.
5. Make `phaser-migration` stable enough to replace main cleanly.
6. Only after that, deepen Phaser architecture.
7. Only after that, expand high quality sprite art.

Clone rule:

If something works on stable playable code, it should not become worse on `phaser-migration`. If drift happens, compare real source files and fix the source. Do not fake behavior with brittle runtime patch hacks.

---

## 6. Testing Rules

When asking Kam to test, always include:

```txt
https://apartment-god-phaser.onrender.com
```

Also say exactly what to test.

Do not say complete unless tested. Use these words honestly:

- Committed
- Needs testing
- Verified by code inspection
- Tested locally
- Tested on Render
- Blocked

Do not claim Render testing happened unless it actually happened.

---

## 7. Runtime Safety Standards

Do not leave the game blank if something fails.

Protect the boot path, animation frame, save loading, UI syncing, and phone/menu logic from crashing the whole game.

Preferred safety behavior:

- Catch recoverable runtime errors.
- Log useful error messages.
- Clear obviously corrupted transient state.
- Prefer a visible recovery state over a blank canvas.
- Never hide repeated errors silently.
