# Apartment God: Phaser Migration 2 Full Codebase Audit

Date: 2026-07-22
Branch audited: `phaser-migration-2`
Repository: `Kalomika/apartment-god-prototype`
Status: AUDIT COMPLETE, REPAIR REQUIRED
Runtime files changed by this audit: no
Main touched: no
Render settings changed: no

## Executive ruling

Kam's report is correct. Phaser Migration 2 has major issues across the board. The problems are not limited to art quality or a few misplaced interface elements. The branch currently contains systemic defects in branch control, runtime ownership, simulation timing, actor movement, action state, visual alignment, asset architecture, save compatibility, testing, and automated rewrite workflows.

The branch must not replace `main` in its current state. It is not a safe linear successor to the Render playable branch, and it is not verified as a complete Phaser-native reconstruction.

The dominant root cause is architectural accumulation. Instead of one authoritative simulation and one authoritative renderer, the branch has accumulated multiple runtime correction layers that repeatedly repair, reposition, hide, redraw, or override the same state. Many corrections make a symptom less visible while preserving the underlying conflict.

This report intentionally makes no broad runtime changes. Repair should begin only after Kam approves the staged stabilization order at the end of this document.

## Audit method and scope

The audit reviewed the latest branch and repository state, recent branch comparison, the standing handbook and policies, canonical log and matrix, active boot path, Phaser scene, simulation loop, movement, actions, autonomy, save and refresh state, world data, layout correction modules, runtime regression guards, vehicles and offsite behavior, pool and arcade systems, native gameplay visuals, character animation and clothing layers, activity and object-state visual replacement, mobile sizing, phone and camera UI, asset manifests, representative generated assets, repository checks, build script, unit tests, browser smoke test, automated reconstruction workflow, CI report, and current AppDeploy preview architecture.

The source tree contains over one hundred top-level JavaScript modules. This was a repository-wide active-path and subsystem audit rather than a claim that every inactive helper was manually traced instruction by instruction. All current runtime entry paths and every major gameplay and production-control category were included.

## Branch and production-control findings

### BLOCKER 1: Phaser Migration 2 is deeply diverged from the Render playable branch

Evidence:

- Comparison of `main` and `phaser-migration-2` reports the branch as diverged.
- The branch is approximately 184 commits ahead and 193 commits behind `main`.
- The merge base is `2536ae72006a9828e4571704fcd3e50d2e9cc80c`.
- The standing handbook and canonical development matrix still identify `phaser-migration`, not `phaser-migration-2`, as the active development branch.

Consequence:

There is no clean guarantee that P2 contains every later mainline gameplay correction. A future merge cannot be treated as a routine promotion. It requires an explicit reconciliation ledger that identifies what main has that P2 lacks and what P2 intentionally replaces.

Required repair:

Freeze broad feature work. Establish one authoritative migration branch and produce a main-versus-P2 reconciliation manifest before additional architecture work.

### CRITICAL 2: Canonical production documentation is stale and fragmented

Evidence:

- `apartment-god-production/DEVELOPMENT_MATRIX.md` remains dated around the earlier `phaser-migration` stage.
- Major P2 changes live in numerous append and patch files.
- The canonical handbook branch declaration conflicts with actual work.
- Some append files call systems ready or complete while later files report failures or temporary fallbacks.

Consequence:

Agents can read different documents and reach incompatible conclusions about what is active, verified, final, or safe to edit. This increases overwrite and duplicate-system risk.

Required repair:

After the code stabilization baseline is chosen, merge the accepted append facts into one canonical log and matrix. Archive superseded patches without deleting history.

## Runtime and renderer architecture

### BLOCKER 3: There is no single authoritative visual owner

Active systems currently include:

- `src/phaserMigration2Runtime.js`
- `src/phaserCharacterAnimationSystem.js`
- `src/phaserMigration2ReferenceCompletion.js`
- `src/phaserMigration2GameplayVisuals.js`
- `src/phaserMigration2GameplayParityBridge.js`
- `src/phaserMigration2BackdropSafety.js`
- `src/phaserMigration2HudPlacement.js`
- `src/phaserMigration2LayerFallbackSafety.js`

These systems independently create, resize, rotate, hide, replace, destroy, or redraw rooms, objects, actors, activity sprites, lighting, foregrounds, architecture, HUD elements, and fallbacks.

