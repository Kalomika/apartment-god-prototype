# Apartment God Daily Build Log, 2026-07-10

Status: NEEDS_TESTING

Branch: `mechanics-first-phone-invites-2026-07-10`

Runtime commit: `8e4a052ebf95c45ebb504b17b4cba7b1fcc08446`

Files changed: `src/actions.js`, this log

Render playable branch updated: no

Summary:

Corrected the shared invite decision path so local together activity invitations use floor, room, distance, and bathroom privacy hearing rules, while offsite invitations to people use an explicit phone path. Invitees still refuse for active movement, timed actions, showering, toilet use, cooking, eating, urgent bladder or hunger, and exhaustion. Unheard local invitations no longer create a fake spoken refusal bubble.

Testing performed:

The reconstructed file passed `node --check` before the GitHub update. The committed branch was reviewed by source inspection. No browser, Render, or full repository build was run because the execution environment could not reach GitHub to clone dependencies.

Known risks:

Hearing ranges of 260 units in the same room, 135 across rooms, and 85 around bathroom privacy are initial tuning values and need browser testing against the actual room scale. Offsite phone invites currently assume invited people have phone access. Dog invitations remain physical rather than phone based.

Testing requested:

Test a together activity with the invitee nearby, far across the same floor, on another floor, and inside a bathroom. Then test an offsite group invitation while the invitee is elsewhere in the house, busy, hungry, exhausted, showering, and available.

Next target:

Add trait, mood, relationship, favorites, dislikes, and routine weighting to consent without weakening urgent need and busy state refusals.
