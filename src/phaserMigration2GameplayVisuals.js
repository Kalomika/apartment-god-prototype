import { getObject } from './world.js';

const FRONT_YARD_FLOOR = 6;
const DRIVEWAY_FLOOR = 7;
const GATE_Y = 414;
const DRIVEWAY_CENTER = 460;
const DRIVEWAY_WIDTH = 336;

export function createNativeGameplayVisuals(scene, layer) {
  const graphics = scene.add.graphics();
  const arcadeLabel = createText(scene, '', 12, '#f1c66a');
  const basketballScore = createText(scene, '', 14, '#f8fbff');
  const message = createText(scene, '', 13, '#f1c66a');
  const offsite = createText(scene, '', 13, '#f8fbff');
  for (const child of [graphics, arcadeLabel, basketballScore, message, offsite]) layer.add(child);
  return { graphics, arcadeLabel, basketballScore, message, offsite };
}

export function syncNativeGameplayVisuals(scene, state, visuals) {
  if (!visuals) return;
  const { graphics, arcadeLabel, basketballScore, message, offsite } = visuals;
  graphics.clear();
  hideText(arcadeLabel);
  hideText(basketballScore);
  hideText(message);
  hideText(offsite);

  drawFrontGate(graphics, state);
  drawTransientVehicle(graphics, state);
  drawArcade(graphics, state, arcadeLabel);
  drawBasketball(graphics, state, basketballScore, message);
  drawOffsite(graphics, state, offsite);
}

export function destroyNativeGameplayVisuals(visuals) {
  if (!visuals) return;
  for (const child of Object.values(visuals)) child?.destroy?.();
}

function drawFrontGate(graphics, state) {
  if (state.floor !== DRIVEWAY_FLOOR) return;
  const open = clamp(Number(state.frontGate?.open || 0), 0, 1);
  const left = DRIVEWAY_CENTER - DRIVEWAY_WIDTH / 2;
  const right = DRIVEWAY_CENTER + DRIVEWAY_WIDTH / 2;
  const opening = 22 + open * (DRIVEWAY_WIDTH * .43);
  const leftEnd = DRIVEWAY_CENTER - opening;
  const rightStart = DRIVEWAY_CENTER + opening;

  graphics.fillStyle(0x1d252c, .94);
  graphics.fillRect(left - 12, GATE_Y - 18, 12, 50);
  graphics.fillRect(right, GATE_Y - 18, 12, 50);
  drawGatePanel(graphics, left, leftEnd, GATE_Y);
  drawGatePanel(graphics, rightStart, right, GATE_Y);
  graphics.lineStyle(2, 0xf1c66a, .6);
  graphics.lineBetween(left, GATE_Y + 31, right, GATE_Y + 31);
}

function drawGatePanel(graphics, x1, x2, y) {
  if (x2 <= x1) return;
  graphics.fillStyle(0x303a42, .95);
  graphics.fillRect(x1, y - 12, x2 - x1, 36);
  graphics.lineStyle(2, 0x8b959e, .9);
  graphics.strokeRect(x1, y - 12, x2 - x1, 36);
  for (let x = x1 + 8; x < x2; x += 16) graphics.lineBetween(x, y - 10, x, y + 22);
}

