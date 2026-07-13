const BIKE_KINDS = new Set(['bike', 'motorbike', 'atv']);

export function isBikeLikeVehicle(vehicle) {
  return Boolean(vehicle && BIKE_KINDS.has(vehicle.vehicleKind || vehicle.kind));
}

export function drawBikeMountOverlay(ctx, vehicle, _state = null, options = {}) {
  if (!isBikeLikeVehicle(vehicle)) return false;
  const kind = vehicle.vehicleKind || vehicle.kind;
  const x = vehicle.x || 0;
  const y = vehicle.y || 0;
  const w = vehicle.w || (kind === 'bike' ? 34 : kind === 'motorbike' ? 48 : 82);
  const h = vehicle.h || (kind === 'bike' ? 96 : kind === 'motorbike' ? 122 : 116);
  ctx.save();
  ctx.shadowColor = 'transparent';
  if (kind === 'bike') drawBicycleCorrections(ctx, x, y, w, h, options);
  else if (kind === 'motorbike') drawMotorbikeCorrections(ctx, x, y, w, h, options);
  else drawAtvCorrections(ctx, x, y, w, h, options);
  ctx.restore();
  return true;
}

function drawBicycleCorrections(ctx, x, y, w, h, options) {
  const cx = x + w / 2;
  const handleY = y + h * .16;
  const seatY = y + h * .58;
  line(ctx, cx, y + h * .22, cx, handleY, '#101820', Math.max(2.2, w * .09));
  line(ctx, x - w * .34, handleY, x + w * 1.34, handleY, '#101820', Math.max(2.4, w * .10));
  rounded(ctx, x - w * .50, handleY - 4, w * .34, 8, 4, '#2b1710');
  rounded(ctx, x + w * 1.16, handleY - 4, w * .34, 8, 4, '#2b1710');
  circle(ctx, x - w * .20, handleY, Math.max(2.4, w * .07), '#c9d4d2');
  circle(ctx, x + w * 1.20, handleY, Math.max(2.4, w * .07), '#c9d4d2');
  line(ctx, cx, y + h * .74, cx, y + h * .92, '#101820', Math.max(1.8, w * .07));
  rounded(ctx, cx - w * .24, seatY - h * .06, w * .48, h * .12, w * .12, '#070b0f');
  if (options.rider) drawMountedRider(ctx, cx, seatY, Math.max(18, w * .66), 'bike');
}

function drawMotorbikeCorrections(ctx, x, y, w, h, options) {
  const cx = x + w / 2;
  const handleY = y + h * .20;
  const seatY = y + h * .63;
  line(ctx, cx, y + h * .31, cx, handleY, '#101820', Math.max(3, w * .08));
  line(ctx, x - w * .20, handleY, x + w * 1.20, handleY, '#101820', Math.max(3.2, w * .08));
  rounded(ctx, x - w * .34, handleY - 5, w * .30, 10, 5, '#2b1710');
  rounded(ctx, x + w * 1.04, handleY - 5, w * .30, 10, 5, '#2b1710');
  circle(ctx, x - w * .16, handleY + 3, Math.max(3, w * .08), '#d7e0de');
  circle(ctx, x + w * 1.16, handleY + 3, Math.max(3, w * .08), '#d7e0de');
  rounded(ctx, cx - w * .30, seatY - h * .08, w * .60, h * .18, w * .16, '#070b0f');
  line(ctx, cx - w * .22, seatY - h * .04, cx + w * .22, seatY - h * .04, 'rgba(255,255,255,.18)', 1.4);
  if (options.rider) drawMountedRider(ctx, cx, seatY, Math.max(22, w * .56), 'motorbike');
}

function drawAtvCorrections(ctx, x, y, w, h, options) {
  const cx = x + w / 2;
  const handleY = y + h * .42;
  const seatY = y + h * .58;
  line(ctx, x + w * .26, handleY, x + w * .74, handleY, '#101820', Math.max(4, w * .055));
  rounded(ctx, x + w * .17, handleY - 5, w * .20, 10, 5, '#2b1710');
  rounded(ctx, x + w * .63, handleY - 5, w * .20, 10, 5, '#2b1710');
  rounded(ctx, cx - w * .18, y + h * .48, w * .36, h * .20, w * .08, '#070b0f');
  if (options.rider) drawMountedRider(ctx, cx, seatY, Math.max(24, w * .32), 'atv');
}

function drawMountedRider(ctx, x, y, size, kind) {
  ctx.save();
  ctx.globalAlpha = .98;
  ctx.fillStyle = 'rgba(0,0,0,.22)';
  ctx.beginPath();
  ctx.ellipse(x, y + size * .40, size * .70, size * .38, 0, 0, Math.PI * 2);
  ctx.fill();
  rounded(ctx, x - size * .32, y - size * .46, size * .64, size * .90, size * .23, '#79b7ff');
  rounded(ctx, x - size * .24, y - size * .12, size * .48, size * .40, size * .18, '#24324a');
  circle(ctx, x, y - size * .70, size * .26, '#2f1f1b');
  circle(ctx, x, y - size * .75, size * .18, '#101820');
  const handReach = kind === 'atv' ? size * .48 : size * .72;
  const handY = kind === 'atv' ? y - size * .16 : y - size * .78;
  line(ctx, x - size * .22, y - size * .20, x - handReach, handY, '#2f1f1b', Math.max(2.4, size * .10));
  line(ctx, x + size * .22, y - size * .20, x + handReach, handY, '#2f1f1b', Math.max(2.4, size * .10));
  line(ctx, x - size * .18, y + size * .25, x - size * .52, y + size * .62, '#111820', Math.max(2.3, size * .09));
  line(ctx, x + size * .18, y + size * .25, x + size * .52, y + size * .62, '#111820', Math.max(2.3, size * .09));
  ctx.fillStyle = '#f1c66a';
  ctx.font = `900 ${Math.max(6, size * .18)}px system-ui`;
  ctx.textAlign = 'center';
  ctx.fillText('MOUNTED', x, y - size * 1.08);
  ctx.textAlign = 'left';
  ctx.restore();
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

function rounded(ctx, x, y, w, h, r, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(x, y, Math.max(1, w), Math.max(1, h), Math.max(0, r));
  else ctx.rect(x, y, Math.max(1, w), Math.max(1, h));
  ctx.fill();
}
