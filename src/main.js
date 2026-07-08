import { startTopShotPhaser } from './engine/topShotGame.js';

if (globalThis.Phaser) {
  startTopShotPhaser();
} else {
  console.warn('Phaser did not load, using the legacy canvas prototype.');
  import('./legacyMain.js');
}
