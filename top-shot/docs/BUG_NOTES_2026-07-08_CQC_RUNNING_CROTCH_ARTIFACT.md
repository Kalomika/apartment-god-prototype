# CQC Lab Bug Note, 2026-07-08

Reported issue:

- In CQC Lab, fighters appear to be running in place while standing face to face.
- The topless/rugged fighter appears to have something protruding from the crotch area, possibly a weapon or bad marker, and it looks like it blocks the other fighter from coming closer.

Likely code causes to inspect/fix:

- Actor weapon placement in `top-shot/src/three/actors3D.js`, especially rifle placement on the survival commando in close combat.
- CQC pose mapping in `poseState()` and `applyPose()`.
- CQC lab spacing in `top-shot/src/cqcLab.js` that may be constantly nudging the fighters and triggering leg animation.

Fix intent:

- Hide or holster long weapons in CQC Lab until a weapon-specific move is being tested.
- Use a neutral guard idle that does not animate like running.
- Keep spacing using body collision without visible markers or crotch artifacts.
