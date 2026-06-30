# Top Shot Current Codex Task

Read this after `top-shot/docs/codex-operating-rules.md`.

This file is the short task brief for the next Codex or agent-mode session. ChatGPT can update this file so Kam does not have to paste a giant prompt every time.

## Current status

Live playtest branch:

```text
top-shot-v0-1
```

Current live checkpoint:

```text
07374a92b0b698bcba40a383ce4fc6312ccd422b
```

Live playtest link:

```text
https://top-shot-prototype.onrender.com/?v=07374a92
```

## What recently changed

The previous WIP branch was promoted to the live playtest branch.

Reported improvements:

- safer route selection
- better cover destinations
- route caching
- improved stuck recovery
- planted 4-frame run poses
- clearer flat sprite anatomy
- side-aware close-range defense responses
- clearer block, dodge, parry, counter, and weapon-response effects
- handler-facing request portrait preserved

Reported weaknesses:

- close-range pose readability needs longer manual playtesting
- fighters may still spend too long routing or investigating before engaging
- sprites are more readable but still symbolic rather than polished authored sprite art

## Next recommended task

Do a live-playtest-focused iteration.

Priority:

1. Make the phone/browser playtest easy to verify.
2. Reduce long routing/investigation loops that delay exchanges.
3. Make command-driven close engagement happen more decisively.
4. Improve close-range pose readability during actual exchanges.
5. Preserve wall avoidance and stuck recovery.
6. Preserve the handler-facing request portrait.

## Required workflow

Follow `top-shot/docs/codex-operating-rules.md` exactly.

Use a WIP branch while working.

After each working milestone:

```bash
npm run check
git add .
git commit -m "WIP: <specific milestone>"
git -c http.sslBackend=schannel push
```

At final validation:

```bash
npm run check
npm run smoke
npm run build
```

If all pass, promote to `top-shot-v0-1` so Kam can play the newest checkpoint.

Final report must include:

- WIP branch name
- latest pushed commit SHA
- final live branch SHA if promoted
- files changed
- commands run
- pass/fail results
- what was visually tested
- what still looks weak
- live Render playtest link
