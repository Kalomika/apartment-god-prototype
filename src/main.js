const gameCanvas = document.getElementById('game');
if (gameCanvas) gameCanvas.dataset.phaserOwned = 'true';

await import('./fit.js?v=20260717-p2-full-gameplay');
const { bootPhaserMigration2Game } = await import('./phaserMigration2Runtime.js?v=20260717-full-main-gameplay-sync');
bootPhaserMigration2Game();
