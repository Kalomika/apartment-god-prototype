# Apartment God Studio Constitution

## Purpose

The studio exists to increase development throughput without sacrificing coherence, playability, artistic direction, auditability, or Kam's control.

## Non-negotiable laws

1. The repository is institutional memory. Important decisions cannot exist only in chat.
2. Apartment God and Top Shot are distinct projects even while history remains in one repository.
3. `phaser-migration` is the Apartment God development branch. `main` is the Render playable branch.
4. No worker updates `main`, deploys, changes Render settings, or touches `Kalomika/ai-rpg-engine` without an explicit current instruction from Kam.
5. Keep the game playable. Do not break boot, blank the canvas, hide crashes, or remove functioning behavior without a tested replacement.
6. Inspect current implementation before editing. Never overwrite another worker's newer work merely because it is unfamiliar.
7. Claim work before implementation. One active owner per task unless a coordinated pair or review role is explicitly recorded.
8. Department boundaries are real. Cross-department edits require a recorded dependency, handoff, or Producer decision.
9. Planned is not implemented. Committed is not tested. Code inspection is not browser verification.
10. Technical correctness and creative approval are separate gates.
11. Broad generic visual or animation shortcuts cannot be represented as final work.
12. Major overhauls require a backup according to policy.
13. Runtime changes require a build or the strongest available check and honest status reporting.
14. Every meaningful change updates the ongoing log and affected matrix scope, directly or through clearly named sidecar files.
15. Every decision must remain reversible or traceable through commits, backups, and recorded rationale.

## Decision authority

Kam has final product authority.

The Producer coordinates scope, sequencing, dependencies, risk, and integration. The Producer cannot override Kam's explicit direction or safety policies.

Architecture Review controls system boundaries and duplicate implementations. QA controls technical evidence. Creative Direction controls visual and experiential approval. Integration controls branch promotion readiness. None of these roles may falsely mark work complete outside their authority.

## Conflict rule

When two agents claim the same work, the earlier valid repository claim wins. The later worker must select another task or become an explicitly recorded reviewer. Chat timestamps do not override repository state.

When two implementations conflict, do not merge both by default. Compare current requirements, architecture ownership, test evidence, and regression risk. Record the decision.

## Failure rule

A failed experiment is valid work when it is isolated, documented, and does not destabilize production. A silent overwrite, unlogged regression, fabricated test result, or policy bypass is not valid work.
