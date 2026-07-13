import { ANIME_VISUAL_ASSETS, getAnimeVisualAsset } from './animeVisualAssets.js';

const VEHICLE_IDS = new Set(['car_1', 'car_2', 'bike', 'motorbike', 'atv', 'garage_alarm_post']);

export function drawVehicleSprite(ctx, vehicle, state = null, options = {}) {
  if (!vehicle || !isVehicleSprite(vehicle)) return false;
  const id = vehicle.vehicleId || vehicle.id;
  const kind = vehicle.vehicleKind || vehicle.kind;
  const flash = options.flash ?? Boolean((state?.vehicleDeparture?.vehicleId === id && state.vehicleDeparture.remoteFlashT > 0) || (state?.vehicleReturn?.vehicleId === id && state.vehicleReturn.remoteFlashT > 0) || vehicle.remoteFlashT > 0);
  const open = options.open ?? Boolean(vehicle.open);
  const trunkOpen = options.trunkOpen ?? Boolean(vehicle.trunkOpen);
  const rider = options.rider ?? shouldShowRider(vehicle);
  ctx.save();
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.shadowColor = 'transparent';
  if (id === 'car_1' || vehicle.vehicleBody === 'suv') {
    if (!open && !trunkOpen && drawProductionVehicle(ctx, vehicle, 'garageFamilySuv', flash)) return finishVehicleDraw(ctx);
    drawExactSuv(ctx, vehicle, { flash, open, trunkOpen });
  }
  else if (id === 'car_2' || vehicle.vehicleBody === 'sports' || vehicle.vehicleBody === 'convertible') {
    if (!open && !trunkOpen && drawProductionVehicle(ctx, vehicle, 'garageSportsConvertible', flash)) return finishVehicleDraw(ctx);
    drawExactSportsCar(ctx, vehicle, { flash, open, trunkOpen });
  }
  else if (kind === 'bike') drawExactBike(ctx, vehicle, { rider, flash });
  else if (kind === 'motorbike') drawExactMotorbike(ctx, vehicle, { rider, flash });
  else if (kind === 'atv') drawExactAtv(ctx, vehicle, { rider, flash });
  else if (vehicle.kind === 'charging_station' || id === 'garage_alarm_post') drawExactAlarmPost(ctx, vehicle, { flash });
  ctx.restore();
  return true;
}

function finishVehicleDraw(ctx) {
  ctx.restore();
  return true;
}

function drawProductionVehicle(ctx, vehicle, assetKey, flash) {
  const image = getAnimeVisualAsset(assetKey);
  const crop = ANIME_VISUAL_ASSETS[assetKey]?.crop;
  if (!image || !crop) return false;

  const w = vehicle.w || 116;
  const h = vehicle.h || 230;
  const maxWidth = w * 1.45;
  const naturalWidth = h * (crop.w / crop.h);
  const drawWidth = Math.min(maxWidth, naturalWidth);
  const drawHeight = drawWidth * (crop.h / crop.w);
  const cx = vehicle.x + w / 2;
  const cy = vehicle.y + h / 2;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(vehicleSpriteRotation(vehicle.facing));
  ctx.drawImage(
    image,
    crop.x,
    crop.y,
    crop.w,
    crop.h,
    -drawWidth / 2,
    -drawHeight / 2,
    drawWidth,
    drawHeight
  );
  ctx.restore();

  if (flash) drawAlarmHalo(ctx, vehicle.x, vehicle.y, w, h);
  return true;
}

export function vehicleSpriteRotation(facing = 'up') {
  if (facing === 'down') return Math.PI;
  if (facing === 'left') return -Math.PI / 2;
  if (facing === 'right') return Math.PI / 2;
  return 0;
}

export function isVehicleSprite(vehicle) {
  return Boolean(vehicle && (VEHICLE_IDS.has(vehicle.id) || VEHICLE_IDS.has(vehicle.vehicleId) || ['car', 'bike', 'motorbike', 'atv', 'charging_station'].includes(vehicle.kind) || ['bike', 'motorbike', 'atv', 'car'].includes(vehicle.vehicleKind)));
}

function shouldShowRider(vehicle) {
  return ['boarding', 'door_closing', 'remote_lock', 'garage_opening', 'leaving', 'arriving', 'parking', 'remote_unlock', 'door_opening'].includes(vehicle.phase);
}

