## 2026-07-11, Invite Proximity and Phone Consent Pass

Status: NEEDS_TESTING
Branch: mechanics-first-invite-proximity-2026-07-11
Commit: 11f586ad3d1f40384cf5e885e4254e27a986eecc
Files changed: src/actions.js
Runtime files changed: yes
Render playable branch updated: no

Summary:
Updated the current main based invite flow after auditing the latest vehicle, visual, log, handbook, and runtime changes. Local shared activity invitations now use actual proximity and room hearing instead of treating every person on the same floor as automatically reachable. Offsite human invitations use a phone path while preserving refusal for busy states and urgent needs.

Implementation details:
- Local partner candidates are sorted by physical distance.
- The system prefers the nearest candidate who can realistically hear and accept.
- Same room, different room, bathroom privacy, floor, and distance affect hearing.
- Unheard local requests do not create a fake not rn reply.
- Human offsite invitees use phone contact, so floor and distance do not block the request.
- Busy movement, timed actions, showering, toilet use, cooking, eating, urgent bladder, urgent hunger, and exhaustion still cause refusal.
- Dogs remain subject to physical invitation rules.

Testing performed:
- Reconstructed src/actions.js passed node --check before commit.
- GitHub write completed successfully on the safe branch.
- No Render settings were changed and no deployment was triggered.

Testing requested:
- Put two people in the same room at different distances and start a together activity.
- Put the invitee in another room on the same floor and confirm distant requests are not heard.
- Put the invitee in the bathroom, shower, or toilet and confirm privacy range applies.
- Start an offsite trip with a human elsewhere in the house and confirm the phone invite is received.
- Confirm busy and urgent need refusals still show not rn.

Known risks:
- Hearing ranges, 260 same room, 135 across rooms, and 85 during private bathroom actions, need live tuning.
- Trait, relationship, mood, favorites, dislikes, routines, and memory weighting are not yet part of consent.

Next target:
Add trait, relationship, mood, preference, routine, and recent memory weighting to invitation consent without weakening firm busy and urgent need refusals.