function drawTransientVehicle(graphics, state) {
  const vehicle = state.vehicleDeparture?.floor === state.floor ? state.vehicleDeparture : state.vehicleReturn?.floor === state.floor ? state.vehicleReturn : null;
  if (!vehicle) return;
  const width = Math.max(34, Number(vehicle.w || (isBikeLike(vehicle) ? 42 : 104)));
  const height = Math.max(58, Number(vehicle.h || (isBikeLike(vehicle) ? 92 : 178)));
  const centerX = Number(vehicle.x || 0) + width / 2;
  const centerY = Number(vehicle.y || 0) + height / 2;
  const angle = Number(vehicle.renderAngle || 0);
  const color = vehicleColor(vehicle);

  if (isBikeLike(vehicle)) {
    drawBike(graphics, centerX, centerY, width, height, angle, color, vehicle);
    return;
  }

  const body = rotatedRect(centerX, centerY, width, height, angle);
  graphics.fillStyle(0x05080d, .28);
  const shadow = rotatedRect(centerX + 5, centerY + 8, width * 1.04, height * 1.02, angle);
  fillPolygon(graphics, shadow);
  graphics.fillStyle(color, 1);
  fillPolygon(graphics, body);
  graphics.lineStyle(3, 0x111820, .95);
  strokePolygon(graphics, body);

  const windshield = rotatedRect(centerX, centerY - height * .18, width * .64, height * .25, angle);
  graphics.fillStyle(0x8fc7d8, .58);
  fillPolygon(graphics, windshield);
  const rearWindow = rotatedRect(centerX, centerY + height * .21, width * .58, height * .18, angle);
  graphics.fillStyle(0x5b8796, .5);
  fillPolygon(graphics, rearWindow);

  const occupants = vehicle.partyIds || vehicle.actorIds || [];
  occupants.slice(0, 4).forEach((id, index) => {
    const row = index > 1 ? .18 : -.14;
    const column = index % 2 ? .18 : -.18;
    const point = rotatePoint(centerX + column * width, centerY + row * height, centerX, centerY, angle);
    graphics.fillStyle(index % 2 ? 0x5a342b : 0x3a241f, .9);
    graphics.fillCircle(point.x, point.y, Math.max(4, width * .055));
  });
}

function drawBike(graphics, x, y, width, height, angle, color, vehicle) {
  const front = rotatePoint(x, y - height * .34, x, y, angle);
  const rear = rotatePoint(x, y + height * .34, x, y, angle);
  graphics.lineStyle(5, 0x111820, 1);
  graphics.strokeCircle(front.x, front.y, Math.max(9, width * .24));
  graphics.strokeCircle(rear.x, rear.y, Math.max(9, width * .24));
  graphics.lineStyle(6, color, 1);
  graphics.lineBetween(front.x, front.y, rear.x, rear.y);
  const seat = rotatePoint(x, y + height * .05, x, y, angle);
  graphics.fillStyle(0x171a21, 1);
  graphics.fillCircle(seat.x, seat.y, 7);
  if (vehicle.mounted || vehicle.pusherVisible) {
    const rider = rotatePoint(x + (vehicle.pusherVisible ? width * .45 : 0), y, x, y, angle);
    graphics.fillStyle(0x5a342b, 1);
    graphics.fillCircle(rider.x, rider.y - 11, 7);
    graphics.lineStyle(7, 0x172433, 1);
    graphics.lineBetween(rider.x, rider.y - 3, rider.x, rider.y + 18);
  }
}

function drawArcade(graphics, state, labelText) {
  const game = state.arcadeGame;
  if (!game || game.floor !== state.floor) return;
  const machine = getObject(game.machineId);
  if (!machine) return;
  const screen = { x: clamp(machine.x + machine.w + 24, 18, 710), y: clamp(machine.y - 18, 62, 470), w: 220, h: 142 };
  graphics.fillStyle(0x071018, .9);
  graphics.fillRoundedRect(screen.x - 8, screen.y - 8, screen.w + 16, screen.h + 30, 14);
  graphics.fillStyle(0x101820, 1);
  graphics.fillRoundedRect(screen.x, screen.y, screen.w, screen.h, 9);
  if (game.mode === 'fighter') drawArcadeFighter(graphics, game, screen);
  else if (game.mode === 'pong') drawArcadePong(graphics, game, screen);
  else drawArcadeRacer(graphics, game, screen);
  setText(labelText, modeLabel(game.mode), screen.x + 8, screen.y + screen.h + 8);
  drawArcadeControls(graphics, state, game, machine);
}

