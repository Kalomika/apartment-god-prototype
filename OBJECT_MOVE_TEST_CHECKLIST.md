# Object Move Test Checklist

Reported issue: moving the library/bookshelf did not visibly work and characters gave too little feedback.

Test steps:

1. Select the library/bookshelf.
2. Press Move.
3. Character should say `WHERE?`.
4. Tap a valid destination.
5. Character should say `MOVE` and walk to the object.
6. Character should say `LIFT` once carry starts.
7. Object should follow the character.
8. Object should land at the destination.
9. Character should say `DONE`.

Implementation note:

The moving character now ignores the carried object during movement collision, so the character should not block against the same object being moved.
