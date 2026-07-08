# Apartment God Ongoing Design Log

Purpose: capture gameplay philosophy, systems direction, implementation status, reversions, and future design decisions that should survive across implementation chats.

Rules:

- Every AI or scheduled task working on Apartment God must read this log before starting any nontrivial work.
- Every meaningful update must be appended with date, time, timezone, branch, commit SHA if implemented, and status.
- Mark whether an entry is IMPLEMENTED, PARTIAL, PLANNED, REVERTED, or NEEDS_TESTING.
- Do not treat planned design notes as completed runtime features.
- Do not delete older entries. Append new timestamped notes instead, unless Kam explicitly asks for cleanup.
- Do not modify `main` directly unless Kam explicitly wants the Render playable branch updated.
- Do not deploy from notes in this file.
- Do not touch `Kalomika/ai-rpg-engine`.
- When converting a note into code, work on the active runtime branch unless Kam explicitly says otherwise.

Entry format:

```txt
## YYYY-MM-DD HH:MM AM/PM CT, Short Title

Status:
Branch:
Commit:
Runtime files changed:
Render playable branch updated:
Summary:
Implementation details:
Testing requested:
Follow ups:
```

---

## 2026-07-08 03:52 AM CT, Logging Protocol Update

Status: IMPLEMENTED
Branch: production-manager-department-logs
Commit: pending at time of writing
Runtime files changed: no
Render playable branch updated: no

Summary:
Kam clarified that the ongoing log must be dated and timed so future AIs can tell what they are following, what came first, what was implemented, what was reverted, and what still needs work.

Implementation details:
The log rules now require every meaningful update to include date, time, timezone, branch, commit SHA when implemented, and status. Future AIs and scheduled agents must read this log before starting nontrivial work and append new timestamped notes instead of overwriting older context.

Testing requested:
None. Documentation only.

Follow ups:
Any future runtime patch should cite its branch and commit in this log when it is a meaningful change.

---

## 2026-07-08 03:52 AM CT, Sleep, Thought Bubble, Activity Consequence, and Coordination Design

Status: PLANNED
Branch: production-manager-department-logs
Commit: pending at time of writing
Runtime files changed: no
Render playable branch updated: no

Summary:
Kam wants the actors to feel like living beings with routines, shared sleep rhythm, personal thoughts, invitations, and consequences from activities, not just simple need bars and animations.

Implementation details:

Sleep and bedtime direction:

- Couples should generally try to sleep around an assigned shared bedtime, because boyfriend and girlfriend households usually develop a general sleep rhythm.
- The bedtime should be a goal, not a rigid command. Actors can stay up for work, movies, deadlines, personality, stubbornness, night owl traits, or other context.
- The girlfriend should sometimes prompt sleep, either as speech to the other person or as a thought depending on context.
- Lack of sleep should affect stamina and body state, not just an energy bar.
- Too many days of poor sleep should affect mood, movement speed, patience, decline chance, mistake chance, social irritability, recovery, and health style penalties.
- Future player created characters may have traits like night owl, disciplined, stubborn, obsessive worker, meticulous, lazy, social, loner, anxious, and similar behavior patterns. Those traits should change bedtime behavior and consequences.

Bubble language direction:

- Speech bubbles are for things said out loud to another actor or to the household.
- Thought bubbles are for personal thoughts, private desires, chosen activities, or things the player should consider but that are not spoken to another actor.
- If an actor independently decides to watch a movie, the movie idea should appear as a thought bubble, not a speech bubble.
- If an actor wants someone else to join, that should become speech or an invitation bubble.
- Thought bubbles should use comic style thought bubble language so private intention is visually distinct from dialogue.

Activity consequence direction:

- Every activity should have a result beyond the animation.
- One activity can affect multiple stats.
- Watching something together should increase social and fun or excitement.
- Watching a documentary should build intellect or learning.
- Watching action should affect excitement, energy, fun, confidence, or restlessness. Exact stat mapping still needs design.
- Watching horror should create short term cautious behavior. For example, actors may want to sleep together that night, avoid the yard at night, hesitate to drive at night, or become jumpier for a few days.
- Listening to music should have genre effects. Classical can increase intellect or focus and make smarter choices more likely. Rap, rock, jazz, afrobeat, electronic, ambient, and other genres should each get meaningful mood or behavior effects later.
- Reading and intellectual activities should improve intellect, learning, focus, and future decision quality.
- Every action should create some state change, memory, preference, skill impact, need impact, mood impact, relationship impact, or later behavior effect.

Bookshelf direction:

- The build or order system can still exist later.
- For current testing, a default bookshelf should exist in the house after reset so reading and intellect mechanics can be tested without reordering the shelf every time.
- The priority is still basic house mechanics working correctly before deeper shopping and ownership complexity.

Coordination rule for other AIs:

- Scheduled and parallel AIs should use this log as the shared source of truth.
- Before making a new change, check this log to avoid stepping on recent work.
- After making a meaningful change, append a dated and timed entry with branch, commit, status, and what changed.
- If something is reverted, add a new dated reversion entry instead of silently erasing history.

Testing requested:
None for this planned design note. Runtime implementation should be tested separately when built.

Follow ups:
Add a default bookshelf to the runtime branch if one is not already placed. Later, implement actor routine schedules, shared bedtime logic, thought bubbles versus speech bubbles, and activity consequence mappings.

---

## 2026-07-08 03:30 AM CT, Actor Autonomy, God Authority, and Resistance System

Status: PLANNED WITH PARTIAL RUNTIME SUPPORT
Branch: production-manager-department-logs
Commit: ece6aad13473912489e1bdae84a31936f9260e5a for initial log entry. Runtime guided override patch was committed separately on phaser-migration as 32360f8cd8720b3b24b65ad2aa923127df030474.
Runtime files changed: no in this log branch. Yes in phaser-migration for guided override.
Render playable branch updated: yes, main was later moved to match phaser-migration for Render access.

Summary:
Actors should feel like beings living in a world where Kam is God. They should not be empty pawns waiting for input. They should make choices, react to needs, and sometimes prioritize personal state over Kam's immediate desire. At the same time, when God intervenes in testing, the command should matter immediately.

Testing mode requirement:
For current clone stabilization and gameplay testing, guided commands need immediate authority. During testing, if Kam taps a character or an object and chooses an action, the actor should stop the current AI chosen task and execute the test command so movement, doors, object routing, bathroom use, cooking, dog behavior, car travel, and off site systems can be debugged reliably.

Future normal life design:
In future normal mode, actors can accept, delay, refuse, negotiate, or ignore a command depending on hunger, bladder urgency, energy, freshness, mood, personality, relationship, current action, distance, object availability, route reachability, whether someone else is using the object, recent failures, blocked paths, memory, and preferences.

Repeated command pressure:

```txt
First command:
Actor may accept, delay, or refuse naturally.

Second command:
Actor recognizes God is insisting. Compliance pressure rises.

Third command:
Actor understands this is not a casual suggestion. The game should either force obedience or trigger a consequence option.
```

Refusals should be explained clearly:

```txt
Too hungry.
Needs bathroom first.
Too exhausted.
Already showering.
Too far away.
No clear route.
No vehicle seat.
Object is blocked.
```

God pressure concept:
If an actor repeatedly refuses, Kam wants the option to trigger a special compliance event or stylized enforcer system. The first implementation should be pressure, warning, forced compliance, relationship impact, stress memory, and household reaction, not an instant household breaking tool.

Design sentence:

```txt
They are beings.
You are God.
They can resist.
But God has tools.
```
