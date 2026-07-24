# Development Matrix Patch, Invite Hearing Recovery Audit

Date: 2026-07-24 CT
Branch: repair/recovery-invite-hearing-2026-07-24
Canonical merge status: pending safe documentation sync

## Together Activities and Invite Consent

Status: NEEDS_TESTING

Current verified code state:

- Shared object activities locate a visible same floor person and ask whether they can join.
- Accepted invitees are routed toward the caller before the timed social activity starts.
- Busy actors and actors with urgent hunger, bladder, or energy needs may refuse.
- Current hearing logic only checks whether actors share a floor.
- Shower and toilet actors are currently treated as hearing the request regardless of actual distance.

Required correction:

- Add a real distance based hearing check before consent evaluation.
- Use a shorter hearing radius for shower, toilet, and bathroom states.
- Do not show not rn or another invitee speech bubble when the request was not heard.
- Preserve short responses such as yeah and not rn only when the invitee realistically heard the request.
- Keep accepted together activities dependent on movement into a shared activity position before the action timer starts.

Testing matrix:

1. Nearby same floor invitee hears and may accept.
2. Far same floor invitee does not hear and does not answer.
3. Different floor invitee does not hear and does not answer.
4. Nearby showering invitee may hear but refuses.
5. Far showering invitee does not hear and does not answer.
6. Toilet or bathroom invitee behind the room boundary only hears at close range.
7. Accepted invitee reaches the shared zone before the timed action begins.

Risk:

The runtime source branch for the visual recovery has not yet been finalized. Apply this patch only after the recovery baseline is confirmed, so the mechanics fix is not stranded on the rejected Phaser presentation.