function drawExactSuv(ctx, o, state) {
  const x = o.x, y = o.y, w = o.w || 126, h = o.h || 238;
  drawSoftShadow(ctx, x + w * .5, y + h * .55, w * .58, h * .46);
  ctx.save();
  drawSuvShell(ctx, x, y, w, h);
  drawSuvDoors(ctx, x, y, w, h, state.open);
  drawSuvHoodAndHatch(ctx, x, y, w, h, state.trunkOpen);
  drawSuvGlass(ctx, x, y, w, h);
  drawSuvLights(ctx, x, y, w, h, state.flash);
  drawCarMirrors(ctx, x, y, w, h, '#20262f');
  drawCarTireHints(ctx, x, y, w, h, .72);
  if (state.flash) drawAlarmHalo(ctx, x, y, w, h);
  ctx.restore();
}

function drawExactSportsCar(ctx, o, state) {
  const x = o.x, y = o.y, w = o.w || 108, h = o.h || 226;
  drawSoftShadow(ctx, x + w * .5, y + h * .56, w * .54, h * .45);
  ctx.save();
  drawSportsShell(ctx, x, y, w, h);
  drawSportsDoors(ctx, x, y, w, h, state.open);
  drawSportsHoodAndTrunk(ctx, x, y, w, h, state.trunkOpen);
  drawSportsGlass(ctx, x, y, w, h);
  drawSportsLights(ctx, x, y, w, h, state.flash);
  drawCarMirrors(ctx, x, y, w, h, '#3a1213');
  drawCarTireHints(ctx, x, y, w, h, .50);
  if (state.flash) drawAlarmHalo(ctx, x, y, w, h);
  ctx.restore();
}

function drawSuvShell(ctx, x, y, w, h) {
  ctx.fillStyle = '#101820';
  roundPath(ctx, x + w * .04, y + h * .02, w * .92, h * .96, w * .19).fill();
  const body = new Path2D();
  body.moveTo(x + w * .18, y + h * .02);
  body.quadraticCurveTo(x + w * .50, y - h * .03, x + w * .82, y + h * .02);
  body.quadraticCurveTo(x + w * .96, y + h * .18, x + w * .93, y + h * .48);
  body.lineTo(x + w * .91, y + h * .78);
  body.quadraticCurveTo(x + w * .89, y + h * .97, x + w * .50, y + h * .995);
  body.quadraticCurveTo(x + w * .11, y + h * .97, x + w * .09, y + h * .78);
  body.lineTo(x + w * .07, y + h * .48);
  body.quadraticCurveTo(x + w * .04, y + h * .18, x + w * .18, y + h * .02);
  body.closePath();
  ctx.fillStyle = '#f5f4ee';
  ctx.fill(body);
  ctx.strokeStyle = '#111820';
  ctx.lineWidth = Math.max(2, w * .025);
  ctx.stroke(body);
  ctx.fillStyle = 'rgba(0,0,0,.10)';
  rounded(ctx, x + w * .08, y + h * .25, w * .08, h * .46, w * .04);
  rounded(ctx, x + w * .84, y + h * .25, w * .08, h * .46, w * .04);
  ctx.fillStyle = 'rgba(255,255,255,.50)';
  curveLine(ctx, x + w * .23, y + h * .08, x + w * .34, y + h * .04, x + w * .46, y + h * .07, 2);
  curveLine(ctx, x + w * .54, y + h * .07, x + w * .66, y + h * .04, x + w * .77, y + h * .08, 2);
}

function drawSuvGlass(ctx, x, y, w, h) {
  ctx.fillStyle = '#17232b';
  rounded(ctx, x + w * .17, y + h * .18, w * .66, h * .16, w * .08);
  ctx.fillStyle = '#111820';
  rounded(ctx, x + w * .27, y + h * .41, w * .46, h * .28, w * .05);
  ctx.fillStyle = '#17232b';
  rounded(ctx, x + w * .17, y + h * .78, w * .66, h * .14, w * .07);
  ctx.fillStyle = 'rgba(116,230,255,.10)';
  rounded(ctx, x + w * .20, y + h * .20, w * .60, h * .12, w * .06);
  rounded(ctx, x + w * .30, y + h * .43, w * .40, h * .24, w * .04);
  rounded(ctx, x + w * .20, y + h * .80, w * .60, h * .10, w * .05);
}

function drawSuvDoors(ctx, x, y, w, h, open) {
  drawDoorSeams(ctx, x, y, w, h, '#cfd0ca');
  if (!open) return;
  const left = { x: x - w * .20, y: y + h * .47, w: w * .24, h: h * .17 };
  const right = { x: x + w * .96, y: y + h * .47, w: w * .24, h: h * .17 };
  drawOpenDoorPanel(ctx, left, '#f5f4ee', '#17232b', -1);
  drawOpenDoorPanel(ctx, right, '#f5f4ee', '#17232b', 1);
}

