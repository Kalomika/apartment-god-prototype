# Shared Reference Pack Status

## Expected uploaded pack

`apartment_god_shared_reference_pack.zip`

## Expected destination

`apartment-god-production/REFERENCE_LIBRARY/`

## Current status

The active working session did not expose the uploaded zip file, and the repository did not already contain the expected `REFERENCE_LIBRARY` files at the time this pass started.

Because the pack contents could not be inspected, this pass does not claim that any source images were reviewed. It creates the required reference library structure, usage rules, and manifest target so the actual shared reference pack can be added safely later.

## What to do when the pack is available

1. Place or unzip `apartment_god_shared_reference_pack.zip` into `apartment-god-production/REFERENCE_LIBRARY/`.
2. Confirm the following folders exist:
   - `01_environment_references/`
   - `02_human_realistic_topdown_linework/`
   - `03_dog_references/`
3. Update `reference_manifest.json` with the real file names and notes.
4. Keep references separated from final production assets.
5. Do not move source reference images into character, dog, environment, or integration folders as final art.

## Safety note

Source references are not final gameplay assets. Final gameplay assets must be original production files and must pass the Art Bible QA checklist before integration.