Concrete conflicts:

- The Phaser scene creates `statusText` and `runtimeText`; a polling HUD module later destroys both.
- The runtime refreshes native objects; the parity bridge then repositions, resizes, rotates, and re-depths them again during `postupdate`.
- Reference completion swaps object textures; the runtime and parity bridge continue controlling object dimensions and orientation.
- Reference completion adds architecture and foreground graphics; the parity bridge adds another architecture layer; backdrop safety adds another full-room fallback layer.
- Character rendering controls visibility; reference activity rendering hides it; layer fallback safety then performs another postupdate visibility pass.

Consequence:

Visual behavior depends on execution order between Phaser update, postupdate listeners, polling intervals, lazy asset completion, and scene render. A correction in one system can be silently undone by another. Flicker, duplicate geometry, wrong depth, stale visibility, obstructive overlays, and device-dependent behavior are predictable outcomes.

Required repair:

Create one Phaser scene-owned presentation coordinator. It must be the sole authority for room, object, actor, activity, effect, and HUD visibility. Remove interval-based corrective ownership from the final architecture.

### CRITICAL 4: The branch contains active, legacy, failed, and orphaned renderer architectures simultaneously

Evidence:

- The P2 runtime is active.
- Legacy Canvas renderer files remain in the same source tree.
- `src/phaserMigration2ModernProceduralRenderer.js` and its installation/finalization scripts exist as an alternate broad renderer.
- The modern procedural reconstruction CI report records an overall failure.
- The current runtime does not import that renderer.

Consequence:

The repository makes dead or failed work appear available and increases the chance another agent reconnects an obsolete architecture. Tests and scripts can also assert contradictory contracts from different generations.

Required repair:

Create an architecture inventory with one of four labels for every renderer-related file: ACTIVE, FALLBACK, QUARANTINED, or REMOVE_AFTER_BACKUP. No orphan renderer should remain ambiguously production-adjacent.

### HIGH 5: Any frame-level subsystem exception terminates the entire game scene

Evidence:

`recoverFrame()` sets `runtimeFailed`, disables input, destroys native gameplay visuals, reference completion, character visuals, and all scene children, then pauses the scene.

Positive aspect:

The game shows an error screen rather than a blank canvas.

Consequence:

A recoverable failure in an optional visual, HUD, or minigame can terminate the entire simulation. Optional systems are not isolated behind subsystem boundaries.

Required repair:

Separate fatal boot errors from recoverable subsystem errors. Optional visual and UI systems should disable themselves and report the fault without destroying gameplay state.

### HIGH 6: Multiple recurring polling and event patches have incomplete lifecycle ownership

Evidence:

- Backdrop safety polls every 250 milliseconds.
- HUD placement polls every 120 milliseconds.
- Layer fallback installs a postupdate safety pass.
- Phone and camera modules use module-level `built` flags and global DOM state.
- Several window and document listeners are created outside a central teardown registry.

Consequence:

Scene recreation, hot reload, or future in-app restart can leave stale state, listeners, or DOM linked to the prior scene. Module singletons can refuse to rebuild for a new state object.

Required repair:

Move all lifecycle setup into scene-owned create and shutdown methods. Every listener, interval, DOM node, and overlay must have an explicit disposer.

## Simulation integrity

### BLOCKER 7: Needs drain only while actors are idle

Evidence:

In `src/autonomy.js`, actors with a path, target, pending action, or positive `actionT` are skipped before `drainNeeds()` is called.

Consequence:

Hunger, bladder, energy, fun, social, freshness, and stamina freeze while walking and during timed activities. Long work, cooking, travel preparation, exercise, bathing, gaming, or social actions do not continuously affect normal need decay. This invalidates the life simulation.

Required repair:

Separate continuous physiological simulation from autonomous decision eligibility. Needs should update for every active actor every simulation step, with activity-specific modifiers.

### BLOCKER 8: Offsite time acceleration violates the household rule

Evidence:

`shouldFastForwardOffsite(state)` returns true whenever `resident` is included in the offsite actors. It does not verify that all household members are away.

`updateActions()` then adds `dt * 22` directly to game time, while the normal clock also advances later in the same simulation step.

Consequence:

If Resident leaves while Girlfriend or the dog remains home, home time accelerates approximately twenty-three times. Remaining household members, schedules, needs, autonomy, bills, and events can advance abnormally.

Required repair:

Fast-forward only when every relevant household member is offsite and no home event requires live simulation. Centralize time scaling in the clock system rather than adding time inside the action system.

### CRITICAL 9: Action consequences depend on human-readable text matching

Evidence:

`src/actions.js` determines many outcomes using `text.includes(...)` on the displayed action label. Examples include sleep, eating, games, pool, darts, reading, exercise, swimming, phone, relationships, dog activities, and lighting.

`src/phaserMigration2ReferenceCompletion.js` similarly classifies visual activities through broad regular expressions over `currentActionId`, `actionId`, `action`, and `pose`.

Consequence:

Changing display wording can change gameplay. Overlapping words can trigger multiple consequence families. A label containing `game`, `pool`, `read`, `sleep`, or `light` can accidentally activate unrelated behavior. Visual identity and gameplay identity can disagree.

Required repair:

Use explicit action definitions with stable IDs, phases, target IDs, animation IDs, start effects, tick effects, completion effects, and interruption handlers. Display text must never be a logic key.

### CRITICAL 10: Broad generic poses remain a core action fallback

Evidence:

`beginTimedAction()` maps many unrelated actions to `sit`, including TV, desk work, gaming, phone use, shopping, console play, reading, studying, eating, changing clothes, and outfit planning.

Consequence:

This contradicts the no-broad-implementation rule and guarantees incorrect anatomy or object alignment whenever the optional replacement activity sprite is unavailable, loading, misclassified, or rejected.

Required repair:

Every activity requires an explicit animation contract. A safe static directional pose may be used temporarily, but one generic seated pose cannot represent unrelated activities.

### HIGH 11: Global object state is closed or reset by unrelated action completion

Evidence:

At the end of `finishAction()`, every completed actor action resets global fridge and door fields:

- `state.objectState.fridgeOpen = false`
- `state.objectState.fridgeActivity = null`
- `state.objectState.doorOpen = false`

Bed-made state is also frequently represented as one global boolean rather than a stable per-bed map.

Consequence:

One actor finishing an unrelated action can visually or logically close an object another actor is using. Multiple beds and doors cannot hold independent state reliably.

Required repair:

Store object state by object ID. State transitions must belong to the action that acquired that object and must respect concurrent use.

### HIGH 12: Simulation and layout corrections run repeatedly inside the frame loop

Evidence:

`sanitizeRuntimeState()` calls `applyMainFloorLayoutPolish()` and `applyRuntimeObjectCorrections()`.

`runSimulationStep()` calls both functions again for every substep.

`updateHouseTidiness()` is called twice in the same simulation step.

Runtime object corrections repeatedly scan and patch the global `objects` array and synchronize vehicle collision blocks.

Consequence:

Static world initialization work is performed at frame or substep frequency. This hides unwanted mutations instead of detecting them, adds unnecessary cost, and makes object state difficult to reason about.

Required repair:

Apply immutable world migration once at boot or load. Use assertions to detect illegal geometry mutation. Dynamic state updates should be narrow and event-driven.

### MEDIUM 13: Random autonomy and minigame behavior is not reproducible

Evidence:

Autonomy, wandering, TV choices, dog behavior, travel treasure seeds, and arcade behavior use `Math.random()` directly.

Consequence:

The same saved state cannot reproduce the same bug. Automated tests cannot deterministically verify decision sequences.

Required repair:

Use a state-owned seeded random generator and persist its seed or sequence state.

### MEDIUM 14: Autonomy is hard-coded to only three named actors

Evidence:

`updateAutonomy()` explicitly retrieves `resident`, `girlfriend`, and `dog` rather than iterating actor profiles.

Consequence:

Lab actors and future residents do not participate in the same autonomy architecture. New characters require code edits instead of data configuration.

Required repair:

Drive autonomy by actor capability/profile, with lab and test-only exclusions explicitly declared.

## Movement, collision, and routing

### BLOCKER 15: Blocked-route recovery teleports actors through geometry

Evidence:

In `src/movement.js`, after repeated recovery attempts, the actor is assigned directly to the final waypoint:

- `entity.x = final.x`
- `entity.y = final.y`

The route is then considered complete.