function drawSuvHoodAndHatch(ctx, x, y, w, h, trunkOpen) {
  ctx.strokeStyle = '#d6d4cd';
  ctx.lineWidth = 1.5;
  roundedStroke(ctx, x + w * .22, y + h * .06, w * .56, h * .11, w * .06);
  roundedStroke(ctx, x + w * .20, y + h * .72, w * .60, h * .16, w * .06);
  if (trunkOpen) drawOpenTrunkPanel(ctx, x, y - h * .15, w, h * .18, '#f5f4ee');
}

function drawSuvLights(ctx, x, y, w, h, flash) {
  const head = flash ? '#fff3a6' : '#f8fbff';
  const tail = flash ? '#ff615c' : '#d52222';
  lens(ctx, x + w * .18, y + h * .955, w * .20, h * .025, tail, -0.14);
  lens(ctx, x + w * .62, y + h * .955, w * .20, h * .025, tail, 0.14);
  lens(ctx, x + w * .18, y + h * .035, w * .16, h * .030, head, 0.18);
  lens(ctx, x + w * .66, y + h * .035, w * .16, h * .030, head, -0.18);
}

function drawSportsShell(ctx, x, y, w, h) {
  ctx.fillStyle = '#210507';
  roundPath(ctx, x + w * .04, y + h * .02, w * .92, h * .96, w * .22).fill();
  const body = new Path2D();
  body.moveTo(x + w * .20, y + h * .02);
  body.quadraticCurveTo(x + w * .50, y - h * .035, x + w * .80, y + h * .02);
  body.quadraticCurveTo(x + w * .96, y + h * .24, x + w * .91, y + h * .50);
  body.quadraticCurveTo(x + w * .94, y + h * .78, x + w * .82, y + h * .96);
  body.quadraticCurveTo(x + w * .50, y + h * 1.02, x + w * .18, y + h * .96);
  body.quadraticCurveTo(x + w * .06, y + h * .78, x + w * .09, y + h * .50);
  body.quadraticCurveTo(x + w * .04, y + h * .24, x + w * .20, y + h * .02);
  body.closePath();
  ctx.fillStyle = '#d81c20';
  ctx.fill(body);
  ctx.strokeStyle = '#210507';
  ctx.lineWidth = Math.max(2, w * .025);
  ctx.stroke(body);
  ctx.fillStyle = 'rgba(0,0,0,.18)';
  rounded(ctx, x + w * .08, y + h * .34, w * .08, h * .25, w * .04);
  rounded(ctx, x + w * .84, y + h * .34, w * .08, h * .25, w * .04);
  ctx.strokeStyle = 'rgba(255,255,255,.18)';
  ctx.lineWidth = 2;
  curveLine(ctx, x + w * .18, y + h * .11, x + w * .30, y + h * .06, x + w * .46, y + h * .09, 2);
  curveLine(ctx, x + w * .54, y + h * .09, x + w * .70, y + h * .06, x + w * .82, y + h * .11, 2);
}

function drawSportsGlass(ctx, x, y, w, h) {
  ctx.fillStyle = '#111820';
  rounded(ctx, x + w * .17, y + h * .22, w * .66, h * .16, w * .08);
  rounded(ctx, x + w * .24, y + h * .74, w * .52, h * .12, w * .06);
  ctx.fillStyle = 'rgba(116,230,255,.08)';
  rounded(ctx, x + w * .20, y + h * .24, w * .60, h * .11, w * .06);
  rounded(ctx, x + w * .28, y + h * .76, w * .44, h * .08, w * .04);
}

function drawSportsDoors(ctx, x, y, w, h, open) {
  drawDoorSeams(ctx, x, y, w, h, '#831014');
  if (!open) return;
  drawOpenDoorPanel(ctx, { x: x - w * .22, y: y + h * .43, w: w * .26, h: h * .18 }, '#d81c20', '#111820', -1);
  drawOpenDoorPanel(ctx, { x: x + w * .96, y: y + h * .43, w: w * .26, h: h * .18 }, '#d81c20', '#111820', 1);
}

