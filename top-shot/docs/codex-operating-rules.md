# Top Shot Codex Operating Rules

This file is the persistent instruction source for Codex, ChatGPT agent mode, or any other coding agent working on Top Shot.

Every Top Shot coding session must read this file first before planning or editing.

Project root:

```text
top-shot/
```

Do not touch anything outside `top-shot/` unless Kam explicitly says otherwise.

Do not touch `main` directly.

The live playtest branch is:

```text
top-shot-v0-1
```

The live Render playtest URL is:

```text
https://top-shot-prototype.onrender.com/
```

When reporting a playable build, always include a cache-busted link:

```text
https://top-shot-prototype.onrender.com/?v=<commit-sha-or-short-label>
```

## Core workflow

The finish line is not just passing checks. The finish line is that Kam can open the latest checkpoint on his phone or browser and play it.

For any task larger than a tiny text-only edit:

1. Start from latest remote `top-shot-v0-1`.
2. Create a WIP branch.
3. Push the WIP branch immediately.
4. Work in milestones.
5. After each working milestone, run at least `npm run check`, commit, and push WIP.
6. After final validation passes, promote the working checkpoint to `top-shot-v0-1` so the Render playtest updates.
7. Report the live Render link.

## Start every session

Run:

```bash
git -c http.sslBackend=schannel fetch origin
git checkout top-shot-v0-1
git -c http.sslBackend=schannel pull origin top-shot-v0-1
git status
git rev-parse HEAD
git rev-parse origin/top-shot-v0-1
```

Confirm local `HEAD` matches `origin/top-shot-v0-1` before starting.

If local Git CA certificates fail, keep using:

```bash
git -c http.sslBackend=schannel ...
```

## WIP branch rule

For major tasks, create a WIP branch:

```bash
git checkout -b codex-wip/top-shot-<short-task-name>
git -c http.sslBackend=schannel push -u origin codex-wip/top-shot-<short-task-name>
```

Keep task names short and clear, for example:

```text
codex-wip/top-shot-nav-movement-cqc-pass
codex-wip/top-shot-mobile-controls
codex-wip/top-shot-combat-lab
codex-wip/top-shot-sprite-pass
```

## Checkpoint rule

Do not keep valuable work only in a local Codex environment.

After every working milestone:

```bash
npm run check
git status
git add .
git commit -m "WIP: <specific milestone>"
git -c http.sslBackend=schannel push
```

Milestones should be small enough that another agent can understand them:

- navigation / wall grinding
- movement animation
- sprite anatomy / renderer
- CQC move library
- side-aware defense
- mobile controls
- HUD / handler feedback
- final validation cleanup

If usage or approval limits are near:

1. Stop coding.
2. Commit safe work.
3. Push the WIP branch.
4. Append a handoff note to `top-shot/docs/codex-progress.md`.
5. Report the branch name and latest commit SHA.

Never leave resolved conflicts only staged locally.

## Live promotion rule

When final validation passes, promote the WIP checkpoint to the live playtest branch.

Run:

```bash
npm run check
npm run smoke
npm run build

git checkout top-shot-v0-1
git -c http.sslBackend=schannel pull origin top-shot-v0-1
git merge --ff-only <wip-branch-name>
git -c http.sslBackend=schannel push origin top-shot-v0-1
```

If fast-forward merge fails, stop and report. Do not force push unless Kam explicitly approves.

After pushing `top-shot-v0-1`, report:

- WIP branch name
- WIP commit SHA
- live `top-shot-v0-1` commit SHA
- commands run
- pass/fail results
- files changed
- what was manually tested
- what remains weak
- live playtest link

Always include the live playtest link:

```text
https://top-shot-prototype.onrender.com/?v=<commit-sha>
```

## Mobile-first playtest rule

Kam often tests from his phone. Assume the latest checkpoint should be playable on mobile unless the task is explicitly desktop-only.

Before final promotion, check or preserve:

- no horizontal overflow on narrow viewport
- canvas/HUD visible on phone-sized screens
- buttons large enough to tap
- command controls accessible
- no UI element blocking the match area unnecessarily
- live link supplied for phone testing

## Persistent docs to read

At session start, read these if they exist:

```text
top-shot/docs/codex-operating-rules.md
top-shot/docs/codex-current-task.md
top-shot/docs/codex-progress.md
top-shot/docs/reference-images/README.md
```

Do not paste the whole contents back to Kam. Summarize only what matters.

## Updating instructions without wasting tokens

ChatGPT may update `top-shot/docs/codex-current-task.md` or this operating-rules file between Codex runs. Codex should read those repo documents instead of requiring Kam to paste a giant prompt every time.

The normal tiny Codex prompt should be:

```text
Read top-shot/docs/codex-operating-rules.md and top-shot/docs/codex-current-task.md first. Follow them exactly. Work in WIP checkpoints. Promote to top-shot-v0-1 only after check/smoke/build pass. Report the live Render link.
```

## Game vision summary

Top Shot is an AI vs AI tactical combat prototype where Kam acts as coach, handler, commander, or trainer. The player influences the fighter with commands and drops instead of direct control.

Priorities:

1. Fighters stop grinding into walls.
2. Movement looks planted and human, not swimming.
3. Sprites read as top-down tactical humans, not alien blobs.
4. CQC shows real left/right limb action.
5. Defense is side-aware and line-aware: blocks, cross blocks, parries, slips, counters.
6. AI feels intentional: cover, lanes, flanking, commitment, retreat, reset.
7. Handler-facing request states remain intact.
8. Every checkpoint is playable through the live Render URL.

## Art reference rule

Use the images under:

```text
top-shot/docs/reference-images/
```

Use them as visual references only. Do not copy, trace, or recreate exact images. Extract principles:

- top-down human anatomy
- shoulder/head placement
- readable limbs
- planted run cycles
- tactical soldier readability
- CQC body contact
- handler-facing emotional read

The upward-looking man reference is for a handler-facing portrait/request state, not the main overhead combat sprite.

## No fake completion

Do not use stubs, empty TODOs, fake maps, placeholder moves, or comments claiming a system exists when it does not.

A small working system is better than a large fake one.

Every mechanic claimed in the final report must be backed by working code, test results, or a clear note that it still needs manual visual verification.