Consequence:

Actors can pop across furniture, walls, doors, room boundaries, or other blockers. This directly explains visible sliding and impossible movement.

Required repair:

Delete forced completion teleporting. A failed route must remain failed, select a legal alternate route, or expose a recoverable error. Teleporting is only valid for explicit portals and must be visually staged.

### CRITICAL 16: Runtime regression guards also teleport actors every frame

Evidence:

`src/runtimeRegressionGuards.js`:

- teleports diners to fixed dining seats
- teleports actors onto a nearby stair center
- ejects idle actors from the couch collision region
- interrupts and reroutes cooking when contact is considered wrong

These guards run continuously from the Phaser scene update path.

Consequence:

Visual symptoms are corrected by coordinate reassignment rather than by valid approach points, seating states, object occupancy, or pathfinding. Actors can visibly snap, lose routes, or have actions rewritten.

Required repair:

Replace each guard with a source fix in object interaction stations and movement state. Keep only diagnostic assertions after repair.

### CRITICAL 17: Vehicle flow contains forced seat teleporting

Evidence:

If routing to a vehicle does not succeed quickly, `forceToVehicleSeat()` sets the actor floor and coordinates directly. `routeToVehicleSeat()` also snaps a nearby actor to the seat point.

Consequence:

Travel may appear to work while masking broken garage routing. Characters can skip stairs, doors, collision, and walking animation.

Required repair:

Vehicle entry stations must be valid navigation nodes. Timeout should surface a route failure, not teleport the party.

### HIGH 18: Pool choreography bypasses the general movement and collision system

Evidence:

Active pool actors have their normal `path`, `target`, and `pending` cleared. `poolRoute` then moves actor coordinates directly around table-specific perimeter points.

Consequence:

Pool movement avoids the table but does not use general room, door, or nearby-object collision checks. Future layout changes can cause pool actors to pass through unrelated basement objects or walls.

Required repair:

Use the same navigation service for all actor movement, with activity-specific legal stations supplied as goals rather than a separate coordinate integrator.

### HIGH 19: Visual orientation can disagree with collision geometry

Evidence:

The parity bridge rotates objects and swaps their display width and height for quarter turns. The underlying world object's collision rectangle remains based on its original axis-aligned `w` and `h` unless another correction also changes it.

Consequence:

Actors can collide with empty space or walk through the displayed object. Interaction points can be on the wrong side after rotation.

Required repair:

Derive rendering, collision, interaction stations, and occlusion from one transform and footprint definition.

### HIGH 20: Stair and door travel is immediate coordinate transfer

Evidence:

Stair actions and completed floor travel directly change actor floor and set the destination exit coordinates.

Consequence:

There is no entry, transition, exit, or obstruction contract. Characters can appear to slide or pop between areas, and camera changes can expose the teleport.

Required repair:

Implement explicit portal transition states with entry animation, hidden transfer point, destination exit animation, and interruption handling.

## Save, refresh, and mutable world state

### CRITICAL 21: Saved world objects replace the global object registry wholesale

Evidence:

`loadGame()` calls `restoreObjects()`, which empties the exported global `objects` array and pushes the saved objects back into it.

Consequence:

An old save can restore obsolete geometry, removed objects, old collision flags, or an incompatible world definition. Later runtime corrections only patch selected IDs. New objects introduced after the save may disappear.

Required repair:

Save object deltas and player-built objects, not the entire canonical world definition. Reconstruct the current world from versioned source data, then apply validated save deltas.

### HIGH 22: Save and refresh restore lack schema validation and migration enforcement

Evidence:

- Save versions exist, but restored state is accepted through broad object assignment.
- Refresh state merges saved fields without checking the stored refresh version against a migration table.
- `restoreWholeState()` deletes every current state key before assigning the save.
- Nested systems are only selectively merged in refresh restore.

Consequence:

New defaults can vanish, incompatible nested shapes can survive, and stale transient fields can re-enter the runtime. A bad save may not fail until an unrelated system reads it.

Required repair:

Define a schema for each save version, validate before load, migrate sequentially, and reject unsupported saves without mutating the live state.

### HIGH 23: Refresh autosave writes the entire state every two seconds

Evidence:

`updateRefreshAutosave()` serializes a deep JSON clone of the state every two seconds.

