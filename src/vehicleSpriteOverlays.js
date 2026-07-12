import { objects } from './world.js';
import { drawVehicleSprite } from './vehicleSpriteRenderer.js';

const VEHICLE_KINDS = new Set(['car', 'bike', 'motorbike', 'atv', 'charging_station']);

export function drawVehicleSpriteOverlays(ctx, state) {
  if (state.floor !== 3) return;
  for (const obj of objects.filter(o => o.floor === 3 && VEHICLE_KINDS.has(o.kind))) {
    if (state.objectState?.vehicleInUse === obj.id) continue;
    drawVehicleSprite(ctx, obj, state);
  }
}