function drawSportsHoodAndTrunk(ctx, x, y, w, h, trunkOpen) {
  ctx.strokeStyle = '#831014';
  ctx.lineWidth = 1.5;
  curveLine(ctx, x + w * .18, y + h * .12, x + w * .50, y + h * .16, x + w * .82, y + h * .12, 1.5);
  curveLine(ctx, x + w * .20, y + h * .89, x + w * .50, y + h * .94, x + w * .80, y + h * .89, 1.5);
  if (trunkOpen) drawOpenTrunkPanel(ctx, x, y - h * .13, w, h * .15, '#d81c20');
}

function drawSportsLights(ctx, x, y, w, h, flash) {
  const head = flash ? '#fff3a6' : '#f8fbff';
  const tail = flash ? '#ff615c' : '#f0272b';
  lens(ctx, x + w * .17, y + h * .955, w * .22, h * .025, tail, -0.12);
  lens(ctx, x + w * .61, y + h * .955, w * .22, h * .025, tail, 0.12);
  lens(ctx, x + w * .17, y + h * .035, w * .16, h * .028, head, 0.14);
  lens(ctx, x + w * .67, y + h * .035, w * .16, h * .028, head, -0.14);
}

function drawExactBike(ctx, o, opts) {
  const x = o.x, y = o.y, w = o.w || 34, h = o.h || 96, cx = x + w / 2;
  drawSoftShadow(ctx, cx, y + h * .55, w * .48, h * .42);
  drawWheel(ctx, cx, y + h * .10, w * .16, h * .15);
  drawWheel(ctx, cx, y + h * .89, w * .16, h * .15);
  line(ctx, cx, y + h * .22, x + w * .25, y + h * .52, '#062d33', 3);
  line(ctx, x + w * .25, y + h * .52, cx, y + h * .78, '#062d33', 3);
  line(ctx, cx, y + h * .22, x + w * .75, y + h * .52, '#0cb9cc', 3);
  line(ctx, x + w * .75, y + h * .52, cx, y + h * .78, '#0cb9cc', 3);
  line(ctx, x + w * .13, y + h * .18, x + w * .87, y + h * .18, '#6e4c2e', 3);
  rounded(ctx, cx - w * .18, y + h * .53, w * .36, h * .12, w * .10, '#111820');
  drawPedalGroup(ctx, cx, y + h * .48, w, h);
  if (opts.rider) drawMiniRider(ctx, cx, y + h * .56, Math.max(14, w * .50));
  if (opts.flash) drawAlarmPulse(ctx, cx, y + h * .10, 12);
}

function drawExactMotorbike(ctx, o, opts) {
  const x = o.x, y = o.y, w = o.w || 48, h = o.h || 122, cx = x + w / 2;
  drawSoftShadow(ctx, cx, y + h * .58, w * .45, h * .45);
  drawWheel(ctx, cx, y + h * .10, w * .22, h * .12);
  drawWheel(ctx, cx, y + h * .88, w * .24, h * .14);
  rounded(ctx, cx - w * .22, y + h * .26, w * .44, h * .28, w * .18, '#262b30');
  rounded(ctx, cx - w * .26, y + h * .48, w * .52, h * .24, w * .17, '#2e3238');
  rounded(ctx, cx - w * .18, y + h * .63, w * .36, h * .22, w * .14, '#9b704f');
  circle(ctx, cx, y + h * .36, w * .13, '#d5d9d8');
  line(ctx, x + w * .12, y + h * .25, x + w * .88, y + h * .25, '#111820', 4);
  circle(ctx, x + w * .10, y + h * .22, w * .08, '#c8d0cf', false);
  circle(ctx, x + w * .90, y + h * .22, w * .08, '#c8d0cf', false);
  if (opts.rider) drawMiniRider(ctx, cx, y + h * .60, Math.max(18, w * .48));
  if (opts.flash) drawAlarmPulse(ctx, cx, y + h * .08, 14);
}

