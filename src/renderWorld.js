import { doorways, windows } from './blueprint.js';
import { drawStyledWorld } from './renderHouseStyle.js';
import { drawSlidingDoorOverlays } from './renderSlidingDoors.js';

export function drawWorld(ctx, state) {
  drawStyledWorld(ctx, state, doorways, windows);
  drawSlidingDoorOverlays(ctx, state, doorways);
}
