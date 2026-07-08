# Apartment God Ongoing Log Appendix, 2026-07-08 Force Guided Mode

This appendix records a runtime patch that should be merged into `apartment-god-production/ONGOING_DESIGN_LOG.md` if another AI has full file editing context. It is separate only because the GitHub connector response truncated the main log while this patch was being made.

## 2026-07-08 07:10 AM CT, Force Guided Commands and Together Activities

Status: NEEDS_TESTING
Branch: phaser-migration
Commit: test helper 43abeffeb03bd9111dbd8db8c30326ae3acb4ed0, actions 6da8dd3475fa47cce3a31b5830fe141506b62384, ui 9cc95cfa7102ff5c4ff1d279c1bdab1b94ba786f, sharedActions ddf03d3a5cdb0db7a507ca167721ae55c5fbef66, appendix cleanup note after 0a75e6674a3a2b651617196b72f6246c9412433c
Files changed: src/testModeActions.js, src/actions.js, src/ui.js, src/sharedActions.js, this appendix file
Runtime files changed: yes
Render playable branch updated: pending mirror in same chat
Backup branch: previous fallback backup is backup/phaser-migration-before-guided-state-cleanup-2026-07-08. A new backup branch attempt was blocked by tool workflow mistakes, so this entry is explicit about the current restore point.

Summary:
Kam reported that test mode still did not interrupt every activity and that together actions had never visibly worked. This patch makes guided mode act like a real test override. Commands in guided mode should not queue behind activities. Together activities should pull the partner into the activity instead of relying on normal invite acceptance logic.

Implementation details:

- Added `src/testModeActions.js` with force helper functions for future use.
- Updated `src/actions.js` so `startObjectAction`, `startSocialAction`, and `startOffsite` support `{ force: true }`.
- `{ force: true }` clears the actor path, target, pending task, queued task, action timer, recovery counters, stopped state, pose, and non luggage carrying item before starting the new command.
- Object targets now carry `target.force = true` so arrival resolution can tell when a command came from guided test mode.
- Together actions now use forced together arrival when `target.force` is true.
- Forced together behavior finds the other visible person, interrupts them, sends them to the same object if needed, or starts them in the same activity if already nearby.
- Guided mode bypasses normal invite refusal checks in `canInviteeJoin`.
- `src/ui.js` menu commands now pass `{ force: true }` in guided mode for object, social, and offsite actions.
- `src/sharedActions.js` now passes `{ force: true }` when `state.autonomyMode === 'guided'`, so phone activity buttons like Watch TV Together and Go To Bed Together use test mode authority.
- Several accidental temporary files under `tmp/ignore*.txt` were created and removed during connector tool misuse. No temporary files are intended to remain.

Testing performed:
Code inspection only. No local or Render browser test performed in this chat.

Testing requested:
Refresh the Render link after main is updated. Reset. Start any activity, then command another object action immediately. Confirm the actor cancels the current activity instead of queueing. Then test Watch TV Together, Go To Bed Together, Play Pool Together, Console Together, Darts Together, and Swim Together. Confirm both people participate or at least both route toward the same shared object.

Known risks:
This is intentionally forceful in guided mode. It may look abrupt, but that is correct for testing. Future normal mode should use negotiation and refusal again.

Follow ups:
Merge this appendix into the main ongoing design log when a future edit can safely append without truncation. Then fix thought bubbles versus speech bubbles.