function drawExactAtv(ctx, o, opts) {
  const x = o.x, y = o.y, w = o.w || 82, h = o.h || 116, cx = x + w / 2;
  drawSoftShadow(ctx, cx, y + h * .56, w * .62, h * .48);
  drawAtvTire(ctx, x + w * .08, y + h * .18, w * .22, h * .22);
  drawAtvTire(ctx, x + w * .92, y + h * .18, w * .22, h * .22);
  drawAtvTire(ctx, x + w * .08, y + h * .82, w * .22, h * .22);
  drawAtvTire(ctx, x + w * .92, y + h * .82, w * .22, h * .22);
  rounded(ctx, x + w * .18, y + h * .08, w * .64, h * .84, w * .18, '#4d5f33');
  rounded(ctx, x + w * .29, y + h * .17, w * .42, h * .24, w * .07, '#8da043');
  rounded(ctx, x + w * .29, y + h * .58, w * .42, h * .25, w * .08, '#8da043');
  rounded(ctx, x + w * .34, y + h * .39, w * .32, h * .29, w * .13, '#2e332b');
  line(ctx, x + w * .15, y + h * .44, x + w * .85, y + h * .44, '#171b18', 4);
  line(ctx, x + w * .27, y + h * .88, x + w * .73, y + h * .88, '#172017', 4);
  drawAtvGrill(ctx, x, y, w, h);
  if (opts.rider) drawMiniRider(ctx, cx, y + h * .58, Math.max(18, w * .26));
  if (opts.flash) drawAlarmPulse(ctx, cx, y + h * .82, 17);
}

function drawExactAlarmPost(ctx, o, opts) {
  const x = o.x, y = o.y, w = o.w || 36, h = o.h || 92;
  drawSoftShadow(ctx, x + w / 2, y + h * .58, w * .34, h * .27);
  rounded(ctx, x + w * .08, y + h * .02, w * .84, h * .96, w * .14, '#2f3a3e');
  rounded(ctx, x + w * .16, y + h * .08, w * .68, h * .12, w * .04, '#82939b');
  rounded(ctx, x + w * .16, y + h * .28, w * .68, h * .58, w * .08, '#242d30');
  const glow = opts.flash ? '#f1c66a' : '#34e235';
  rounded(ctx, x + w * .08, y + h * .22, w * .84, h * .07, w * .04, glow);
}

function drawDoorSeams(ctx, x, y, w, h, color) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.4;
  line(ctx, x + w * .12, y + h * .43, x + w * .12, y + h * .69, color, 1.4);
  line(ctx, x + w * .88, y + h * .43, x + w * .88, y + h * .69, color, 1.4);
  line(ctx, x + w * .12, y + h * .54, x + w * .20, y + h * .54, color, 1.2);
  line(ctx, x + w * .80, y + h * .54, x + w * .88, y + h * .54, color, 1.2);
}

function drawOpenDoorPanel(ctx, r, body, glass, side) {
  ctx.save();
  rounded(ctx, r.x, r.y, r.w, r.h, Math.min(9, r.w * .22), body);
  rounded(ctx, r.x + r.w * .12, r.y + r.h * .12, r.w * .76, r.h * .40, Math.min(6, r.w * .14), glass);
  line(ctx, side < 0 ? r.x + r.w : r.x, r.y + r.h * .48, side < 0 ? r.x + r.w + 18 : r.x - 18, r.y + r.h * .58, 'rgba(7,16,24,.65)', 2);
  ctx.restore();
}

function drawOpenTrunkPanel(ctx, x, y, w, h, color) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.strokeStyle = '#111820';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x + w * .16, y + h * .98);
  ctx.lineTo(x + w * .84, y + h * .98);
  ctx.lineTo(x + w * .74, y + h * .20);
  ctx.lineTo(x + w * .26, y + h * .20);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

function drawCarMirrors(ctx, x, y, w, h, color) {
  rounded(ctx, x - w * .08, y + h * .39, w * .14, h * .05, w * .03, color);
  rounded(ctx, x + w * .94, y + h * .39, w * .14, h * .05, w * .03, color);
}

function drawCarTireHints(ctx, x, y, w, h, alpha = .6) {
  ctx.save();
  ctx.globalAlpha = alpha;
  rounded(ctx, x + w * .01, y + h * .30, w * .08, h * .18, w * .04, '#0b0f12');
  rounded(ctx, x + w * .91, y + h * .30, w * .08, h * .18, w * .04, '#0b0f12');
  rounded(ctx, x + w * .01, y + h * .68, w * .08, h * .18, w * .04, '#0b0f12');
  rounded(ctx, x + w * .91, y + h * .68, w * .08, h * .18, w * .04, '#0b0f12');
  ctx.restore();
}

