# Style QA Checklist

Use this checklist before any asset moves into `06_INTEGRATION_QUEUE/approved_assets_only/`.

## Identity and Style

- [ ] Does the asset match realistic top-down linework?
- [ ] Does it avoid cute, chibi, mascot, toy, emoji, and sticker style?
- [ ] Does the character have adult proportions?
- [ ] Is the head proportional to the body?
- [ ] Are hands, feet, shoulders, hips, and limbs believable?
- [ ] Does the pose feel grounded instead of exaggerated cartoon acting?

## Gameplay Readability

- [ ] Is the action readable at gameplay scale?
- [ ] Is the silhouette clear over dark floors and walls?
- [ ] Can the state be understood without a text label?
- [ ] Are overlapping limbs or props clearly separated?
- [ ] Does the asset avoid visual noise that would hide gameplay information?

## Scale and Anchors

- [ ] Is scale consistent with the rest of the apartment world?
- [ ] Does the asset match adult furniture scale?
- [ ] Does the anchor label match the state type?
- [ ] Does the anchor point stay stable across frames?
- [ ] Does the sprite avoid popping in size between related states?
- [ ] Is the normalized anchor point recorded in the manifest?

## Cyberpunk Apartment Tone

- [ ] Does the asset match the dark cyberpunk apartment tone?
- [ ] Does the lighting support cyan, magenta, amber, or screen glow without overpowering the drawing?
- [ ] Does the color palette avoid toy-store or nursery colors?
- [ ] Does the prop or room feel lived in?
- [ ] Does the asset avoid clean showroom sci-fi design unless a later scene specifically needs it?

## File and Manifest

- [ ] Is the file named correctly?
- [ ] Does the filename match the state ID logic?
- [ ] Is the file in the correct production folder?
- [ ] Is the manifest filled correctly?
- [ ] Are frame count, frame list, loop frames, entry frames, hold frames, and exit frames correct?
- [ ] Are gameplay tags useful and searchable?
- [ ] Is the status set to draft, review, approved, rework, or rejected?

## Technical Art

- [ ] Is the sprite exported as a transparent PNG when applicable?
- [ ] Are there no watermarks?
- [ ] Are there no reference images baked into the final art?
- [ ] Are there no AI anatomy artifacts?
- [ ] Are there no extra fingers, fused limbs, broken joints, or warped props?
- [ ] Does the asset avoid baked effects that runtime cannot control later?

## Decision

- [ ] Approved for integration queue.
- [ ] Needs rework.
- [ ] Rejected.

## Rework Notes

Use this space during review:

```text
State ID:
Issue:
Required Fix:
Reviewer:
Date:
```
