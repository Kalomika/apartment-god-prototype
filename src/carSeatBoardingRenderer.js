const CAR_KINDS = new Set(['car']);
const DOOR_PHASES = new Set([
  'car_assigned_doors_opening',
  'car_popout_seats_extending',
  'car_travelers_sitting_on_popout_seats',
  'car_popout_seats_retracting',
  'car_assigned_doors_closing',
  'car_return_assigned_doors_opening',
  'car_return_popout_seats_extending',
  'car_return_travelers_step_out',
  'car_return_popout_seats_retracting',
  'car_return_assigned_doors_closing'
]);
const SEAT_PHASES = new Set([
  'car_popout_seats_extending',
  'car_travelers_sitting_on_popout_seats',
  'car_popout_seats_retracting',
  'car_return_popout_seats_extending',
  'car_return_travelers_step_out',
  'car_return_popout_seats_retracting'
]);

export function isCarLikeVehicle(vehicle) {
  return Boolean(vehicle && CAR_KINDS.has(vehicle.vehicleKind || vehicle.kind));
}

export function drawCarSeatBoardingOverlay(ctx, vehicle) {
  if (!isCarLikeVehicle(vehicle) || !DOOR_PHASES.has(vehicle.phase)) return false;
  const seats = activeSeatAssignments(vehicle);
  if (!seats.length) return false;
  const x = vehicle.x || 0;
  const y = vehicle.y || 0;
  const w = vehicle.w || 116;
  const h = vehicle.h || 230;
  ctx.save();
  ctx.shadowColor = 'transparent';
  for (const seat of seats) drawAssignedDoor(ctx, x, y, w, h, seat.seatId, vehicle);
  if (SEAT_PHASES.has(vehicle.phase)) for (const seat of seats) drawPopOutSeat(ctx, x, y, w, h, seat.seatId, vehicle);
  ctx.restore();
  return true;
}

function activeSeatAssignments(vehicle) {
  const seats = Array.isArray(vehicle.seatAssignments) ? vehicle.seatAssignments : [];
  return seats.filter(seat => seat && seat.seatId);
}

function drawAssignedDoor(ctx, x, y, w, h, seatId, vehicle) {
  const side = seatSide(seatId);
  const rowY = seatRowY(seatId, h);
  const doorW = Math.max(24, w * .24);
  const doorH = Math.max(28, h * .15);
  const openAmount = doorOpenAmount(vehicle.phase, vehicle.t || 0);
  if (openAmount <= 0) return;
  const dx = side < 0 ? -doorW * openAmount : w + doorW * (openAmount - 1);
  const dy = y + rowY - doorH * .5;
  const hingeX = side < 0 ? x + w * .08 : x + w * .92;
  const panelX = x + dx;
  rounded(ctx, panelX, dy, doorW, doorH, 8, vehicle.vehicleId === 'car_2' ? '#d81c20' : '#f5f4ee');
  rounded(ctx, panelX + doorW * .18, dy + doorH * .18, doorW * .64, doorH * .54, 5, '#17232b');
  line(ctx, hingeX, dy + doorH * .18, panelX + (side < 0 ? doorW : 0), dy + doorH * .18, '#101820', 2);
  line(ctx, hingeX, dy + doorH * .82, panelX + (side < 0 ? doorW : 0), dy + doorH * .82, '#101820', 2);
}

function drawPopOutSeat(ctx, x, y, w, h, seatId, vehicle) {
  const side = seatSide(seatId);
  const rowY = seatRowY(seatId, h);
  const progress = seatPopAmount(vehicle.phase, vehicle.t || 0);
  if (progress <= 0) return;
  const seatW = Math.max(24, w * .25);
  const seatH = Math.max(24, h * .13);
  const baseX = side < 0 ? x + w * .12 : x + w * .63;
  const outX = side < 0 ? x - seatW * .92 : x + w + seatW * .04;
  const sx = lerp(baseX, outX, progress);
  const sy = y + rowY - seatH * .5;
  line(ctx, side < 0 ? x + w * .18 : x + w * .82, sy + seatH * .5, sx + seatW * .5, sy + seatH * .5, '#2a3140', 4);
  rounded(ctx, sx, sy, seatW, seatH, 9, '#2f3a46');
  rounded(ctx, sx + seatW * .12, sy + seatH * .10, seatW * .76, seatH * .62, 7, '#586675');
  drawSeatedTraveler(ctx, sx + seatW * .5, sy + seatH * .38, Math.min(seatW, seatH) * .70, vehicle, seatId);
}

function drawSeatedTraveler(ctx, x, y, s, vehicle, seatId) {
  const assignment = (vehicle.seatAssignments || []).find(item => item.seatId === seatId);
  const color = assignment?.entityId === 'girlfriend' ? '#f2a3d7' : assignment?.role === 'dog' ? '#d7a66a' : '#79b7ff';
  ctx.save();
  ctx.fillStyle = color;
  rounded(ctx, x - s * .38, y - s * .18, s * .76, s * .56, s * .20, color);
  circle(ctx, x, y - s * .42, s * .25, assignment?.role === 'dog' ? '#8a5c31' : '#2f1f1b');
  line(ctx, x - s * .25, y + s * .18, x - s * .48, y + s * .48, '#111820', Math.max(1.6, s * .12));
  line(ctx, x + s * .25, y + s * .18, x + s * .48, y + s * .48, '#111820', Math.max(1.6, s * .12));
  ctx.restore();
}

function seatSide(seatId = '') {
  if (seatId.includes('right')) return 1;
  if (seatId === 'rear' || seatId === 'rider') return 1;
  return -1;
}

function seatRowY(seatId = '', h = 220) {
  if (seatId.includes('row3')) return h * .25;
  if (seatId.includes('row2') || seatId.includes('rear')) return h * .43;
  return h * .64;
}

function doorOpenAmount(phase, t) {
  if (phase === 'car_assigned_doors_opening' || phase === 'car_return_assigned_doors_opening') return clamp(t / .55, 0, 1);
  if (phase === 'car_assigned_doors_closing' || phase === 'car_return_assigned_doors_closing') return clamp(1 - t / .45, 0, 1);
  return 1;
}

function seatPopAmount(phase, t) {
  if (phase === 'car_popout_seats_extending' || phase === 'car_return_popout_seats_extending') return clamp(t / .45, 0, 1);
  if (phase === 'car_travelers_sitting_on_popout_seats' || phase === 'car_return_travelers_step_out') return 1;
  if (phase === 'car_popout_seats_retracting' || phase === 'car_return_popout_seats_retracting') return clamp(1 - t / .45, 0, 1);
  return 0;
}

function rounded(ctx, x, y, w, h, r, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(x, y, Math.max(1, w), Math.max(1, h), Math.max(0, r));
  else ctx.rect(x, y, Math.max(1, w), Math.max(1, h));
  ctx.fill();
  ctx.strokeStyle = '#101820';
  ctx.lineWidth = 1.5;
  ctx.stroke();
}

function line(ctx, x1, y1, x2, y2, color, width) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.restore();
}

function circle(ctx, x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

function lerp(a, b, t) {
  return a + (b - a) * clamp(t, 0, 1);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
