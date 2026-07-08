import { bootCanvasGame } from './canvasRuntime.js';

export function bootPhaserGame() {
  console.warn('[Apartment God] Phaser asset renderer disabled. Using stable Canvas runtime until production sprites are complete.');
  return bootCanvasGame('stable canvas renderer');
}