Consequence:

Frequent main-thread serialization can cause mobile stutter as state grows. It also increases the chance of preserving unstable in-progress action state.

Required repair:

Use debounced or event-based saves, smaller persistent state, and explicit stable checkpoints.

## Character, clothing, and activity visuals

### CRITICAL 24: The clothing system is not a true modular sprite system

Evidence:

The base human sheets already contain baked clothing. Separate top and bottom tint layers are then drawn over the clothed body.

The manifest acknowledges that garment silhouettes, hair, shoes, hats, accessories, outerwear, and activity clothing are not implemented.

Consequence:

Changing tint is not the same as changing clothing. Baked garment edges remain visible underneath overlays, and future garments cannot reliably change silhouette or limb coverage.

Required repair:

Create a true compositing standard with anatomy/base, hair, upper garment, lower garment, footwear, accessories, carried item, shadow, and activity overlay. Every layer must share authored directional frames and attachment points.

### HIGH 25: Side walking uses temporary bridge art and a global animation phase

Evidence:

The side walk frame is selected from global `scene.time.now` rather than an actor-owned cycle start.

Consequence:

Actors entering a walk can begin on any phase. Multiple actors remain mechanically synchronized. Direction changes can visibly jump between unrelated frame phases.

Required repair:

Store per-actor animation state, phase, direction transition, and foot-contact frame.

### CRITICAL 26: Activity identity and alignment are generic

Evidence:

Reference completion chooses activity sprites through broad text regular expressions. It then uses category-level width, height, vertical offset, and whole-sprite rotation. When no explicit object link is present, it chooses the nearest matching object.

Consequence:

An activity can attach to the wrong appliance or furniture. Rotating a completed 2D pose is not equivalent to authored directional anatomy. Different objects of the same kind cannot have unique interaction alignment.

Required repair:

Each action definition must specify the exact object instance, station, direction, entry frames, loop frames, exit frames, occlusion, prop attachments, and fallback.

### HIGH 27: Lazy activity and object-state texture replacement can hitch and race

Evidence:

Activity and state textures are loaded during play, actors are hidden while replacement sprites become available, and textures are pruned from bounded pools.

Consequence:

First use can show the base pose, disappear, or switch late. A recently pruned activity can reload and hitch again. Object textures can be replaced while another system is resizing or rotating them.

Required repair:

Preload the current floor's likely activity pack at a controlled transition point, or use an authored atlas budget. Do not change actor visibility until the replacement texture is ready.

### HIGH 28: Room art is a stretched low-resolution panel plus multiple overlays

Evidence:

Representative room assets are 128 by 128 generic gradients and tile or plank patterns. They are stretched to rooms hundreds of pixels wide and tall. Backdrop safety, runtime room images, parity architecture, and reference architecture add additional geometry.

Consequence:

The rooms cannot read as coherent authored environments. Materials stretch, borders stack, and room construction varies depending on which layers loaded or ran last.

Required repair:

Choose one room construction method. Build rooms from a consistent tile/material kit and explicit wall, doorway, window, floor, foreground, and occlusion geometry, or use authored room assets. Remove duplicate architectural overlays.

### MEDIUM 29: Completion flags describe coverage rather than approved quality

Evidence:

The reference completion manifest marks architecture, lighting, foreground occlusion, premium UI, and native Phaser as true while also stating authored approval is false and generated PNGs are temporary.

Consequence:

Agents may treat category presence as production completion.

Required repair:

Use separate fields for EXISTS, WIRED, CODE-TESTED, BROWSER-TESTED, ART-APPROVED, and FINAL.

## UI and mobile behavior

### HIGH 30: Interface elements still intentionally occupy the playable canvas

Evidence:

Time and money were moved out, but `vertical-nav-dock` remains absolutely positioned over the right side of `game-wrap`. Camera and phone panels are also dynamically appended across the game and body.

Consequence:

On mobile, controls can cover objects and interaction targets. Removing one overlay did not establish a no-obstruction playfield rule.

Required repair:

Reserve a dedicated control region outside the canvas on mobile. Only transient contextual UI should overlay gameplay, and it must avoid active interaction zones.

### HIGH 31: Mobile sizing uses competing CSS and JavaScript layout authorities

Evidence:

