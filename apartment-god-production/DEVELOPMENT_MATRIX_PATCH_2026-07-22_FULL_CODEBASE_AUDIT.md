# Development Matrix Patch: Full Phaser Migration 2 Codebase Audit

Date: 2026-07-22
Status: AUDITED, REPAIR REQUIRED
Branch: phaser-migration-2
Runtime files changed: no
Main touched: no
Render settings changed: no
Backup required for audit: no, documentation-only inspection
Audit report: `apartment-god-production/PHASER_MIGRATION_2_FULL_CODEBASE_AUDIT_2026-07-22.md`

| Area | Honest status | Audit ruling | Required next state |
|---|---|---|---|
| Branch lineage | BLOCKER | P2 is approximately 184 commits ahead and 193 behind main. It is not a clean successor. | Main-versus-P2 reconciliation manifest and one declared authoritative migration branch. |
| Canonical handbook and matrix | STALE | Canonical docs still identify `phaser-migration`, while major work is on `phaser-migration-2`. | Merge accepted append facts into canonical control documents. |
| Phaser boot | PARTIAL, NEEDS TESTING | Phaser scene boots and owns the primary loop, but optional systems are not fault isolated. | Built-browser test and subsystem-level recovery. |
| Runtime ownership | BLOCKER | Runtime, parity, reference completion, backdrop, HUD, gameplay visuals, and layer safety modify overlapping categories. | One scene-owned presentation coordinator. |
| Renderer inventory | CRITICAL | Active P2, legacy Canvas, failed modern procedural, and orphaned scripts coexist. | Label every renderer file ACTIVE, FALLBACK, QUARANTINED, or RETIRE. |
| Needs simulation | BROKEN | Needs drain only while actors are idle. | Continuous needs update with activity modifiers. |
| Time scaling | BROKEN | Resident offsite triggers acceleration even when household members remain home; time is advanced outside the clock system. | Household-aware centralized time scale. |
| Action identity | BROKEN ARCHITECTURE | Gameplay and visuals depend on action display text and broad regex matching. | Explicit action definitions and stable IDs. |
| Activity poses | INCOMPLETE | Unrelated activities fall back to generic `sit` or generic temporary sprites. | Per-activity entry, loop, exit, alignment, direction, prop, and fallback. |
| Object state | HIGH RISK | Global fridge, door, and bed flags can be reset by unrelated actors. | Per-object state and occupancy. |
| World mutation | HIGH RISK | Layout polish and runtime correction scans run repeatedly inside simulation frames/substeps. | One-time versioned world initialization. |
| General movement | BROKEN | Repeated route failure can teleport an actor to the final waypoint. | Legal reroute or visible failure, never forced completion. |
| Regression guards | BROKEN ARCHITECTURE | Dining, stair, couch, and stove corrections modify coordinates/actions every frame. | Source-level station and path fixes, diagnostic assertions only. |
| Vehicle routing | BROKEN FALLBACK | Travelers are forced to seat coordinates after timeout/no route. | Valid vehicle navigation stations and explicit failure. |
| Pool movement | HIGH RISK | Pool uses a separate direct coordinate integrator outside general collision routing. | Shared navigation service with pool stations. |
| Portal transitions | INCOMPLETE | Floor travel changes floor and coordinates without authored entry/exit transition. | Portal state machine with entry, transfer, exit, and interruption. |
| Visual and collision transforms | HIGH RISK | Parity bridge can rotate/swap display dimensions without one shared collision footprint. | Unified transform/footprint/station definition. |
| Save schemas | HIGH RISK | Broad state assignment lacks strict schema migration. | Validated versioned migrations. |
| World saves | BROKEN DESIGN | Loading replaces the entire canonical global object array from save data. | Rebuild current world and apply validated deltas. |
| Refresh autosave | NEEDS OPTIMIZATION | Full state JSON is written every two seconds. | Smaller event-based or debounced persistence. |
| Character directional walk | TEMPORARY, NEEDS ART APPROVAL | Four-frame 8 FPS bridge sheets exist; side walk remains temporary. | Per-actor cycle state and authored approved directional sheet. |
| Clothing layers | PARTIAL | Tint overlays sit over base art that already contains baked clothing. | True body, hair, garment, footwear, accessory, and prop layer schema. |
| Activity PNG system | TEMPORARY, HIGH RISK | Lazy generic activity sheets can hide base actors, choose nearest objects, rotate whole poses, and reload after pruning. | Explicit action-to-object animation binding and controlled preload. |
| Room art | TEMPORARY | 128-by-128 generic panels are stretched and combined with multiple architecture overlays. | One coherent room construction system. |
| HUD obstruction | PARTIAL | Time/money moved, but vertical navigation remains over the playfield. | Permanent controls outside the canvas safe area. |
| Responsive layout | HIGH RISK | CSS, inline fit logic, and preview iframe each constrain layout. | One responsive layout authority. |
| Phone and camera UI lifecycle | HIGH RISK | Module-level singleton state and listeners lack centralized scene disposal. | Instance-owned mount/update/dispose controllers. |
| Syntax check | MISLEADING NAME | `npm run check` is primarily `node --check` plus schema-only asset validation. | Rename syntax check and add aggregate verification. |
| Build | NOT A REAL BUILD | Build copies source/assets and Phaser vendor without bundling or browser execution. | Import graph validation and Playwright launch of built output. |
| Unit tests | INSUFFICIENT | Many tests assert source strings and filenames rather than runtime behavior. | Deterministic state and interaction tests. |
| Mobile smoke | INSUFFICIENT | Checks visible canvas/HUD/button and console errors only. | Movement, obstruction, floor, menu, phone, save, and activity scenarios. |
| Modern procedural reconstruction | FAILED, QUARANTINE | CI report records 2 failures and no build. Runtime does not import the renderer. | Quarantine until architecture decision. |
| Direct-push rewrite workflows | HIGH RISK | Broad workflows can rewrite and push runtime files to the active branch. | Artifact or PR output with review, never direct active-branch rewrite. |
| AppDeploy preview | PARTIAL TEST VEHICLE | Preview is commit-pinned and shallow E2E success does not validate full gameplay. | Display pinned SHA and add scenario tests. |
| Main promotion | BLOCKED | P2 is not safe to replace main. | Complete stabilization phases and explicit Kam approval. |

## Production priority override

Until the blocker repair sprint is completed, the production order is:

1. Freeze broad P2 feature and visual replacement work.
2. Establish branch authority and reconciliation.
3. Build trustworthy browser and simulation verification.
4. Repair needs and clock behavior.
5. Remove movement and vehicle teleport fallbacks.
6. Consolidate renderer and UI ownership.
7. Repair save architecture.
8. Repair mobile safe areas.
9. Resume character and activity art one approved system at a time.

Do not mark P2 complete, stable, fully native, or ready for main promotion.
