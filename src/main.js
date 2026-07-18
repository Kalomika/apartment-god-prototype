const gameCanvas = document.getElementById('game');
if (gameCanvas) gameCanvas.dataset.phaserOwned = 'true';

const { bootPhaserMigration2Game } = await import('./phaserMigration2Runtime.js?v=20260717-full-main-gameplay-sync');
bootPhaserMigration2Game();
