# Development Matrix Append, 2026-07-12, Reading Book Lifecycle and L Couch Pass

Status: PARTIAL IMPLEMENTED, NEEDS_BROWSER_TESTING
Branch: phaser-migration
Backup branch: backup/phaser-migration-before-reading-book-messiness-pass-2026-07-12

## Matrix rows affected

| Matrix area | Row | Previous state | New state | Notes |
|---|---|---|---|---|
| Object Interaction Matrix | Bookshelf | NEEDS_CORRECTION | PARTIAL, NEEDS_BROWSER_TESTING | Bookshelf reading now produces a carried book and routes to a reading seat instead of instant broad reading. |
| Object Interaction Matrix | Couch | NEEDS_CORRECTION | PARTIAL, NEEDS_BROWSER_TESTING | Modern L couch overlay exists with separate left and chaise reading seats. Collision geometry not replaced yet. |
| Object Interaction Matrix | Outdoor reading chairs | PLANNED | PARTIAL, NEEDS_BROWSER_TESTING | Front porch reading chairs render as first pass reading seats used by the book system. |
| Activity Matrix | Reading | BROAD | PARTIAL, NEEDS_BROWSER_TESTING | Reading can involve pull book, carry book, sit, finish, return, or leave book behind. |
| Calendar Matrix | Household chores | PARTIAL | PARTIAL, NEEDS_BROWSER_TESTING | Return loose book chore can be scheduled and started by calendar runtime. |
| Messiness Matrix | Loose book | PLANNED | PARTIAL, NEEDS_BROWSER_TESTING | Loose book appears on surface, hits tidiness, and can be returned later. |
| Trait Matrix | Tidy/meticulous behavior | PLANNED | PARTIAL, NEEDS_BROWSER_TESTING | Meticulous actor is more likely to return book immediately; deeper autonomy cleanup is still needed. |
| Visual Matrix | Book/tidiness cues | PLANNED | PARTIAL, NEEDS_BROWSER_TESTING | Loose books, L couch overlay, porch chairs, and tidiness cue render as Canvas first pass. |
| Imperfection Matrix | Incomplete tasks | PLANNED | PARTIAL, NEEDS_BROWSER_TESTING | Player interruption or time pressure can leave book unfinished and visibly messy. |
| Future Pattern | Towels/clothes/dishes | PLANNED | STILL_NEEDED | Use book lifecycle pattern for towels, clothing piles, dirty dishes, and other imperfect household behaviors. |

## Required browser checks

```txt
Bookshelf read route.
Second person reads while couch is occupied by TV/movie watcher.
Porch reading seat selection.
Book return after reading.
Book left on surface when interrupted.
Tidiness cue after loose book.
Return loose book calendar chore.
Movement/pathing around the L couch overlay.
```
