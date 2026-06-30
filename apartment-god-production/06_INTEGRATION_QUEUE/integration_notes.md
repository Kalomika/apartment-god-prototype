# Codex Integration Notes

This folder is the QA handoff for the realistic cyberpunk asset pass. At this checkpoint, no assets are approved for runtime integration.

## Integration boundary

- Do not integrate rejected assets.
- Do not integrate assets that are missing manifests.
- Do not integrate planning notes as final art.
- Do not edit `src/` as part of this QA handoff.
- Do not change Render settings.
- Do not deploy.
- Use `asset_registry.json` as the source of truth for approved assets.

## Mapping guidance

- Keep existing gameplay object IDs where possible.
- Map old procedural states to new sprite states only after a state is approved.
- Use fallback procedural rendering only where new sprites are missing.
- Joint states should be rendered as one combined sprite when both characters arrive at the correct interaction point.
- Dog states should remain separate from human states.
- Sleep poses should be randomized from approved hold poses.
- Laptop, phone, cooking, eating, and reading should loop B/C frames when the state uses a repeated action.
- Idle should alternate A/B.
- Walk and run should loop A/B/C.

## Current blockers before integration

- The QA branch does not currently contain the Art Bible or department folders from the separate production branches.
- The environment folder exists on its department branch, but its manifest uses non-template anchor and status fields.
- The male folder exists on its department branch, but its manifest uses `states` instead of Art Bible `entries`, uses `prompt_ready` status, and uses a non-approved anchor label.
- The female folder exists on its department branch, but `manifest_female.json` is missing.
- The dog folder exists on its department branch, but `manifest_dog.json` is missing.
- The joint character folder was not found during this QA pass.
- No final transparent PNG art was found or approved.

## Runtime protection list

Do not break:

- phone UI
- floor arrows
- movement
- fetch
- music
- cooking
- reading
- save slots
- windows
- build placement
- object click targets
- floor transfer through stairs
- current procedural fallback rendering

## Recommended integration order after rework

1. Merge or recreate the Art Bible and department folders into one production branch.
2. Normalize all manifests to the Art Bible template.
3. Replace planning-only statuses with allowed status values.
4. Add approved transparent PNG files or keep assets out of the registry.
5. Re-run this QA pass.
6. Start `realistic-cyberpunk-visual-integration` only after `asset_registry.json` contains approved assets.
