## 2026-07-24 08:09 AM CT, Recovery Branch Invite Hearing Audit

Status: BLOCKED
Branch: repair/recovery-invite-hearing-2026-07-24
Commit: pending at entry creation
Files changed: apartment-god-production/ONGOING_DESIGN_LOG_APPEND_2026-07-24_INVITE_HEARING_RECOVERY_AUDIT.md
Runtime files changed: no
Render playable branch updated: no
Backup branch: main-gameplay-recovery remains untouched and is the source branch for this repair branch
Summary: Audited shared activity invitation and hearing behavior against the current recovery direction. No runtime patch was committed because the repository is in an active recovery transition and the latest explicit direction is to rebuild from the acceptable pre Phaser presentation while preserving verified gameplay only.
Implementation details: Code inspection found that src/actions.js canInviteeJoin checks floor but not actual actor distance. It also marks showering and toilet invitees as having heard the request regardless of distance or door and bathroom context. This can produce an unrealistic not rn response from an actor who could not hear the caller. The safe next patch is a focused hearing calculation using same floor distance, a shorter bathroom and shower hearing radius, and no response bubble when the request was not heard. Shared activities already route the accepting partner toward the caller before the timed social action begins, so that behavior should be preserved.
Testing performed: Repository identity, branch purpose, current recovery branch relationship to main, required handbook rules, backup policy, no broad implementation rule, PNG fallback, recent commits, and src/actions.js invitation flow were inspected. No browser or runtime test was performed.
Testing requested: After the recovery baseline is finalized, test a together invitation with the invitee nearby, far away on the same floor, on another floor, showering nearby, showering far away, and using the toilet behind the bathroom boundary. Nearby refusals may show not rn. Unheard requests must not create an invitee response bubble.
Known risks: Editing the current main derived Phaser runtime before the visual recovery source is finalized could create work that must be reimplemented or could reintroduce the branch direction Kam rejected. main is currently a Phaser runtime and main-gameplay-recovery contains documentation only beyond main.
Follow ups: Finalize the actual recovery runtime baseline, then implement the hearing distance correction as the first mechanics patch. Keep main and Render settings unchanged until Kam explicitly approves a tested playable update.
