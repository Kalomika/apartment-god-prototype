# Development Matrix Patch, P2 Character Unfreeze and Sprite Repair

Date: 2026-07-24
Branch: repair/phaser-migration-2-character-unfreeze-2026-07-24
Source: phaser-migration-2 at c63ae6f1593286c143c4c4947d644812116cb3c9
Status: NEEDS_TESTING

| Area | Status | Evidence | Remaining check |
|---|---|---|---|
| Empty stale pool route cleanup | IMPLEMENTED | `normalizeP2ActorMotionForTest` clears empty or malformed `poolRoute` | Browser finish pool then issue normal command |
| Completed stale Pool action cleanup | IMPLEMENTED | Untimed `Pool:` state returns to Idle | Browser pool exit and movement |
| Saved movement speed recovery | IMPLEMENTED | Human fallback 92, dog fallback 120 | Refresh old saved state and observe movement |
| Legacy stopped flag recovery | IMPLEMENTED | Normal actors resume unless `manualStop` or `labOnly` | Browser old save and explicit stop control |
| Intentional stop persistence | IMPLEMENTED | `stopEntity` and `resumeEntity` maintain `manualStop` | Browser stop and resume |
| Base directional sprite restoration | IMPLEMENTED | Movement and inactive actors force base visual visible | Browser walk and activity exit visual review |
| Stale activity sprite suppression | IMPLEMENTED | Optional activity sprite hidden during movement or after timer end | Browser transition review |
| Waking pose cleanup | IMPLEMENTED | Untimed unbound waking state returns to Idle and stand | Fresh boot and refresh test |
| Actor diagnostics | IMPLEMENTED | `window.__APARTMENT_GOD_P2_ACTORS__` | Inspect live AppDeploy frame |
| Automated regression suite | ADDED | `tests/phaser-migration-2-character-recovery.test.js` | Exact head CI pending |
| Main and Render | UNCHANGED | Repair branch only | No promotion without authorization |

Character asset quality remains separate from this freeze repair. The existing sheets still use four cardinal directions and do not satisfy the final eight-direction modular outfit standard.
