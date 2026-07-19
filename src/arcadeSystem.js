import { getObject } from './world.js';

const ARCADE_ACTIONS = new Set(['arcade', 'arcade_together', 'arcade_fighter', 'arcade_pong', 'arcade_racer']);
const MODES = ['fighter', 'pong', 'racer'];

export function updateArcadeSystem(state, dt) {
  const actors = (state.entities || []).filter(isArcadeActor);
  if (!actors.length) {
    state.arcadeGame = null;
    return;
  }
  const machine = actors.map(nearestArcade).find(Boolean);
  if (!machine) return;
  const requested = requestedMode(actors[0]);
  if (!state.arcadeGame || state.arcadeGame.machineId !== machine.id || state.arcadeGame.mode !== requested) {
    state.arcadeGame = createGame(machine, requested, actors.map(actor => actor.id));
  }
  const game = state.arcadeGame;
  game.actorIds = actors.map(actor => actor.id);
  game.time += dt;
  for (const actor of actors) {
    actor.pose = 'arcade_play';
    actor.action = `Arcade: ${modeLabel(game.mode)}`;
    actor.lastHeading = 0;
  }
  if (game.mode === 'fighter') updateFighter(game, dt);
  else if (game.mode === 'pong') updatePong(game, dt);
  else updateRacer(game, dt);
}

export function drawArcadeSystem(ctx, state) {
  const game = state.arcadeGame;
  if (!game || game.floor !== state.floor) return;
  const machine = getObject(game.machineId);
  if (!machine) return;
  drawTopDownCabinet(ctx, machine, game);
  drawArcadeHands(ctx, state, game, machine);
  if (game.expanded) drawExpandedArcade(ctx, game);
}

function isArcadeActor(entity) {
  if (!entity || entity.hidden || entity.type !== 'person' || Number(entity.actionT || 0) <= 0) return false;
  const id = String(entity.currentActionId || '').toLowerCase();
  return ARCADE_ACTIONS.has(id) || String(entity.action || '').toLowerCase().includes('arcade');
}

function nearestArcade(actor) {
  const candidates = ['arcade_machine', 'lab_game_console'].map(getObject).filter(object => object && object.floor === actor.floor);
  return candidates.sort((a, b) => distanceTo(actor, a) - distanceTo(actor, b))[0] || null;
}

function distanceTo(actor, object) {
  return Math.hypot(actor.x - (object.x + object.w / 2), actor.y - (object.y + object.h / 2));
}

function requestedMode(actor) {
  const id = String(actor.currentActionId || '').toLowerCase();
  if (id.includes('fighter')) return 'fighter';
  if (id.includes('pong')) return 'pong';
  if (id.includes('racer')) return 'racer';
  const seed = Math.abs(hash(actor.id + Math.floor((actor.actionTotal || 1) * 10)));
  return MODES[seed % MODES.length];
}

function createGame(machine, mode, actorIds) {
  return {
    machineId: machine.id,
    floor: machine.floor,
    actorIds,
    mode,
    time: 0,
    expanded: false,
    playerControl: false,
    inputX: 0,
    inputY: 0,
    buttons: [false, false, false],
    fighter: { hpA: 100, hpB: 100, xA: 48, xB: 172, hitT: 0, round: 1 },
    pong: { leftY: 66, rightY: 66, ballX: 110, ballY: 66, vx: 92, vy: 58, scoreA: 0, scoreB: 0 },
    racer: { progressA: 0, progressB: .08, speedA: .18, speedB: .17, lapA: 0, lapB: 0, steer: 0 }
  };
}

function updateFighter(game, dt) {
  const fighter = game.fighter;
  fighter.hitT -= dt;
  if (!game.playerControl) {
    game.inputX = Math.sin(game.time * 2.1);
    game.inputY = Math.cos(game.time * 1.4);
    game.buttons[0] = Math.sin(game.time * 4.6) > .72;
    game.buttons[1] = false;
  }
  fighter.xA = clamp(fighter.xA + game.inputX * dt * 38, 34, 104);
  fighter.xB = clamp(fighter.xB + Math.sin(game.time * 1.7) * dt * 18, 120, 188);
  if (fighter.hitT <= 0 && (game.buttons[0] || Math.cos(game.time * 3.7) > .80)) {
    const playerHits = game.buttons[0] || Math.sin(game.time * 1.17) > 0;
    if (playerHits) fighter.hpB = Math.max(0, fighter.hpB - 7);
    else fighter.hpA = Math.max(0, fighter.hpA - 7);
    fighter.hitT = .42;
  }
  if (fighter.hpA <= 0 || fighter.hpB <= 0) {
    fighter.round += 1;
    fighter.hpA = 100;
    fighter.hpB = 100;
  }
}

