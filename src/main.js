import './runtimeObjectCorrections.js?v=20260717-full-phaser-parity';

const gameCanvas = document.getElementById('game');
if (gameCanvas) gameCanvas.dataset.phaserOwned = 'true';

const { bootPhaserParityGame } = await import('./phaserParityRuntime.js?v=20260717-full-phaser-parity');
bootPhaserParityGame();
