import { objects } from './world.js';
import { drawVehicleSprite } from './vehicleSpriteRenderer.js';
import { drawBikeMountOverlay } from './bikeMountRenderer.js';

const VEHICLE_KINDS = new Set(['car', 'bike', 'motorbike', 'atv', 'charging_station']);
const GARAGE_ALARM_POST = { id: 'garage_alarm_post', kind: 'charging_station', x: 752, y: 552, w: 38, h: 92 };

export function drawVehicleSpriteOverlays(ctx, state) {
  if (state.floor !== 3) return;
  for (const obj of objects.filter(o => o.floor === 3 && VEHICLE_KINDS.has(o.kind))) {
    if (state.objectState?.vehicleInUse === obj.id) continue;
    drawVehicleSprite(ctx, obj, state);
    drawBikeMountOverlay(ctx, obj, state, { rider: false });
  }
  drawVehicleSprite(ctx, GARAGE_ALARM_POST, state, { flash: Boolean(state.vehicleDeparture?.remoteFlashT > 0 || state.vehicleReturn?.remoteFlashT > 0) });
}