- `styles.css` assigns viewport percentages, flex bases, minimum heights, and media-query overrides.
- `src/fit.js` writes inline display, height, width, flex, and canvas dimensions.
- AppDeploy adds another launcher iframe and its own viewport constraints.

Consequence:

Device size, browser chrome, orientation, and iframe hosting can produce different results. Inline styles override stylesheet intentions and make debugging layout regressions difficult.

Required repair:

Choose one responsive layout authority. Prefer CSS variables and a small measured viewport adapter rather than rewriting many inline properties.

### MEDIUM 32: Phone and camera UI are module-level singletons

Evidence:

Both modules use top-level `built` flags and shared DOM references. Their listeners and DOM are not centrally disposed by the Phaser scene.

Consequence:

Scene recreation can retain stale state or prevent rebuilding. Automated tests that create more than one runtime in a page can interfere with one another.

Required repair:

Use instance-owned UI controllers with explicit mount, update, and dispose methods.

## Testing and verification

### BLOCKER 33: `npm run check` is only a syntax check

Evidence:

`scripts/check.js` runs `node --check` on top-level `src/*.js` files and reports the count.

It does not validate imports, run a browser, inspect CSS or HTML, lint, type-check, check event lifecycle, or verify gameplay.

Consequence:

A green repository check is frequently described more strongly than it deserves.

Required repair:

Rename it `check:syntax` and create a real aggregate check including lint, module import verification, unit tests, build, and browser smoke.

### BLOCKER 34: `npm run build` is a copy operation, not an application build

Evidence:

`scripts/build.js` copies `index.html`, `styles.css`, `src`, and `assets` into `dist` and `Dist`, then copies Phaser's ESM file.

Consequence:

The build can pass with broken imports, browser-only runtime exceptions, stale query-string dependencies, dead code, or incompatible assets.

Required repair:

Use a real bundler or an import-graph validator. At minimum, launch the built output in Playwright and fail on console, page, network, and scene recovery errors.

### CRITICAL 35: Many tests verify source strings instead of behavior

Evidence:

Tests read source files and assert that particular words, imports, or filenames are present or absent. Visual catalog tests verify path naming rather than rendering. HUD tests inspect markup strings. The mobile Playwright smoke test only checks that the canvas, selected name, needs, and Cell button are visible and that no console error was captured.

Consequence:

Tests can pass while actors teleport, needs freeze, controls obstruct the world, activity sprites align incorrectly, or visuals are crude.

Required repair:

Add deterministic state-level tests and browser interaction tests for movement, time, needs, save migration, floor travel, object concurrency, activity entry/loop/exit, and mobile hit targets.

### CRITICAL 36: The latest broad procedural reconstruction report failed

Evidence:

`P2_MODERN_PROCEDURAL_RECONSTRUCTION_CI_REPORT_2026-07-21.md` records:

- Overall status: FAIL
- 2 test files failed
- 82 of 84 tests passed
- build not run
- built contract not run

Consequence:

The alternate renderer cannot be considered verified or integrated. Its remaining files are repository debt.

Required repair:

Quarantine the failed reconstruction and resolve the architecture decision before rerunning any broad installer.

### HIGH 37: Self-modifying workflows can rewrite and push broad runtime changes

Evidence:

The modern procedural workflow has contents write permission, runs installer and patch scripts, stages numerous runtime/UI/CSS/test files, commits, rebases, and pushes directly to `phaser-migration-2`.

Consequence:

A workflow can race with other GPTs and rewrite current work after source inspection. This conflicts with the rule that changes remain small and auditable.

Required repair:

Broad generation workflows should produce an artifact or pull request, never commit directly to the active branch. Require review and a current-head check before merge.

### HIGH 38: AppDeploy success does not verify deep gameplay

Evidence:

The preview is a launcher pinned to a specific commit. Its automated checks focus on boot, visible interface, mobile region, and reload containment. They do not execute a full household simulation or validate artistic quality.

Consequence:

Three of three AppDeploy tests passing cannot be treated as proof that gameplay systems are correct.

Required repair:

Maintain a visible preview commit label and add scenario-based Playwright tests. The preview should never be described as current unless its pinned SHA matches the branch's approved runtime SHA.

## Positive foundations worth preserving

The audit also found useful work that should not be discarded blindly:

