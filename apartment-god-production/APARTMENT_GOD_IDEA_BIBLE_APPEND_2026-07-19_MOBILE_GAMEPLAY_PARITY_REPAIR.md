# Apartment God Idea Bible Append, Mobile Gameplay Parity Repair

Date: 2026-07-19
Branch: phaser-migration-2
Status: ACTIVE DIRECTIVE

Kam's directive:
The visual upgrade must not remove, hide or make inaccessible gameplay behavior that existed before it. Money, utility information, phone access, house browsing, floor Up and Down controls, map access and the usable gameplay viewport must remain immediately available. Visual upgrades must preserve the exact playable house organization and must not make the architecture look like disconnected incomplete sections.

Production rules:
1. Compare the current branch to the last verified pre-visual runtime before changing anything.
2. Preserve the improved object art while restoring missing or hidden gameplay UI.
3. Keep critical navigation visible without requiring the user to scroll through the HUD.
4. Fit the 4:3 gameplay canvas to the phone width without centering it inside a much taller empty wrapper.
5. Preserve world coordinates and gameplay routes.
6. Use connected architectural boundaries rather than a heavy rounded border around every room.
7. Do not call the repair complete until it is tested in the isolated mobile preview.
8. Do not update main or Render without explicit authorization.
