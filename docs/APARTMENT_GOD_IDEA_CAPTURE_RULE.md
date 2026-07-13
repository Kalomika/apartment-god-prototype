# Apartment God Idea Capture Rule

Status: ACTIVE STANDING RULE
Created: 2026-07-13
Applies to: every Apartment God chat, agent run, repo pass, visual pass, gameplay pass, bug audit, test request, and documentation pass

## Purpose

Kam's ideas are production requirements or backlog candidates unless he clearly says they are casual, rejected, or not for the game.

No AI should treat a gameplay idea, visual idea, animation idea, object request, room layout note, behavior note, UI note, test request, bug report, or future system idea as throwaway chat.

## Hard rule

Every Apartment God idea Kam brings up must be captured somewhere durable before the session ends.

If the idea is implemented immediately, log it as IMPLEMENTED or NEEDS_TESTING with the commit and exact files changed.

If the idea is not implemented immediately, log it as PLANNED with enough detail that another AI can execute it later without needing to rediscover the conversation.

If the idea is rejected, blocked, deferred, or unsafe, log it as BLOCKED or DEFERRED with the reason.

## Minimum capture fields

Every captured idea should include:

- What Kam asked for
- Whether it is runtime, visual, animation, UX, layout, object, AI/autonomy, testing, or documentation
- Current status: PLANNED, PARTIAL, NEEDS_TESTING, IMPLEMENTED, BLOCKED, REVERTED, or DEFERRED
- Where it belongs in the game
- What files or systems are likely affected if known
- What must be tested later
- Whether it has been implemented or only logged

## Where to capture

Preferred order:

1. Canonical ongoing design log: `apartment-god-production/ONGOING_DESIGN_LOG.md`
2. Canonical development matrix: `apartment-god-production/DEVELOPMENT_MATRIX.md`
3. If the canonical files cannot be safely patched, create a clearly named append or patch file under `apartment-god-production/`
4. For standing process rules, create or update a file under `docs/`

## End of session audit

Before giving the final work report for any Apartment God task, the AI must ask itself:

- Did Kam mention any idea, feature, animation, visual rule, object change, behavior change, test requirement, or bug that I did not implement?
- If yes, did I log it as PLANNED or BLOCKED?
- Did I update or patch the development matrix if the idea affects gameplay, visuals, animation, objects, testing, or project process?
- Did I clearly tell Kam what was implemented versus what was only logged?

## Important distinction

Logging an idea does not mean it was implemented.

Do not blur these states. If a request is only captured for later, say clearly that it is logged but not executed.

## Failure mode this rule prevents

The pool joy and disappointment animation request was discussed but not explicitly captured in the first pool movement log. That should not happen again. Every future design request should be preserved even if the current pass only implements part of it.
