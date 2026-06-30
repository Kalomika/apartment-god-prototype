# Top Shot reference images

Codex should use the visual reference images for Top Shot from this folder:

```text
top-shot/docs/reference-images/
```

The actual image files should be placed in this folder before or during the Codex run. Use the zip named `top_shot_codex_reference_images.zip` that Kam generated in ChatGPT, or attach that zip directly to Codex and instruct Codex to unzip it here.

Recommended command for Codex if the zip is available in its workspace:

```bash
mkdir -p top-shot/docs/reference-images
unzip top_shot_codex_reference_images.zip -d top-shot/docs/reference-images
```

Use these images only as visual/art-direction references. Do not copy, trace, or reproduce the images directly unless licensing is explicitly confirmed.

## How Codex should use the references

Use the top-down running, tactical soldier, grappling, and fighter pose references to improve:

- overhead human sprite anatomy
- clear head tucked into shoulder mass
- broad shoulder silhouette
- torso and pelvis separation
- left/right arm clarity
- left/right leg clarity
- visible elbows, knees, fists, and feet
- planted 2 to 4 frame running cycles
- tactical soldier silhouettes and weapons from above
- CQC pose readability
- grappling/body contact
- ground fighting silhouettes

## Handler-facing reference

The image where the man is looking up toward the camera/player is important as a separate UI/portrait reference.

Use it as inspiration for a handler-facing or player-facing state where the fighter looks up toward us, the handlers, to request or react to:

- command approval
- extraction
- help
- medical item
- ammo
- tactical instruction
- fear/panic
- trust or distrust
- status report

This should not replace the overhead combat sprite. It should inform a separate portrait, command-feedback panel, or special request state.

## Included archive files

- `1000031703.jpg` through `1000031709.jpg`: top-down human/vector pose references.
- `1000031710.jpg` through `1000031713.jpg`: top-down tactical/soldier pose and weapon readability references.
- `1000031714.gif`: small pixel top-down soldiers/turret/cover reference.
- `1000031715.png`: top-down soldier running with rifle reference.
- `1000031716.jpg`: tactical arena/map feel reference.
- `1000031717.jpg`: top-down grappling/jiu-jitsu body contact reference.
- `1000031718.jpg`: simplified overhead running pose/reference frames.
- `2d_male_combat_pose_reference_sheet.png`, `fighter_character_pose_reference_sheet.png`, and `tactical_fighter_animation_reference_sheet.png`: supplemental pose/sprite reference sheets.
- `a_top_down_overhead_video_game_screenshot_of_a_mar.png`: supplemental top-down tactical fighter screenshot style reference.

Not included:

- `1000031719.png`: UI screenshot about Grok/playground, not an art/gameplay reference.

## Main warning

Do not let the art drift into alien blobs. The reference images exist to force readable human top-down anatomy, crisp sprite silhouettes, grounded running, and real limb-specific CQC action.
