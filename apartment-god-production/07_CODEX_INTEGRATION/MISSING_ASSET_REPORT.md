# Missing Asset Report

Branch: codex-manifest-integration-prep
Runtime files changed: no

## Summary

No final gameplay image assets exist in the production department folders yet. This is expected for the current planning-manifest phase.

The existing images under `apartment-god-production/REFERENCE_LIBRARY/` are reference-only and must not be used as runtime assets.

## Missing PNG Inventory

| Department | Manifest | Planned PNG files in manifest | Existing PNG/JPG files in department folder | Missing planned PNG files | Result |
| --- | --- | ---: | ---: | ---: | --- |
| Apartment Environment | `01_APARTMENT_ENVIRONMENT/manifest_environment.json` | 51 | 0 | 51 | Blocked for visual replacement |
| Male Character | `02_MALE_CHARACTER/manifest_male.json` | 194 | 0 | 194 | Blocked for visual replacement |
| Female Character | `03_FEMALE_CHARACTER/manifest_female.json` | 178 | 0 | 178 | Blocked for visual replacement |
| Joint Character States | `04_JOINT_CHARACTER_STATES/manifest_joint.json` | 50 | 0 | 50 | Blocked for visual replacement |
| Dog Character | `05_DOG_CHARACTER/manifest_dog.json` | 170 | 0 | 170 | Blocked for visual replacement |

Total planned PNG files across reviewed manifests: 643

Total existing production department image files: 0

Total missing planned PNG files: 643

## Environment Assets Missing

The environment manifest lists 51 planned PNG files, including:

- Base floor layouts.
- Room base layers.
- Doors, windows, walls, and lighting states.
- Furniture and prop states.
- Future basement, garage, car, podcast desk, and garage prop states.

None of those planned environment PNG files exist in `apartment-god-production/01_APARTMENT_ENVIRONMENT/`.

Future environment integration remains blocked until original approved PNG assets are placed in the environment department folder and pass visual QA.

## Character Sprite Sheets Missing

The male, female, dog, and joint manifests list transparent PNG frame files, but none exist in their production department folders.

Missing character asset groups:

- Male solo idle, walk, run, sit, sleep, phone, laptop, cooking, eating, bathroom, reading, exercise, dog interaction, social, reaction, and transition frames.
- Female solo idle, walk, run, sit, sleep, phone, laptop, cooking, eating, bathroom, reading, exercise, dog interaction, social, reaction, and transition frames.
- Dog idle, walk, run, sit, sleep, bowl, comfort, follow, fetch, play, bathroom, bark, sniff, and transition frames.
- Joint combined shared sprite frames for bed, couch, conversation, hug, kiss, argument, dance, cooking, eating, TV, desk, dog petting, and transitions.

Future character visual integration remains blocked until original transparent PNG sprite frames or sheets are generated, reviewed, approved, and listed with final asset metadata.

## Reference Library Is Not A Substitute

Reference Library image files present:

- Contact sheet JPG.
- Environment reference JPG files.
- Human top-down reference PNG/JPG files.
- Dog reference JPG file.
- Legacy reference JPG files.
- Current-game-context screenshot PNG.

These files are approved only for pose, style, linework, scale, and mood guidance. They are not final gameplay assets and must not be copied into runtime asset paths.

## Required Before Visual Replacement

Before any future runtime visual replacement:

1. Generate original transparent PNG assets from approved manifests and prompts.
2. Place generated assets in the matching production department folder.
3. Confirm filenames exactly match manifest frame files.
4. Verify transparent PNG format where applicable.
5. Run Art Bible visual QA.
6. Record approval status in an approved asset registry.
7. Only then allow runtime code to prefer PNG assets over procedural fallbacks.

## Integration-Prep Status

Missing assets are not a blocker for this integration-prep documentation branch.

Missing assets are a blocker for final gameplay visual integration.
