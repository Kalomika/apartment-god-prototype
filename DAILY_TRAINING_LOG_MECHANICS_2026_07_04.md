# Daily Training Log, 2026-07-04 Mechanics Test

## Practical lesson applied

The immediate priority is not more sprite polish. The simulation needs reliable visible feedback loops:

- Player orders something.
- The world visibly responds.
- Time passes.
- A character or service NPC performs the exchange.
- Stats update after the action completes.

## Techniques applied

- Use visible dynamic props for service NPCs.
- Use object state flags for clear visual changes, such as fridge open.
- Route cross-floor tasks through object interactions instead of raw coordinate movement.
- Add new rooms and object kinds in small slices so the house can expand safely.
- Give together activities an invite/consent gate instead of forcing synchronized behavior.

## Mistakes to avoid

- Do not let offsite, delivery, or build actions collapse into text-only notifications.
- Do not instantly raise stats before a visible activity completes.
- Do not teleport partners into together actions as a final solution.
- Do not build garage, travel, theater, and memory all in one oversized fragile commit.
- Do not claim live testing if the environment could not run it.

## Next revisit

- Manual browser testing of delivery, fridge, cooking, basement, and together consent.
- If stable, next small feature should be persistent construction timers or the first invite picker UI.
