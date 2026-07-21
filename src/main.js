const gameCanvas = document.getElementById('game');
if (gameCanvas) {
  gameCanvas.dataset.phaserOwned = 'true';
  gameCanvas.style.background = '#708078';
}

await import('./fit.js?v=20260719-p2-mobile-gameplay-parity');
const { bootPhaserMigration2Game } = await import('./phaserMigration2Runtime.js?v=20260721-p2-layered-sidewalk');
const { installPhaserMigration2GameplayParityBridge } = await import('./phaserMigration2GameplayParityBridge.js?v=20260721-p2-hud-off-canvas');
const { installPhaserMigration2BackdropSafety } = await import('./phaserMigration2BackdropSafety.js?v=20260721-p2-nonblack-backdrop');
const { installPhaserMigration2HudPlacement } = await import('./phaserMigration2HudPlacement.js?v=20260721-p2-hud-placement');
const { installPhaserMigration2LayerFallbackSafety } = await import('./phaserMigration2LayerFallbackSafety.js?v=20260721-p2-layer-fallback');
const game = await bootPhaserMigration2Game();
installPhaserMigration2BackdropSafety(game, gameCanvas);
installPhaserMigration2HudPlacement(game);
installPhaserMigration2GameplayParityBridge(game);
installPhaserMigration2LayerFallbackSafety(game);
