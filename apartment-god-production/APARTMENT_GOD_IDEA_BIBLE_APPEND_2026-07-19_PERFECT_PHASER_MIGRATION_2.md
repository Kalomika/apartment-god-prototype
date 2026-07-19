# Apartment God Idea Bible Append: Perfect Phaser Migration 2

Date: 2026-07-19
Status: ACTIVE DIRECTIVE
Branch: phaser-migration-2

Kam directed the development team to perfect the current Phaser Migration 2 branch after the full visual and runtime audit.

The directive means:

1. Fix critical runtime faults before expanding visual scope.
2. Do not allow duplicate actor bodies during activities.
3. Never let a recovery screen re-enter the broken normal update loop.
4. One optional activity or object-state asset must not prevent the game from booting.
5. Reduce mobile startup and decoded texture memory by loading activity/state assets on demand.
6. Bind activities and object states to the exact object being used.
7. Preserve native Phaser scene ownership and current gameplay systems.
8. Do not import the old Canvas renderer as the solution.
9. Generated SVG-to-PNG shape assets remain temporary fallbacks and must not be represented as approved final art.
10. Final character work must return to the staged approval ladder: static true top-down proof, walk cycle, sitting, then individual activity animation families.
11. Permanent visible architecture, furniture, vehicles, and character art should move to authored assets. Phaser Graphics should remain only for genuinely dynamic effects or diagnostics.
12. Current main and Phaser Migration 2 must be reconciled selectively through a feature audit, never by a blind merge.

Approval standard:

- No black canvas.
- No duplicate actor body.
- No broken activity-to-object alignment.
- No whole-scene failure because one optional asset is missing.
- No claim of final visual quality based only on PNG format or file count.
- Browser and phone confirmation are required before promotion.
