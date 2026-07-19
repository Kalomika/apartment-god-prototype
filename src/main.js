const gameCanvas = document.getElementById('game');
if (gameCanvas) gameCanvas.dataset.phaserOwned = 'true';

await import('./fit.js?v=20260719-p2-mobile-gameplay-parity');
const { bootPhaserMigration2Game } = await import('./phaserMigration2Runtime.js?v=20260719-p2-visual-completion');
const { installPhaserMigration2GameplayParityBridge } = await import('./phaserMigration2GameplayParityBridge.js?v=20260719-p2-mobile-gameplay-parity');
const game = await bootPhaserMigration2Game();
installPhaserMigration2GameplayParityBridge(game);
