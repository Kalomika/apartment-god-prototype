# Top Shot Four Block Test Board

Branch: top-shot-v0-2-test-board

Purpose: strip the arena down so movement, hiding, combat, and command response can be judged without the previous terrain noise.

Implemented:

- The arena now has four solid blocks.
- The lower two blocks have shadow zones for hiding.
- A new batch starts with no fighters on the board.
- Pressing Begin Batch creates the selected fighters.
- The fighters enter from above the playfield, land at their spawn points, then the match changes to running.
- Commands and coach drops are blocked until the fighters have landed.
- The original Top Shot v0.1 branch was preserved before attempting promotion.

Preserved:

- Core fighter archetypes.
- AI versus AI combat.
- Coach drops.
- Coach command suggestions.
- Damage, stamina, hiding, cover, wounds, recovery, and finish logic.

Manual test checklist:

1. Open the top-shot folder from this branch.
2. Confirm the board is empty at first load.
3. Press Begin Batch.
4. Confirm both selected fighters enter and land.
5. Confirm the arena only has four blocks.
6. Confirm the bottom two blocks create hiding behavior.
7. Confirm commands and drops only work after landing.
