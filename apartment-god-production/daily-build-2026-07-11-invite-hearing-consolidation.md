# Apartment God Daily Build Log, 2026-07-11

Status: NEEDS_TESTING

Branch: `mechanics-first-invite-hearing-2026-07-11`

Runtime commit carried forward: `8e4a052ebf95c45ebb504b17b4cba7b1fcc08446`

Prior log commit carried forward: `bd8e167038e2edaa6bba4ad2a81a76c47d39036c`

Files changed on the carried runtime pass: `src/actions.js`

Files added this run: this audit log

Render playable branch updated: no

Backup branch: `backup/phaser-migration-before-invite-hearing-2026-07-11`

Summary:

Audited the current repository and found that realistic local invite hearing and explicit phone based offsite invitations had already been implemented on `mechanics-first-phone-invites-2026-07-10`, but had not been carried onto the active `phaser-migration` development line. The implementation branch was verified to be based directly on the current `phaser-migration` head, including the newer calendar and booked offsite duration work, so it was carried intact onto this fresh safe branch instead of being rewritten or duplicated.

Implementation present on this branch:

- Local together invitations check floor, room, distance, and bathroom privacy before an invitee can respond.
- Unheard requests do not create a fake spoken refusal.
- Offsite invitations to people use an explicit phone path, so physical distance does not block the request.
- Invitees still refuse while moving, timed busy, showering, using the toilet, cooking, eating, urgently hungry, urgently needing the bathroom, or exhausted.
- Dogs remain on physical invitation logic rather than phone logic.

Testing performed:

GitHub branch comparison and source inspection only. The carried branch is two commits ahead of the current `phaser-migration` base and does not discard the newer calendar, privacy overlay, or booked offsite duration work. A local clone, npm checks, browser test, and Render test could not be run because the execution environment could not resolve GitHub for cloning.

Testing requested:

Test a together activity with the invitee nearby, far across the same room, elsewhere on the same floor, on another floor, and inside a bathroom. Then test an offsite invitation while the invitee is elsewhere in the house, busy, hungry, exhausted, showering, and available.

Known risks:

The initial hearing ranges still need in game tuning. Offsite phone invitations currently assume human invitees have phone access. The shared activity system still selects the first eligible person rather than ranking by distance, relationship, mood, traits, favorites, dislikes, or routine.

Follow ups:

Add consent scoring and partner selection that considers distance for local requests, relationship, mood, traits, favorites, dislikes, current routine, recent memories, and urgent needs, while keeping firm busy and privacy refusals.