function updatePong(game, dt) {
  const pong = game.pong;
  if (!game.playerControl) game.inputY = Math.sin(game.time * 2.8);
  pong.leftY = clamp(pong.leftY + game.inputY * dt * 78, 20, 112);
  pong.rightY = clamp(pong.ballY + Math.sin(game.time * 1.3) * 10, 20, 112);
  pong.ballX += pong.vx * dt;
  pong.ballY += pong.vy * dt;
  if (pong.ballY < 10 || pong.ballY > 124) {
    pong.vy *= -1;
    pong.ballY = clamp(pong.ballY, 10, 124);
  }
  if (pong.ballX < 18 && Math.abs(pong.ballY - pong.leftY) < 26) {
    pong.vx = Math.abs(pong.vx) * 1.035;
    pong.ballX = 18;
  }
  if (pong.ballX > 202 && Math.abs(pong.ballY - pong.rightY) < 26) {
    pong.vx = -Math.abs(pong.vx) * 1.035;
    pong.ballX = 202;
  }
  if (pong.ballX < -8 || pong.ballX > 228) {
    if (pong.ballX < 0) pong.scoreB += 1;
    else pong.scoreA += 1;
    pong.ballX = 110;
    pong.ballY = 66;
    pong.vx = Math.random() < .5 ? -92 : 92;
    pong.vy = 58 * (Math.random() < .5 ? -1 : 1);
    if (pong.scoreA >= 5 || pong.scoreB >= 5) {
      pong.scoreA = 0;
      pong.scoreB = 0;
    }
  }
}

function updateRacer(game, dt) {
  const racer = game.racer;
  if (!game.playerControl) {
    game.inputX = Math.sin(game.time * 1.8);
    game.buttons[0] = true;
  }
  racer.steer = game.inputX;
  racer.speedA = game.buttons[0] ? clamp(.18 + Math.abs(game.inputX) * .02, .16, .25) : .12;
  racer.speedB = clamp(.165 + Math.cos(game.time * .63) * .022, .12, .225);
  racer.progressA += racer.speedA * dt;
  racer.progressB += racer.speedB * dt;
  if (racer.progressA >= 1) {
    racer.progressA -= 1;
    racer.lapA += 1;
  }
  if (racer.progressB >= 1) {
    racer.progressB -= 1;
    racer.lapB += 1;
  }
  if (racer.lapA >= 3 || racer.lapB >= 3) {
    racer.lapA = 0;
    racer.lapB = 0;
    racer.progressA = 0;
    racer.progressB = .08;
  }
}

