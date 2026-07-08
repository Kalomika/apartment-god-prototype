import { doorways, windows } from './blueprint.js';
import { drawStyledWorld } from './renderHouseStyle.js';

export function drawWorld(ctx, state) {
  drawStyledWorld(ctx, state, doorways, windows);
}
