# Style QA Checklist

Use this checklist before any asset moves into `06_INTEGRATION_QUEUE/approved_assets_only/`.

## Identity and style

- [ ] Does the asset match realistic top-down linework?
- [ ] Does it avoid cute, chibi, mascot, toy, emoji, and sticker style?
- [ ] Does the human character have adult proportions?
- [ ] Does the dog have realistic animal proportions?
- [ ] Is the head proportional to the body?
- [ ] Are hands, feet, shoulders, hips, limbs, paws, and joints believable?
- [ ] Does the pose feel grounded instead of exaggerated cartoon acting?

## Human base rules

- [ ] Does the male sprite support an adult Black male character design?
- [ ] Does the female sprite support an adult Black female character design?
- [ ] Is the sprite clothing-neutral for future outfit overlays?
- [ ] Does the sprite avoid nudity and explicit body detail?
- [ ] Does the body read clearly from an orthographic top-down view?

## Dog base rules

- [ ] Is the dog white or off-white for the first base pass?
- [ ] Is the dog color-changeable later?
- [ ] Does the dog avoid cute puppy mascot proportions?
- [ ] Does the dog use natural dog body language?

## Gameplay readability

- [ ] Is the action readable at gameplay scale?
- [ ] Is the silhouette clear over dark floors and walls?
- [ ] Can the state be understood without a text label?
- [ ] Are overlapping limbs, paws, props, or furniture clearly separated?
- [ ] Does the asset avoid visual noise that hides gameplay information?

## Scale and anchors

- [ ] Is scale consistent with the rest of the apartment world?
- [ ] Does the asset match adult furniture scale?
- [ ] Does the anchor label match the state type?
- [ ] Does the anchor point stay stable across frames?
- [ ] Does the sprite avoid popping in size between related states?
- [ ] Is the normalized anchor point recorded in the manifest?

## A/B/C frame logic

- [ ] Is A the entry, anticipation, or transition frame?
- [ ] Is B the main hold pose or loop frame 1?
- [ ] Is C the exit, recovery, or loop frame 2?
- [ ] Do sleep states use randomized holds instead of unnecessary over-animation?
- [ ] Do laptop, phone, food, cooking, and reading states loop B/C after entry?
- [ ] Do movement states loop A/B/C cleanly?

## Cyberpunk apartment tone

- [ ] Does the asset match the dark cyberpunk apartment tone?
- [ ] Does lighting support cyan, magenta, amber, or screen glow without overpowering linework?
- [ ] Does the color palette avoid toy-store or nursery colors?
- [ ] Does the prop or room feel lived in?
- [ ] Does the environment preserve clear collision and doorway logic?

## File and manifest

- [ ] Is the file named correctly?
- [ ] Does the filename match state ID logic?
- [ ] Is the file in the correct production folder?
- [ ] Is the manifest filled correctly?
- [ ] Are frame count, frame list, A/B/C logic, loop frames, entry frames, hold frames, and exit frames correct?
- [ ] Are gameplay tags useful and searchable?
- [ ] Is the status set to draft, review, approved, rework, or rejected?

## Technical art

- [ ] Is the sprite exported as transparent PNG when applicable?
- [ ] Are there no watermarks?
- [ ] Are there no source reference images baked into final art?
- [ ] Are there no AI anatomy artifacts?
- [ ] Are there no extra fingers, fused limbs, broken joints, warped paws, or warped props?
- [ ] Does the asset avoid baked effects that runtime cannot control later?

## Decision

- [ ] Approved for integration queue.
- [ ] Needs rework.
- [ ] Rejected.

## Rework notes

```txt
State ID:
Issue:
Required fix:
Reviewer:
Date:
```