function drawTopDownCabinet(ctx, machine, game) {
  const centerX = machine.x + machine.w / 2;
  const centerY = machine.y + machine.h / 2;
  const width = Math.max(54, machine.w + 12);
  const height = Math.max(92, machine.h + 8);
  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.fillStyle = 'rgba(0,0,0,.25)';
  roundedPath(ctx, -width * .48 + 5, -height * .48 + 7, width * .96, height * .96, 12);
  ctx.fill();
  ctx.fillStyle = '#17202a';
  roundedPath(ctx, -width * .50, -height * .50, width, height, 12);
  ctx.fill();
  ctx.strokeStyle = '#080c11';
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.fillStyle = '#24313d';
  ctx.beginPath();
  ctx.moveTo(-width * .39, -height * .43);
  ctx.lineTo(width * .39, -height * .43);
  ctx.lineTo(width * .30, -height * .02);
  ctx.lineTo(-width * .30, -height * .02);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#51616e';
  ctx.lineWidth = 2;
  ctx.stroke();

  const screen = { x: -width * .29, y: -height * .36, w: width * .58, h: height * .27 };
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(screen.x + 3, screen.y);
  ctx.lineTo(screen.x + screen.w - 3, screen.y);
  ctx.lineTo(screen.x + screen.w, screen.y + screen.h);
  ctx.lineTo(screen.x, screen.y + screen.h);
  ctx.closePath();
  ctx.clip();
  drawMiniGame(ctx, game, screen);
  ctx.restore();

  ctx.fillStyle = '#3e4d58';
  ctx.beginPath();
  ctx.moveTo(-width * .33, 0);
  ctx.lineTo(width * .33, 0);
  ctx.lineTo(width * .43, height * .24);
  ctx.lineTo(-width * .43, height * .24);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#0d1218';
  ctx.stroke();
  ctx.fillStyle = '#74e6ff';
  ctx.beginPath();
  ctx.arc(-width * .12, height * .11, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ff75df';
  ctx.beginPath();
  ctx.arc(width * .14, height * .10, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#f1c66a';
  ctx.beginPath();
  ctx.arc(width * .25, height * .15, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#111820';
  roundedPath(ctx, -width * .39, height * .28, width * .78, height * .13, 5);
  ctx.fill();
  ctx.restore();
}

function drawExpandedArcade(ctx, game) {
  const panel = { x: 66, y: 52, w: 828, h: 616 };
  ctx.save();
  ctx.fillStyle = 'rgba(4,7,12,.94)';
  ctx.fillRect(0, 0, 960, 720);
  ctx.fillStyle = '#151d28';
  roundedPath(ctx, panel.x, panel.y, panel.w, panel.h, 24);
  ctx.fill();
  ctx.strokeStyle = '#74e6ff';
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.fillStyle = '#f1c66a';
  ctx.font = '900 24px system-ui';
  ctx.fillText(modeLabel(game.mode), panel.x + 26, panel.y + 38);
  ctx.fillStyle = '#f8fbff';
  ctx.font = '900 18px system-ui';
  ctx.fillText('CLOSE', panel.x + panel.w - 92, panel.y + 38);
  const screen = { x: panel.x + 42, y: panel.y + 62, w: panel.w - 84, h: 360 };
  ctx.save();
  roundedPath(ctx, screen.x, screen.y, screen.w, screen.h, 16);
  ctx.clip();
  drawMiniGame(ctx, game, screen);
  ctx.restore();
  ctx.fillStyle = 'rgba(116,230,255,.13)';
  ctx.beginPath();
  ctx.arc(210, 590, 86, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#74e6ff';
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.fillStyle = '#74e6ff';
  ctx.font = '900 15px system-ui';
  ctx.fillText('MOVE', 188, 596);
  for (const [x, label, color] of [[730, 'A', '#ff75df'], [842, 'B', '#f1c66a']]) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, 584, 48, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#071018';
    ctx.font = '900 24px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText(label, x, 592);
  }
  ctx.textAlign = 'left';
  ctx.restore();
}

function drawMiniGame(ctx, game, screen) {
  if (game.mode === 'fighter') drawFighter(ctx, game, screen);
  else if (game.mode === 'pong') drawPong(ctx, game, screen);
  else drawRacer(ctx, game, screen);
}

function drawFighter(ctx, game, screen) {
  const fighterState = game.fighter;
  const sx = screen.w / 220;
  const sy = screen.h / 142;
  ctx.fillStyle = '#33203c';
  ctx.fillRect(screen.x, screen.y, screen.w, screen.h);
  ctx.fillStyle = '#632f51';
  ctx.fillRect(screen.x, screen.y + 88 * sy, screen.w, 54 * sy);
  meter(ctx, screen.x + 10 * sx, screen.y + 10 * sy, 80 * sx, fighterState.hpA / 100, '#74e6ff');
  meter(ctx, screen.x + 130 * sx, screen.y + 10 * sy, 80 * sx, fighterState.hpB / 100, '#ff75df');
  fighter(ctx, screen.x + fighterState.xA * sx, screen.y + 95 * sy, '#74e6ff', 1, game.buttons[0], sx, sy);
  fighter(ctx, screen.x + fighterState.xB * sx, screen.y + 95 * sy, '#ff75df', -1, false, sx, sy);
}

function fighter(ctx, x, y, color, direction, attack, sx, sy) {
  circle(ctx, x, y - 30 * sy, 9 * Math.min(sx, sy), '#3a241f');
  round(ctx, x - 10 * sx, y - 21 * sy, 20 * sx, 28 * sy, 5, color);
  line(ctx, x - 6 * sx, y + 5 * sy, x - 12 * sx, y + 25 * sy, '#101820', 4 * Math.min(sx, sy));
  line(ctx, x + 6 * sx, y + 5 * sy, x + 12 * sx, y + 25 * sy, '#101820', 4 * Math.min(sx, sy));
  line(ctx, x + direction * 8 * sx, y - 13 * sy, x + direction * (attack ? 31 : 18) * sx, y - (attack ? 18 : 5) * sy, '#3a241f', 4 * Math.min(sx, sy));
}

function drawPong(ctx, game, screen) {
  const pong = game.pong;
  const sx = screen.w / 220;
  const sy = screen.h / 142;
  ctx.fillStyle = '#071018';
  ctx.fillRect(screen.x, screen.y, screen.w, screen.h);
  ctx.strokeStyle = 'rgba(255,255,255,.25)';
  ctx.setLineDash([5, 5]);
  line(ctx, screen.x + 110 * sx, screen.y + 4, screen.x + 110 * sx, screen.y + screen.h - 4, 'rgba(255,255,255,.25)', 1);
  ctx.setLineDash([]);
  ctx.fillStyle = '#74e6ff';
  ctx.fillRect(screen.x + 8 * sx, screen.y + (pong.leftY - 20) * sy, 7 * sx, 40 * sy);
  ctx.fillStyle = '#ff75df';
  ctx.fillRect(screen.x + 205 * sx, screen.y + (pong.rightY - 20) * sy, 7 * sx, 40 * sy);
  circle(ctx, screen.x + pong.ballX * sx, screen.y + pong.ballY * sy, 5 * Math.min(sx, sy), '#f1c66a');
}

function drawRacer(ctx, game, screen) {
  const racer = game.racer;
  const cx = screen.x + screen.w / 2;
  const cy = screen.y + screen.h / 2;
  const rx = screen.w * .355;
  const ry = screen.h * .34;
  ctx.fillStyle = '#1c3125';
  ctx.fillRect(screen.x, screen.y, screen.w, screen.h);
  ctx.strokeStyle = '#777d80';
  ctx.lineWidth = Math.max(7, screen.h * .17);
  ctx.beginPath();
  ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = '#f1c66a';
  ctx.lineWidth = Math.max(1, screen.h * .014);
  ctx.setLineDash([screen.w * .035, screen.w * .035]);
  ctx.beginPath();
  ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);
  raceCar(ctx, trackPoint(cx, cy, racer.progressA, rx, ry), '#74e6ff', screen);
  raceCar(ctx, trackPoint(cx, cy, racer.progressB, rx * .80, ry * .74), '#ff75df', screen);
  ctx.fillStyle = '#f8fbff';
  ctx.font = `900 ${Math.max(8, screen.h * .07)}px system-ui`;
  ctx.fillText(`LAPS ${racer.lapA}/3  ${racer.lapB}/3`, screen.x + screen.w * .28, screen.y + screen.h * .14);
}

function trackPoint(cx, cy, progress, rx, ry) {
  const angle = progress * Math.PI * 2 - Math.PI / 2;
  return { x: cx + Math.cos(angle) * rx, y: cy + Math.sin(angle) * ry, angle: angle + Math.PI / 2 };
}

function raceCar(ctx, point, color, screen) {
  const scale = Math.max(.35, Math.min(screen.w / 220, screen.h / 142));
  ctx.save();
  ctx.translate(point.x, point.y);
  ctx.rotate(point.angle);
  round(ctx, -6 * scale, -11 * scale, 12 * scale, 22 * scale, 4, color);
  ctx.restore();
}

function drawArcadeHands(ctx, state, game, machine) {
  const actors = game.actorIds.map(id => state.entities.find(entity => entity.id === id)).filter(Boolean);
  actors.forEach((actor, index) => {
    const control = { x: machine.x + machine.w / 2 + (index ? 9 : -9), y: machine.y + machine.h * .72 };
    const shoulderY = actor.y - 4;
    const sway = game.inputX * 4;
    line(ctx, actor.x - 9, shoulderY, control.x - 6 + sway, control.y, '#5a342b', 4);
    line(ctx, actor.x + 9, shoulderY, control.x + 8, control.y + (game.buttons[0] ? -3 : 1), '#5a342b', 4);
    circle(ctx, control.x - 6 + sway, control.y, 4, '#5a342b');
    circle(ctx, control.x + 8, control.y + (game.buttons[0] ? -3 : 1), 4, '#5a342b');
  });
}

function modeLabel(mode) {
  if (mode === 'fighter') return 'NEON FIGHTER';
  if (mode === 'pong') return 'ORBIT PONG';
  return 'NIGHT RACER';
}

function meter(ctx, x, y, width, value, color) {
  ctx.fillStyle = 'rgba(0,0,0,.45)';
  ctx.fillRect(x, y, width, 7);
  ctx.fillStyle = color;
  ctx.fillRect(x, y, width * clamp(value, 0, 1), 7);
}

function roundedPath(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(x, y, width, height, radius);
  else ctx.rect(x, y, width, height);
}

function round(ctx, x, y, width, height, radius, fill) {
  roundedPath(ctx, x, y, width, height, radius);
  ctx.fillStyle = fill;
  ctx.fill();
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

function circle(ctx, x, y, radius, fill) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = fill;
  ctx.fill();
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function hash(value) {
  let output = 0;
  for (let index = 0; index < value.length; index += 1) output = ((output << 5) - output + value.charCodeAt(index)) | 0;
  return output;
}
