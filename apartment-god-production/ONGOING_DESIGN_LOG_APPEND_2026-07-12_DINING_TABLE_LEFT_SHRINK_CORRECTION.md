# 2026-07-12, Dining Table Left Shrink Correction

Status: IMPLEMENTED, NEEDS_BROWSER_TESTING
Branch: phaser-migration

## Files changed

```txt
src/world.js
```

Runtime files changed: yes
Vehicle files changed: no
Render playable branch updated: no
Main updated: no
PR opened: no
Deploy performed: no
Render settings changed: no

## Summary

Corrected the dining table placement after the prior pass overcorrected it upward into the kitchen. The table was supposed to move left away from the doorway and become smaller, not be pushed upward into the kitchen movement lane.

## Implementation details

- Dining table changed to a smaller footprint.
- Dining table moved left.
- Dining table kept in the lower kitchen area rather than high into the kitchen.
- Dining table approach point now resolves to the left side of the table so eating does not use the doorway lane as the standing point.

## Testing requested

```txt
Open Main House.
Check the kitchen and entry doorway.
Confirm the dining table is left and smaller.
Confirm the doorway path is clear.
Send a character to eat at the dining table and confirm they approach from the left side rather than from the doorway.
```
