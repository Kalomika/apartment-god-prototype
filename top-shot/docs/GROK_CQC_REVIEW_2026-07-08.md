# Grok CQC Review, 2026-07-08

Kam pasted an external review identifying the CQC Lab collapse as a 2D state to 3D rig integration problem.

Key points adopted:

- CQC should not be loose physics nudging.
- Pushboxes, hurtboxes, hitboxes, move timing, and visual poses need to be separated.
- Mount should be a staged kinematic relationship, not two bodies sharing the same world center.
- Auto mode should not keep forcing movement and attacks without settle time.
- 3D actors need explicit anchored handling for mount, grounded, and CQC idle states.
- Weapons should be hidden/holstered in unarmed CQC states.

Immediate patch target:

- Strengthen visual anchoring in `top-shot/src/three/effects3D.js` so mount and grounded states render as controlled combat poses even while the lab state machine is still being refactored.
- Log this as an interim stabilization patch, not the final fighting-game hitbox architecture.