- Phaser has a real scene and owns the primary update loop.
- The runtime displays a stable recovery screen instead of silently blanking.
- Movement code attempts room and solid-object routing before recovery.
- Vehicle travel has explicit conceptual phases for packing, walking, boarding, leaving, returning, unloading, and walking inside.
- Pool has explicit shot, waiting, stance, and ball-physics concepts.
- Save operations use protected browser-storage wrappers and avoid crashing when storage is blocked.
- Asset manifests openly state that generated visuals are temporary and not art-approved.
- Character animation distinguishes actual coordinate movement from labels that merely say walking.
- The project has extensive documentation and backup discipline, even though canonical consolidation is overdue.

These foundations should be retained only after their ownership boundaries are clarified.

## Required repair order

### Phase 0: Freeze and establish authority

1. Stop broad feature and visual replacement work on P2.
2. Disable or quarantine direct-push broad rewrite workflows.
3. Confirm a fresh backup branch from the exact P2 stabilization start SHA.
4. Declare the authoritative migration branch in the handbook.
5. Produce a main-versus-P2 reconciliation manifest.

Exit condition:

One documented branch baseline with no concurrent broad rewrite process.

### Phase 1: Build trustworthy verification

1. Split syntax check from real project verification.
2. Add a real built-browser launch test.
3. Add deterministic tests for needs, clock, offsite scaling, movement failure, action effects, object concurrency, save migrations, and floor transitions.
4. Add a branch-SHA label to the preview.

Exit condition:

A failing runtime behavior causes CI to fail before more code is layered on top.

### Phase 2: Consolidate runtime ownership

1. Create one presentation coordinator.
2. Remove interval-based HUD, backdrop, and layer correction ownership.
3. Select one room architecture renderer.
4. Select one object renderer.
5. Select one actor/activity renderer.
6. Quarantine legacy and failed renderer paths.

Exit condition:

Every visible category has exactly one owner and one lifecycle.

### Phase 3: Repair simulation correctness

1. Drain needs continuously.
2. Centralize time scaling.
3. Replace text-driven action consequences with explicit action definitions.
4. Convert global object booleans to per-object state.
5. Make autonomy profile-driven and deterministic.

Exit condition:

A deterministic one-day simulation passes state invariants.

### Phase 4: Repair movement and interaction geometry

1. Remove forced route teleports.
2. Remove coordinate-repair guards.
3. Define shared transforms for visuals, collision, approach stations, seats, and occlusion.
4. Route pool and vehicle actors through the same navigation service.
5. Implement portal entry and exit states.

Exit condition:

Actors never cross a solid object or wall in automated route scenarios, and unreachable goals fail visibly without teleporting.

### Phase 5: Repair save architecture

1. Define validated save schemas and migrations.
2. Save world deltas rather than replacing canonical objects.
3. Reduce refresh-save frequency and persistent scope.
4. Test old, corrupt, incomplete, and future-version saves.

Exit condition:

Current world data survives loading older compatible saves without losing new objects or defaults.

### Phase 6: Repair mobile and HUD layout

1. Establish a canvas-safe area with no permanent overlays.
2. Move vertical navigation into the dedicated control region.
3. Consolidate responsive sizing into one authority.
4. Add mobile hit-target and obstruction tests.

Exit condition:

Portrait and landscape previews expose the full world and controls without covering interactive objects.

### Phase 7: Rebuild character and activity art correctly

1. Approve one static true top-down character.
2. Build a real layer schema.
3. Approve directional walking.
4. Approve sitting.
5. Add one activity at a time with authored entry, loop, exit, alignment, prop, direction, fallback, and test plan.
6. Replace temporary generated room and object art only after runtime geometry is stable.

Exit condition:

Art replacement no longer compensates for unstable state or geometry.

## Final status

Phaser Migration 2 is currently:

- PLAYABLE IN PARTS
- ARCHITECTURALLY UNSTABLE
- NOT VERIFIED FOR MAIN PROMOTION
- NOT ART APPROVED
- NOT SAFE FOR ANOTHER BROAD OVERHAUL
- SUITABLE FOR A CONTROLLED STABILIZATION SPRINT

The correct next move is not another visual pass. It is a blocker repair sprint beginning with trustworthy tests, continuous needs and clock correction, elimination of forced movement teleports, and consolidation of renderer ownership.
