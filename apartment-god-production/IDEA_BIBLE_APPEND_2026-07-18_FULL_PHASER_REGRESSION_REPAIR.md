# Idea Bible Append, Full Phaser Regression Repair

Date: 2026-07-18
Status: ACTIVE DIRECTIVE
Authoritative development branch: phaser-migration
Work branch: work/full-phaser-regression-repair-2026-07-18
Render mirror: main after the repair batch is committed and inspected

Kam's directive:
- Preserve every gameplay feature and interaction that worked before the Phaser parity transition.
- Do not accept the current hybrid renderer as the final destination. Continue toward native Phaser sprites, containers, layers, animation, depth, cameras, input, effects, and physics where appropriate.
- Fix the mobile scene placement so the whole playable floor is visible and not vertically centered inside a larger black area or covered by the control bar.
- Fix duplicated character art where an old body or limbs appear under an animated layer.
- Add real leg movement for north, south, east, and west walking at the intended anime style 8 FPS.
- Correct sleeping direction and bed alignment.
- Restore activity progress visibility, including bed making and other timed actions.
- Stop drawing new living, dining, kitchen, dog, TV, and activity visuals on top of old versions.
- Restore the corrected single dog renderer and remove mutated double dog results.
- Replace the basement arcade block with a readable grounded top-down arcade machine whose active mini-game appears on the built-in angled screen.
- Do not show the large arcade game overlay by default. Double tapping the arcade should open an expanded playable view without covering the normal house view during ordinary autonomous play.
- Correct the pool triangle orientation and preserve correct physical shot stance and perimeter movement.
- Improve top-down TV and laptop construction so screens read as tilted or wall-mounted equipment rather than plain blocks.
- Keep people grounded anime, realistic, Black, adult-proportioned, and readable on mobile. Avoid chibi, mascot, blob, toy, emoji, or toilet-door silhouettes.
- Background and object art should move toward painterly grounded anime while characters use brighter anime shading and deliberate 8 FPS motion.
- Audit the backed-up previous main against the current Phaser parity runtime and preserve all working actions, UI, progress, routing, saves, rooms, outdoor areas, travel, beach, airplane, sports, pool, vehicles, dog behavior, and object interactions.

Interaction decision:
- Single tap on an arcade machine keeps the normal interaction menu.
- Double tap while an arcade game is active opens an expanded playable mini-game view.
- The normal world view displays the mini-game only on the arcade cabinet screen.
- The expanded mini-game view may use touch controls and must have a clear close control.

This directive is too broad for one generic replacement pass. Each repaired system must use specific state and object-aware rendering, be committed in auditable batches, and remain marked NEEDS_TESTING until browser verified.
