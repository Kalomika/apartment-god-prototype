import { byId } from './state.js';
import { isBikeLikeVehicle } from './bikeMountRenderer.js';

export function drawVehicleOccupantOverlay(ctx, state) {
  if (state.floor !== 3) return;
  const vehicle = state.vehicleDeparture || state.vehicleReturn;
  if (!vehicle) return;
  ctx.save();
  ctx.shadowColor = 'transparent';
  if (isBikeLikeVehicle(vehicle)) drawMountedBikePeople(ctx, state, vehicle);
  else drawGlassRoofOccupants(ctx, state, vehicle);
  ctx.restore();
}

function drawGlassRoofOccupants(ctx, state, vehicle) {
  const x = vehicle.x || 0;
  const y = vehicle.y || 0;
  const w = vehicle.w || 116;
  const h = vehicle.h || 230;
  const activeBoarding = ['door_opening', 'boarding'].includes(vehicle.phase);

  ctx.save();
  ctx.globalAlpha = .92;
  round(ctx, x + w * .22, y + h * .34, w * .56, h * .36, w * .08, 'rgba(14,30,38,.58)');
  ctx.strokeStyle = 'rgba(116,230,255,.32)';
  ctx.lineWidth = 1.6;
  if (ctx.roundRect) {
    ctx.beginPath();
    ctx.roundRect(x + w * .22, y + h * .34, w * .56, h * .36, w * .08);
    ctx.stroke();
  }
  ctx.restore();

  const assignments = vehicle.seatAssignments || [];
  for (const assignment of assignments) {
    const entity = byId(state, assignment.entityId);
    if (!entity) continue;
    const p = seatInsidePoint(vehicle, assignment.seatId);
    drawSeatedTop(ctx, p.x, p.y, entityColor(entity), entity.type === 'dog');
  }

  if (activeBoarding && assignments.length) {
    const assignment = assignments[0];
    const entity = byId(state, assignment.entityId);
    if (entity) drawRetractingSeat(ctx, vehicle, assignment.seatId, entity);
  }
}

function drawMountedBikePeople(ctx, state, vehicle) {
  if (!vehicle.mounted && !['mounting', 'mounted_ready', 'garage_opening', 'leaving', 'arriving', 'parking', 'dismounting'].includes(vehicle.phase)) return;
  const assignments = vehicle.seatAssignments || [];
  for (const assignment of assignments) {
    const entity = byId(state, assignment.entityId);
    if (!entity || entity.type === 'dog') continue;
    const p = bikeSeatPoint(vehicle, assignment.seatId);
    drawSeatedTop(ctx, p.x, p.y, entityColor(entity), false);
  }
}

function drawRetractingSeat(ctx, vehicle, seatId, entity) {
  const outside = outsideSeatPoint(vehicle, seatId);
  const inside = seatInsidePoint(vehicle, seatId);
  const t = Math.max(0, Math.min(1, (vehicle.t || 0) / .85));
  const x = outside.x + (inside.x - outside.x) * t;
  const y = outside.y + (inside.y - outside.y) * t;
  ctx.save();
  ctx.strokeStyle = 'rgba(116,230,255,.78)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(outside.x, outside.y);
  ctx.lineTo(inside.x, inside.y);
  ctx.stroke();
  round(ctx, x - 16, y - 10, 32, 20, 8, 'rgba(20,29,39,.92)');
  drawSeatedTop(ctx, x, y - 2, entityColor(entity), entity.type === 'dog');
  ctx.restore();
}

function seatInsidePoint(vehicle, seatId = 'front_left') {
  const x = vehicle.x || 0;
  const y = vehicle.y || 0;
  const w = vehicle.w || 116;
  const h = vehicle.h || 230;
  if (seatId === 'front_left') return { x: x + w * .38, y: y + h * .55 };
  if (seatId === 'front_right') return { x: x + w * .62, y: y + h * .55 };
  if (seatId.includes('row2')) return { x: x + w * (seatId.includes('left') ? .34 : seatId.includes('right') ? .66 : .50), y: y + h * .43 };
  if (seatId.includes('row3')) return { x: x + w * (seatId.includes('left') ? .38 : .62), y: y + h * .30 };
  if (seatId.includes('rear')) return { x: x + w * (seatId.includes('left') ? .38 : .62), y: y + h * .39 };
  return { x: x + w * .50, y: y + h * .50 };
}

function outsideSeatPoint(vehicle, seatId = 'front_left') {
  const x = vehicle.x || 0;
  const y = vehicle.y || 0;
  const w = vehicle.w || 116;
  const h = vehicle.h || 230;
  const right = seatId.includes('right');
  return { x: right ? x + w + 24 : x - 24, y: y + h * .56 };
}

function bikeSeatPoint(vehicle, seatId = 'rider') {
  const x = vehicle.x || 0;
  const y = vehicle.y || 0;
  const w = vehicle.w || 48;
  const h = vehicle.h || 116;
  const seatY = seatId === 'rear' ? .40 : .58;
  return { x: x + w / 2, y: y + h * seatY };
}

function drawSeatedTop(ctx, x, y, color, dog = false) {
  ctx.save();
  ctx.fillStyle = 'rgba(0,0,0,.22)';
  ctx.beginPath();
  ctx.ellipse(x, y + 10, dog ? 13 : 15, dog ? 8 : 10, 0, 0, Math.PI * 2);
  ctx.fill();
  if (dog) {
    circle(ctx, x, y, 11, '#f6f2e8');
    circle(ctx, x + 9, y - 3, 5, '#d8d0c0');
    circle(ctx, x - 9, y - 3, 5, '#d8d0c0');
  } else {
    round(ctx, x - 12, y + 2, 24, 18, 8, color);
    circle(ctx, x, y - 10, 10, '#3a241f');
    circle(ctx, x, y - 15, 8, '#101820');
  }
  ctx.restore();
}

function entityColor(entity) {
  if (entity.type === 'dog') return '#f6f2e8';
  if (entity.id === 'girlfriend' || entity.id === 'lab_test_woman') return '#ff75df';
  return '#79b7ff';
}

function round(ctx, x, y, w, h, r, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(x, y, Math.max(1, w), Math.max(1, h), Math.max(0, r));
  else ctx.rect(x, y, Math.max(1, w), Math.max(1, h));
  ctx.fill();
}

function circle(ctx, x, y, r, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}
