# Codex Next Steps

Status: pending approval
Runtime files changed in this branch: no

## What This Branch Completed

- Read manager, QA, rollup, Art Bible, Reference Library, and all five production manifests.
- Created manifest inventory.
- Created current runtime to future manifest mapping.
- Recorded missing production PNG assets.
- Defined fallback rules.
- Documented proposed future runtime work without making runtime changes.

## Do Not Do Yet

- Do not replace procedural visuals.
- Do not use Reference Library images as runtime assets.
- Do not generate final art.
- Do not invent sprite sheets.
- Do not add unapproved placeholder PNG files.
- Do not deploy.
- Do not change Render settings.
- Do not modify `main`.
- Do not touch `Kalomika/ai-rpg-engine`.

## Approval-Gated Runtime TODOs

These are future tasks only. They were not implemented in this branch.

1. Add a read-only manifest loader.
   - Must parse object-shaped environment, male, female, and joint manifests.
   - Must parse dog array entries using `entry_field_order`.
   - Must not change gameplay rendering by itself.

2. Add an asset availability checker.
   - Must reject missing files.
   - Must reject Reference Library paths.
   - Must reject non-approved assets.
   - Must reject incomplete frame sets.

3. Add state resolver functions.
   - `resolveEnvironmentStateId(state, objectOrRoomContext)`.
   - `resolveCharacterStateId(entity, runtimeContext)`.
   - `resolveDogStateId(dog, runtimeContext)`.
   - `resolveJointStateId(actorA, actorB, runtimeContext)`.
   - Resolver output should be diagnostic first, not visual replacement.

4. Add direction inference.
   - Use current path target, velocity, or recent movement delta.
   - Quantize to N, NE, E, SE, S, SW, W, NW.
   - Use only for manifests that have directional states.

5. Add guarded render preference.
   - Prefer approved PNG frames only after the asset gate passes.
   - Otherwise call the existing procedural renderer.
   - Preserve action bars, speech bubbles, selection rings, mood display, and gameplay timing.

6. Add validation tooling.
   - Check all required manifests exist.
   - Validate JSON.
   - Count planned frame files.
   - Report missing files.
   - Verify no asset path points into `REFERENCE_LIBRARY/`.
   - Tooling must not alter gameplay behavior.

## Future Asset Production TODOs

These belong to asset production or QA, not this prep branch:

1. Generate original transparent PNG assets for environment, male, female, dog, and joint states.
2. Use Art Bible naming and anchor rules.
3. Ensure frame files match manifest names.
4. QA transparent PNGs visually for realistic top-down linework and cyberpunk tone.
5. Approve assets before any runtime visual integration.
6. Create an approved asset registry for Codex to consume.

## Review Checklist For This Branch

- Required docs created: yes.
- Runtime files changed: no.
- Manifests present: yes.
- Missing assets reported: yes.
- Fallback rules documented: yes.
- Ready for QA review of integration-prep docs: yes.
- Ready for final visual integration: no.

## Blockers For Final Visual Integration

- No final transparent PNG sprite sheets exist for male, female, dog, or joint states.
- No final environment PNG assets exist.
- No approved asset registry exists.
- Female locomotion manifest is coarse (`FEMALE_WALK_01`, `FEMALE_RUN_01`) while the Art Bible has directional movement targets; future asset planning should resolve that before directional female runtime integration.
- Current runtime has several actions with no exact manifest equivalent, such as solo dancing, tickle, hold hands, workout object visual, and some offsite actions.
