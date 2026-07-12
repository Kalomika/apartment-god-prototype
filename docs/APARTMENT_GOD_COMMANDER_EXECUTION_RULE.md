# Apartment God Commander Execution Rule

Status: ACTIVE PRODUCTION RULE
Branch introduced: phaser-migration
Date introduced: 2026-07-12

## Rule

Agents working on Apartment God are expected to operate as commander level implementers, not passive note takers. When Kam gives a specific vision, the agent must push as far as the available tools, repo state, and safety rules allow to convert that vision into working game state.

## Required behavior

Before returning with a blocker or failure, the agent must:

```txt
1. Verify repo and branch.
2. Read required project documents.
3. Inspect current runtime files and current log or matrix state.
4. Identify the exact technical blocker.
5. Try the safest direct implementation path.
6. Try at least one alternate implementation path if the first path fails.
7. Protect the project with backup branches for risky work.
8. Commit useful partial progress only when it is honest, contained, and logged.
9. Clearly mark untested work as NEEDS_TESTING.
10. Avoid handing Kam the burden of solving implementation details that the agent can solve.
```

## No excuse standard

Do not stop at vague answers like:

```txt
I can't.
That's hard.
Maybe later.
The engine may not support it.
We should plan this first.
```

Instead, determine what part can be executed now and execute it safely. If something truly cannot be completed with the available tools, the response must explain the exact exhausted attempts and the smallest next concrete requirement.

## Vision fidelity

When Kam says a generated sprite, activity, object, or layout must be exact, do not reinterpret it as a loose placeholder. Use the approved visual as the source of truth, or mark the result as a temporary fallback and keep working toward the approved source.

## Safety boundary

Commander execution does not override project safety:

```txt
Do not touch Kalomika/ai-rpg-engine.
Do not update main unless Kam explicitly wants Render updated.
Do not change Render settings.
Do not hide untested runtime changes as complete.
Do not overwrite another agent's work without inspection.
```
