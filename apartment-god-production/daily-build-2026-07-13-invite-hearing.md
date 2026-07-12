# Daily Build, 2026-07-13, Invite Hearing and Phone Consent

Status: NEEDS_TESTING

Branch: mechanics-first-invite-hearing-2026-07-13

Runtime commit: 11f586ad3d1f40384cf5e885e4254e27a986eecc

Files changed:

- src/actions.js
- apartment-god-production/daily-build-2026-07-13-invite-hearing.md

## Repo audit

The current main branch still used the older together invite flow. It selected the first visible person on the same floor, treated that person as able to hear the request regardless of room boundaries or distance, and reused physical hearing for offsite invitations.

Recent main work was reviewed before restoring this mechanics change. The branch is based directly on the current main commit, 6e67b61831e297ee784019141ed3e0fdf575ff16, and is one runtime commit ahead before this log entry.

## Improvement

Local together invitations now:

- Rank same floor human candidates by physical distance.
- Prefer the nearest candidate who can hear and accept.
- Check current floor, room, and distance.
- Use shorter hearing range for shower and toilet privacy.
- Avoid fake refusal speech when the invitation was not heard.
- Keep shared activities gated behind the invitee walking to the caller before the activity begins.

Offsite invitations now:

- Use phone contact for human invitees, so floor and physical distance do not block the invitation.
- Preserve refusal for movement, timed actions, showering, toilet use, cooking, eating, urgent bladder need, urgent hunger, and exhaustion.
- Keep dogs on physical availability rules.

## Testing performed

- GitHub compare confirmed the runtime commit is one commit ahead and zero behind current main.
- The runtime diff is limited to src/actions.js, with 26 additions and 5 deletions.
- Source inspection confirmed the branch uses the existing roomAt helper and does not change Render settings.
- Local clone, node syntax check, and browser testing could not run because this execution environment could not resolve github.com.

## Testing requested

In the browser build, test:

1. A nearby same room invite.
2. A same floor invite from another room.
3. A distant same floor invite that should not be heard.
4. A shower or toilet invite from outside the bathroom.
5. An offsite invite while the invitee is on another floor.
6. An offsite invite while the invitee is busy or has an urgent need.
7. Confirm accepted together activities still wait for both actors to reach the shared activity position.

## Known risks

- Initial hearing ranges, 260 same room, 135 across rooms, and 85 during private bathroom actions, need real game tuning.
- Phone invitations currently assume human characters have phone access.
- Consent still needs trait, relationship, mood, favorites, dislikes, routines, and recent memory weighting.

## Next target

Add relationship, trait, mood, preference, routine, and recent memory weighting to invite consent while preserving firm privacy, busy, and urgent need refusals.