function drawArcadeFighter(graphics, game, screen) {
  const f = game.fighter;
  graphics.fillStyle(0x33203c, 1);
  graphics.fillRect(screen.x + 5, screen.y + 5, screen.w - 10, screen.h - 10);
  graphics.fillStyle(0x632f51, 1);
  graphics.fillRect(screen.x + 5, screen.y + 88, screen.w - 10, 49);
  meter(graphics, screen.x + 10, screen.y + 10, 80, f.hpA / 100, 0x74e6ff);
  meter(graphics, screen.x + 130, screen.y + 10, 80, f.hpB / 100, 0xff75df);
  arcadeFighter(graphics, screen.x + f.xA, screen.y + 95, 0x74e6ff, 1, game.buttons[0]);
  arcadeFighter(graphics, screen.x + f.xB, screen.y + 95, 0xff75df, -1, game.buttons[1]);
}

function drawArcadePong(graphics, game, screen) {
  const p = game.pong;
  graphics.fillStyle(0x071018, 1);
  graphics.fillRect(screen.x + 5, screen.y + 5, screen.w - 10, screen.h - 10);
  graphics.lineStyle(1, 0xffffff, .22);
  graphics.lineBetween(screen.x + 110, screen.y + 7, screen.x + 110, screen.y + 135);
  graphics.fillStyle(0x74e6ff, 1);
  graphics.fillRect(screen.x + 8, screen.y + p.leftY - 20, 7, 40);
  graphics.fillStyle(0xff75df, 1);
  graphics.fillRect(screen.x + 205, screen.y + p.rightY - 20, 7, 40);
  graphics.fillStyle(0xf1c66a, 1);
  graphics.fillCircle(screen.x + p.ballX, screen.y + p.ballY, 5);
}

function drawArcadeRacer(graphics, game, screen) {
  const r = game.racer;
  graphics.fillStyle(0x1c3125, 1);
  graphics.fillRect(screen.x + 5, screen.y + 5, screen.w - 10, screen.h - 10);
  graphics.lineStyle(24, 0x777d80, 1);
  graphics.strokeEllipse(screen.x + 110, screen.y + 70, 156, 96);
  graphics.lineStyle(2, 0xf1c66a, .9);
  graphics.strokeEllipse(screen.x + 110, screen.y + 70, 156, 96);
  const carA = trackPoint(screen, r.progressA, 78, 48);
  const carB = trackPoint(screen, r.progressB, 62, 35);
  graphics.fillStyle(0x74e6ff, 1);
  graphics.fillCircle(carA.x, carA.y, 6);
  graphics.fillStyle(0xff75df, 1);
  graphics.fillCircle(carB.x, carB.y, 6);
}

function drawArcadeControls(graphics, state, game, machine) {
  const actors = (game.actorIds || []).map(id => state.entities.find(entity => entity.id === id)).filter(Boolean);
  actors.forEach((actor, index) => {
    const controlX = machine.x + machine.w / 2 + (index ? 9 : -9);
    const controlY = machine.y + machine.h - 8;
    const sway = Number(game.inputX || 0) * 4;
    graphics.lineStyle(4, 0x3a241f, 1);
    graphics.lineBetween(actor.x - 9, actor.y - 4, controlX - 6 + sway, controlY);
    graphics.lineBetween(actor.x + 9, actor.y - 4, controlX + 8, controlY + (game.buttons?.[0] ? -3 : 1));
    graphics.fillStyle(0x5a372f, 1);
    graphics.fillCircle(controlX - 6 + sway, controlY, 4);
    graphics.fillCircle(controlX + 8, controlY + (game.buttons?.[0] ? -3 : 1), 4);
  });
}

