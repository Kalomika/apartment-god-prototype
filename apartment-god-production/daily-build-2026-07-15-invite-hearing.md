# Daily Build, 2026-07-15, Invite Hearing and Phone Consent

## Repo audit

Started from current `main` at `1ebc880bdf550faac16f6d4383ef9da18689efc4` after the living, dining, kitchen cleanup and active dog atlas work. Reviewed the current action runtime, together activity flow, offsite party invitations, README Render instructions, recent commits, and prior invite mechanics commits before editing.

## Anomaly

Together activities selected the first visible person on the same floor. The selection did not consider proximity, room boundaries, bathroom privacy, or whether the invitee could realistically hear the request. Offsite invitations reused the same physical hearing rules even though human invitees should be contacted by phone.

## Implementation

- Local together candidates are sorted by distance.
- The system prefers the nearest candidate who can hear and is available.
- Hearing checks now use floor, room, distance, and shorter bathroom privacy range.
- Unheard requests do not produce a fake `not rn` reply.
- Human offsite invitees use phone contact, while dogs remain physically constrained.
- Existing firm refusals remain for movement, timed actions, cooking, eating, showering, toilet use, urgent hunger, urgent bladder need, and exhaustion.
- Accepted together activities still use `commandSocial`, requiring the invitee to move to the caller before the shared action starts.

## Initial tuning values

- Same room hearing range: 260
- Different room on same floor: 135
- Shower or toilet privacy: 85

These values require browser tuning.

## Safety

- Safe branch only.
- No Render settings changed.
- No deployment.
- `main` unchanged.
- `Kalomika/ai-rpg-engine` untouched.

## Remaining

Consent still needs trait, relationship, mood, favorites, dislikes, routine, and recent memory weighting. Human phone access is currently assumed. Browser testing is needed for hearing range and shared activity staging.
