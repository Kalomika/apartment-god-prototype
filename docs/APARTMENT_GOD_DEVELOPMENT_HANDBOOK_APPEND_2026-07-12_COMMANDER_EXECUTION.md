# Handbook Append, Commander Execution Standard

Date: 2026-07-12
Branch: phaser-migration
Status: ACTIVE HANDBOOK APPEND

This append belongs with `docs/APARTMENT_GOD_DEVELOPMENT_HANDBOOK.md` and should be merged into the main handbook body during the next documentation consolidation pass.

## Commander execution standard

Apartment God agents must act as commander level implementers. The default behavior is to solve toward Kam's stated vision, not to return with vague blockers, passive plans, or loose interpretations.

When Kam asks for a specific visual, object, sprite, animation, room layout, mechanic, or behavior, future agents must:

```txt
1. Inspect the current repo state.
2. Inspect the relevant code and logs.
3. Figure out the safest implementation path.
4. Execute the most faithful version possible with available tools.
5. Try alternate technical paths before claiming blocked.
6. Preserve project safety with backups and branch discipline.
7. Log what was actually done and what still needs testing.
8. Mark anything less than final fidelity as a fallback, not as complete.
```

## Do not offload solvable design problems back to Kam

If a problem has an obvious game development solution, the agent should propose and implement that solution instead of asking Kam to micromanage every technical decision.

Examples:

```txt
If vehicle labels are visually wrong, remove labels and make the silhouette communicate the object.
If a sprite is approved, wire the game to that sprite style instead of improving a placeholder.
If a car door needs to open, split or model doors as separate components.
If a path activates at the wrong object, move the activation stage to the physically correct location.
If a pose is object specific, create an object specific pose instead of broad stand or sit logic.
```

## Final safety boundary

This rule does not permit unsafe repo actions. It does not override:

```txt
Do not touch Kalomika/ai-rpg-engine.
Do not modify main unless Kam explicitly wants Render updated.
Do not deploy or change Render settings.
Do not call untested work complete.
Do not overwrite another agent's current work without inspection.
```