function drawWheel(ctx, x, y, rx, ry) {
  ctx.save();
  ctx.fillStyle = '#0d1215';
  ctx.strokeStyle = '#232a30';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

function drawAtvTire(ctx, x, y, rx, ry) {
  drawWheel(ctx, x, y, rx, ry);
  ctx.save();
  ctx.strokeStyle = 'rgba(255,255,255,.18)';
  ctx.lineWidth = 1.2;
  for (let i = -2; i <= 2; i++) line(ctx, x - rx * .45, y + i * ry * .18, x + rx * .45, y + i * ry * .18, 'rgba(255,255,255,.18)', 1.2);
  ctx.restore();
}

function drawAtvGrill(ctx, x, y, w, h) {
  ctx.strokeStyle = '#172017';
  ctx.lineWidth = 2;
  roundedStroke(ctx, x + w * .29, y + h * .83, w * .42, h * .10, w * .04);
  line(ctx, x + w * .35, y + h * .84, x + w * .35, y + h * .91, '#172017', 1.5);
  line(ctx, x + w * .50, y + h * .84, x + w * .50, y + h * .91, '#172017', 1.5);
  line(ctx, x + w * .65, y + h * .84, x + w * .65, y + h * .91, '#172017', 1.5);
}

function drawPedalGroup(ctx, x, y, w, h) {
  circle(ctx, x, y, w * .11, '#293136', false);
  line(ctx, x - w * .18, y + h * .05, x + w * .18, y - h * .05, '#6e4c2e', 2);
  rounded(ctx, x - w * .30, y + h * .07, w * .18, h * .04, 2, '#d28a2e');
  rounded(ctx, x + w * .12, y - h * .10, w * .18, h * .04, 2, '#d28a2e');
}

function drawMiniRider(ctx, x, y, size) {
  ctx.save();
  ctx.fillStyle = 'rgba(0,0,0,.20)';
  ctx.beginPath();
  ctx.ellipse(x, y + size * .35, size * .55, size * .32, 0, 0, Math.PI * 2);
  ctx.fill();
  rounded(ctx, x - size * .36, y - size * .55, size * .72, size * 1.08, size * .25, '#79b7ff');
  circle(ctx, x, y - size * .78, size * .28, '#2f1f1b');
  line(ctx, x - size * .32, y - size * .18, x - size * .78, y - size * .56, '#20130f', 3);
  line(ctx, x + size * .32, y - size * .18, x + size * .78, y - size * .56, '#20130f', 3);
  ctx.restore();
}

function drawSoftShadow(ctx, x, y, rx, ry) {
  ctx.save();
  ctx.globalAlpha = .22;
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawAlarmHalo(ctx, x, y, w, h) {
  ctx.save();
  ctx.strokeStyle = 'rgba(255,244,164,.68)';
  ctx.lineWidth = 3;
  roundedStroke(ctx, x - 7, y - 7, w + 14, h + 14, 18);
  ctx.restore();
}

function drawAlarmPulse(ctx, x, y, r) {
  ctx.save();
  ctx.strokeStyle = 'rgba(255,244,164,.68)';
  ctx.lineWidth = 2;
  circle(ctx, x, y, r, 'rgba(255,244,164,.68)', false);
  ctx.restore();
}

function lens(ctx, x, y, w, h, color, tilt = 0) {
  ctx.save();
  ctx.translate(x + w / 2, y + h / 2);
  ctx.rotate(tilt);
  rounded(ctx, -w / 2, -h / 2, w, h, h / 2, color);
  ctx.restore();
}

function curveLine(ctx, x1, y1, cx, cy, x2, y2, width = 2) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.quadraticCurveTo(cx, cy, x2, y2);
  ctx.strokeStyle = ctx.strokeStyle || '#000';
  ctx.lineWidth = width;
  ctx.stroke();
}

function line(ctx, x1, y1, x2, y2, color, width = 1) {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function rounded(ctx, x, y, w, h, r, color) {
  ctx.fillStyle = color;
  const p = roundPath(ctx, x, y, w, h, r);
  p.fill();
}

function roundedStroke(ctx, x, y, w, h, r) {
  const p = roundPath(ctx, x, y, w, h, r);
  p.stroke();
}

function roundPath(ctx, x, y, w, h, r) {
  const p = new CanvasPath(ctx);
  p.roundRect(x, y, Math.max(1, w), Math.max(1, h), Math.max(0, r));
  return p;
}

function circle(ctx, x, y, r, color, fill = true) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  if (fill) { ctx.fillStyle = color; ctx.fill(); }
  else { ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.stroke(); }
}

class CanvasPath {
  constructor(ctx) { this.ctx = ctx; }
  roundRect(x, y, w, h, r) {
    const ctx = this.ctx;
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(x, y, w, h, r);
    else ctx.rect(x, y, w, h);
    return this;
  }
  fill() { this.ctx.fill(); }
  stroke() { this.ctx.stroke(); }
}