function drawBasketball(graphics, state, scoreText, messageText) {
  const game = state.basketballGame;
  if (!game || state.floor !== FRONT_YARD_FLOOR) return;
  const court = getObject(game.courtId || 'basketball_court');
  if (court) drawBasketballCourt(graphics, court);
  const players = game.playerIds || [];
  const scoreA = game.score?.[players[0]] || 0;
  const scoreB = game.score?.[players[1]] || 0;
  const nameA = game.names?.[players[0]] || players[0] || 'P1';
  const nameB = game.names?.[players[1]] || players[1] || 'P2';
  setText(scoreText, `${nameA} ${scoreA}  |  ${scoreB} ${nameB}`, 330, 48, 300, 'center');
  if (game.messageT > 0 && game.message) setText(messageText, game.message, 330, 82, 300, 'center');

  const ball = game.ball;
  if (!ball) return;
  const shadowScale = 1 - Math.min(.65, Number(ball.z || 0) / 110);
  graphics.fillStyle(0x000000, .25 * shadowScale);
  graphics.fillEllipse(ball.x, ball.y + 5, 19 * shadowScale, 10 * shadowScale);
  const drawY = ball.y - Number(ball.z || 0) * .34;
  graphics.fillStyle(0xc7672d, 1);
  graphics.fillCircle(ball.x, drawY, 8);
  graphics.lineStyle(1.5, 0x23140f, 1);
  graphics.strokeCircle(ball.x, drawY, 8);
  graphics.lineBetween(ball.x - 8, drawY, ball.x + 8, drawY);
  graphics.lineBetween(ball.x, drawY - 8, ball.x, drawY + 8);
}

function drawBasketballCourt(graphics, court) {
  graphics.fillStyle(0x35576a, .18);
  graphics.fillRoundedRect(court.x, court.y, court.w, court.h, 12);
  graphics.lineStyle(3, 0xf4e8c8, .78);
  graphics.strokeRoundedRect(court.x, court.y, court.w, court.h, 12);
  graphics.lineBetween(court.x + court.w / 2, court.y, court.x + court.w / 2, court.y + court.h);
  graphics.strokeCircle(court.x + court.w / 2, court.y + court.h / 2, Math.min(42, court.h * .2));
  const hoopX = court.x + court.w * .12;
  const hoopY = court.y + court.h * .5;
  graphics.lineStyle(5, 0xf4e8c8, .9);
  graphics.lineBetween(court.x + 18, hoopY - 34, court.x + 18, hoopY + 34);
  graphics.lineStyle(3, 0xd5533f, 1);
  graphics.strokeCircle(hoopX, hoopY, 10);
}

function drawOffsite(graphics, state, offsiteText) {
  const job = state.offsite;
  if (!job) return;
  const progress = clamp(Number(job.progress || 0), .02, 1);
  const label = job.label || String(job.actionId || 'Offsite').replaceAll('_', ' ');
  const travelers = (job.actors || []).map(id => state.entities.find(entity => entity.id === id)?.name || id).join(', ');
  graphics.fillStyle(0x071018, .9);
  graphics.fillRoundedRect(244, 48, 472, 54, 14);
  graphics.lineStyle(2, 0xf1c66a, .72);
  graphics.strokeRoundedRect(250, 54, 460, 42, 10);
  graphics.fillStyle(0xffffff, .16);
  graphics.fillRect(264, 82, 432, 8);
  graphics.fillStyle(0xf1c66a, 1);
  graphics.fillRect(264, 82, 432 * progress, 8);
  setText(offsiteText, `${label}${travelers ? `, ${travelers}` : ''}`, 264, 58);
}

function createText(scene, value, size, color) {
  return scene.add.text(0, 0, value, {
    fontFamily: 'system-ui',
    fontSize: size,
    fontStyle: '900',
    color,
    backgroundColor: 'rgba(7,10,16,.7)',
    padding: { x: 7, y: 4 }
  }).setVisible(false);
}

