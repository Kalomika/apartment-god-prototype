import './runtimeObjectCorrections.js?v=20260718-full-phaser-regression-repair';
import { installPhaserParityCorrections } from './phaserParityCorrections.js?v=20260718-full-phaser-regression-repair';
import { installPhaserVisualParityOverlay } from './phaserVisualParityOverlay.js?v=20260718-full-phaser-regression-repair';

const gameCanvas = document.getElementById('game');
if (gameCanvas) gameCanvas.dataset.phaserOwned = 'true';

const { bootPhaserParityGame } = await import('./phaserParityRuntime.js?v=20260718-full-phaser-regression-repair');
const game = await bootPhaserParityGame();
installPhaserParityCorrections(game);
installPhaserVisualParityOverlay(game);
