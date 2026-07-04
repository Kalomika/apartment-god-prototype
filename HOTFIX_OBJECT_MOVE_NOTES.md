# Hotfix: Object Move Feedback and Collision

This hotfix addresses the reported issue where pressing Move on the library/bookshelf did not clearly move the object or acknowledge the command.

## Changes

- Characters now say `WHERE?` when a movable object is selected for moving.
- Characters now say `MOVE` when they begin moving toward the object.
- Characters now say `LIFT` when carrying begins.
- Characters now say `DONE` when the move finishes.
- Invalid placement now sets a visible action and `NO` bubble.
- The carried object is ignored by movement collision while being moved, so the mover does not block against the same object they are carrying.

## Manual test

1. Select the library/bookshelf.
2. Press Move.
3. Confirm the selected character says `WHERE?`.
4. Tap a valid destination.
5. Confirm the character says `MOVE`, walks to the object, then says `LIFT`.
6. Confirm the object follows the character and lands at the destination.
7. Confirm the character says `DONE`.
