# Apartment God — Idea Log (Claude capture 2026-07-23)

> Per Kam: **every idea he spews should be logged somewhere**, separated into ideas to *push through*
> vs. *tentative/parked* ideas. This is that ledger for the 2026-07-23 session. Canonical merge into
> the Idea Bible pending at next safe documentation sync. **Canonical merge pending: yes.**

Status legend: **GREENLIT** = build it now / this cycle · **DIRECTIVE** = standing rule going forward ·
**PARKED** = good idea, not now (revisit) · **MAYBE** = tentative, needs a decision.

---

## Character & visual direction

- **[DIRECTIVE] 8 directions for ALL characters** (current + any future/created characters). Should have
  been stated in the dev logs earlier; now logged. Applies to every pose/animation set.
- **[DIRECTIVE] Faceless sprites.** Characters are small; no eyes/nose/mouth. Only facial detail allowed
  is **facial hair** (stubble/mustache/goatee/beard). Imagined detail over drawn detail.
- **[DIRECTIVE] Aesthetic target:** late-'80s/early-'90s rotoscope realism (Flashback / Out of This
  World), 80s/90s anime (Cowboy Bebop), Blade Runner cyberpunk noir — "The Sims set in Blade Runner
  time." Modern engine fidelity, retro sprite sensibility. Not too clean; some grit.
- **[DIRECTIVE] Fire Pro Wrestling-style deep layering.** Everything swappable: head, hair, facial hair,
  chest, arms, forearms, hands, thighs, calves, socks, shoes, costume pieces — all interchangeable
  without breaking. Study Fire Pro's 2D layered part system as the reference architecture.
- **[DIRECTIVE] Always-present base body layer (never fully nude).** Male base = briefs (+ optional
  socks); female base = sports two-piece (reads athletic, not lingerie). Base parts recolor. Enables
  swimming and shower/undressed states without nudity.
- **[GREENLIT] Two parallel Claude interpretation builds:** (1) exact/strict top-down, (2) slightly
  isometric/asymmetric. Kam will play both and pick. Practically two games; scope is OK because the
  world hasn't expanded to neighborhood/city yet.
- **[MAYBE] B&W / white-outline version** (everything white with outlines, like the line-art refs).
  Doubles as a race-neutral presentation. Decision: try color first; do B&W after if color anime look
  can't be nailed while keeping gameplay/animation structure intact. (A `lineart` render mode already
  scaffolded in the character system.)

## Nudity / shower / decency handling (kid-safe but feels like real people)

- **[DIRECTIVE] Never fully nude on screen.** Always a covered setting. Options to combine:
  steam covers the character in the shower; grab towel from an in-shower rack and wrap; a
  slight-roof/covered dressing area; or a quick blur / "magic pop" clothes-on transition (cheesy but
  acceptable). Figure exact method later.
- **[DIRECTIVE] Anatomy is *implied, never explicit* at sprite scale.** Female: chest bulges but no
  nipple dots; no bush/genitalia on anyone. Existing urinating animation's yellow stream comes from the
  sprite, not drawn anatomy. Characters are anatomically correct but too small to show detail.

## Game-identity / meta ideas

- **[PARKED] "Blobs" as a shipped concept.** The blobbier first iteration could have been its own game
  named *Blobs* with an intentional procedural/blobby aesthetic (Minecraft-style: not high-fidelity but
  a recognizable identity). Not the current direction, but the **interchangeable-but-not-overly-painted
  principle is retained** — keep everything layer-swappable so nothing breaks, even as fidelity rises.
- **[PARKED] Test-lab room as a live iteration surface.** The tester room to the right of the living room
  (slide right) could be where updates are previewed before pushing to the main house. Kam leaned
  against making it the *only* workflow (anticipates test-room-vs-main-house crossover issues); current
  methodology = update the real game where things work, fix what doesn't. Keep the test-lab idea parked.

## World expansion (context, not now)

- **[PARKED] Neighborhood / city expansion.** Not yet built; keeps current scope small enough to try two
  full visual interpretations.

---

*Maintainer note:* new ideas from Kam get appended here with a status tag. Promote PARKED/MAYBE items to
GREENLIT/DIRECTIVE only on Kam's explicit go-ahead.
