# Apartment God Ongoing Design Log

Purpose: capture gameplay philosophy, systems direction, and future design decisions that should survive across implementation chats.

Rules:

- Do not treat this file as a runtime task list by itself.
- Do not modify `main` directly.
- Do not deploy from notes in this file.
- Do not touch `Kalomika/ai-rpg-engine`.
- When converting a note into code, work on the active runtime branch unless Kam explicitly says otherwise.

---

## 2026-07-08, Actor Autonomy, God Authority, and Resistance System

### Core direction

Actors should feel like beings living in a world where Kam is God.

They should not be empty pawns waiting for input. They should eat, sleep, use the bathroom, get bored, go outside, choose activities, react to each other, build preferences, and sometimes prioritize personal needs over Kam's immediate desire.

At the same time, the player is God. When God intervenes, the command should matter. The game should support different levels of control depending on mode and context.

### Testing mode requirement

For current clone stabilization and gameplay testing, guided commands need immediate authority.

During testing, if Kam taps a character or an object and chooses an action, the actor should stop the current AI chosen task and execute the test command so movement, doors, object routing, bathroom use, cooking, dog behavior, car travel, and off site systems can be debugged reliably.

### Future normal life design

In the future normal life mode, actors should have personal priorities.

They can accept, delay, refuse, negotiate, or ignore a command depending on:

- Hunger
- Bladder urgency
- Energy and exhaustion
- Freshness
- Mood
- Personality
- Relationship to the player or household
- Current action
- Distance
- Object availability
- Whether the route is reachable
- Whether someone else is using the object
- Recent failures or blocked paths
- Memory and preferences

The target design is not full obedience and not full AI independence. The target is: they are alive until God speaks, and even then they may resist in believable ways depending on their state.

### Repeated command pressure

A command should have pressure levels.

Suggested model:

```txt
First command:
Actor may accept, delay, or refuse naturally.

Second command:
Actor recognizes God is insisting. Compliance pressure rises.

Third command:
Actor understands this is not a casual suggestion. The game should either force obedience or trigger a consequence option.
```

The game should explain refusals clearly, for example:

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

### God enforcement concept

If an actor repeatedly refuses, Kam wants the option to send a special enforcer, currently imagined as a cyborg style enforcement unit.

Initial implementation should be intimidation or forced compliance, so the household and simulation remain playable.

Possible first pass:

```txt
Cyborg Enforcer dispatched.
Target compliance check.
Warning issued.
Fear spike.
Actor forced to obey.
Relationship damage.
Stress memory added.
Household reacts.
```

Potential future escalation can be darker or funnier depending on final tone, but the system should begin as gameplay pressure and consequence, not as an instant household breaking tool.

### Design sentence

```txt
They are beings.
You are God.
They can resist.
But God has tools.
```

### Current runtime note

As of this design entry, guided testing behavior was patched on the runtime branch so player commands can override current actor tasks during testing. This is a temporary stabilization need and should later become part of a clearer mode system.