function setText(text, value, x, y, width = 0, align = 'left') {
  text.setText(String(value));
  text.setPosition(x, y);
  if (width) text.setFixedSize(width, 0).setAlign(align);
  else text.setFixedSize(0, 0).setAlign('left');
  text.setVisible(true);
}

function hideText(text) {
  text.setVisible(false);
  text.setText('');
}

function meter(graphics, x, y, width, value, color) {
  graphics.fillStyle(0x111820, 1);
  graphics.fillRect(x, y, width, 8);
  graphics.fillStyle(color, 1);
  graphics.fillRect(x, y, width * clamp(value, 0, 1), 8);
}

function arcadeFighter(graphics, x, y, color, direction, attack) {
  graphics.fillStyle(0x3a241f, 1);
  graphics.fillCircle(x, y - 30, 9);
  graphics.fillStyle(color, 1);
  graphics.fillRoundedRect(x - 10, y - 21, 20, 28, 5);
  graphics.lineStyle(4, 0x101820, 1);
  graphics.lineBetween(x - 6, y + 5, x - 12, y + 25);
  graphics.lineBetween(x + 6, y + 5, x + 12, y + 25);
  graphics.lineStyle(4, 0x3a241f, 1);
  graphics.lineBetween(x + direction * 8, y - 13, x + direction * (attack ? 31 : 18), y - (attack ? 18 : 5));
}

function trackPoint(screen, progress, radiusX, radiusY) {
  const angle = Number(progress || 0) * Math.PI * 2 - Math.PI / 2;
  return { x: screen.x + 110 + Math.cos(angle) * radiusX, y: screen.y + 70 + Math.sin(angle) * radiusY };
}

function rotatedRect(centerX, centerY, width, height, angle) {
  return [
    rotatePoint(centerX - width / 2, centerY - height / 2, centerX, centerY, angle),
    rotatePoint(centerX + width / 2, centerY - height / 2, centerX, centerY, angle),
    rotatePoint(centerX + width / 2, centerY + height / 2, centerX, centerY, angle),
    rotatePoint(centerX - width / 2, centerY + height / 2, centerX, centerY, angle)
  ];
}

function rotatePoint(x, y, centerX, centerY, angle) {
  const cosine = Math.cos(angle);
  const sine = Math.sin(angle);
  const dx = x - centerX;
  const dy = y - centerY;
  return { x: centerX + dx * cosine - dy * sine, y: centerY + dx * sine + dy * cosine };
}

function fillPolygon(graphics, points) {
  graphics.beginPath();
  graphics.moveTo(points[0].x, points[0].y);
  for (let index = 1; index < points.length; index += 1) graphics.lineTo(points[index].x, points[index].y);
  graphics.closePath();
  graphics.fillPath();
}

function strokePolygon(graphics, points) {
  graphics.beginPath();
  graphics.moveTo(points[0].x, points[0].y);
  for (let index = 1; index < points.length; index += 1) graphics.lineTo(points[index].x, points[index].y);
  graphics.closePath();
  graphics.strokePath();
}

function isBikeLike(vehicle) {
  const kind = String(vehicle.vehicleKind || vehicle.kind || '').toLowerCase();
  return kind === 'bike' || kind === 'bicycle' || kind === 'motorbike' || kind === 'atv';
}

function vehicleColor(vehicle) {
  const kind = String(vehicle.vehicleKind || vehicle.kind || '').toLowerCase();
  if (kind.includes('convertible')) return 0xb13b49;
  if (kind.includes('suv') || kind === 'car') return 0x34495e;
  if (kind.includes('motor')) return 0x7d4e3c;
  if (kind.includes('atv')) return 0x536b39;
  return 0x3f5968;
}

function modeLabel(mode) {
  if (mode === 'fighter') return 'NEON FIGHTER';
  if (mode === 'pong') return 'ORBIT PONG';
  return 'NIGHT RACER';
}

function clamp(value, minimum, maximum) {
  return Math.max(minimum, Math.min(maximum, value));
}
